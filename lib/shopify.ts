import SecureStorage from './storage';

class ShopifyClient {
  private domain: string | null = null;
  private token: string | null = null;

  private async init(): Promise<void> {
    this.domain = await SecureStorage.getItem('shopify_domain');
    this.token = await SecureStorage.getItem('shopify_token');
    if (!this.domain || !this.token) {
      throw new Error('Shopify credentials not configured');
    }
  }

  private getEndpoint(): string {
    const clean = this.domain!
      .replace(/https:\/\//, '')
      .replace(/http:\/\//, '')
      .replace(/\/$/, '');
    return `https://${clean}/admin/api/2025-10/graphql.json`;
  }

  private async request<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.token!,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) throw new Error(`Shopify API error: ${response.status}`);

    const data = await response.json();
    if (data.errors) throw new Error(`GraphQL error: ${data.errors[0]?.message}`);
    return data.data;
  }

  async getStoreInfo() {
    await this.init();
    const query = `
      query {
        shop {
          id
          name
          email
          myshopifyDomain
        }
      }
    `;
    const result = await this.request<any>(query);
    return {
      id: result.shop.id,
      name: result.shop.name,
      domain: result.shop.myshopifyDomain || 'DATA NOT AVAILABLE',
      email: result.shop.email || null,
    };
  }

  async getProducts(first: number = 100) {
    await this.init();
    const query = `
      query($first: Int!) {
        products(first: $first) {
          nodes {
            id
            title
            handle
            status
            variants(first: 100) {
              nodes {
                price
                inventoryQuantity
              }
            }
          }
        }
      }
    `;
    const result = await this.request<any>(query, { first });
    return (result.products?.nodes || []).map((node: any) => {
      const price = node.variants?.nodes?.[0]?.price
        ? parseFloat(node.variants.nodes[0].price)
        : undefined;
      const inventory = node.variants?.nodes?.reduce(
        (sum: number, v: any) => sum + (v.inventoryQuantity || 0),
        0
      ) || 0;
      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        status: node.status,
        price,
        inventory,
        imageURL: null,
      };
    });
  }

  async getOrders(first: number = 100) {
    await this.init();
    const query = `
      query($first: Int!) {
        orders(first: $first, sortKey: CREATED_AT, reverse: true) {
          nodes {
            id
            name
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            displayFinancialStatus
            displayFulfillmentStatus
          }
        }
      }
    `;
    const result = await this.request<any>(query, { first });
    return (result.orders?.nodes || []).map((node: any) => ({
      id: node.id,
      name: node.name,
      total: parseFloat(node.totalPriceSet?.shopMoney?.amount || '0'),
      currency: node.totalPriceSet?.shopMoney?.currencyCode || 'USD',
      financialStatus: node.displayFinancialStatus || null,
      fulfillmentStatus: node.displayFulfillmentStatus || null,
      createdAt: node.createdAt,
    }));
  }
}

export default ShopifyClient;
