import crypto from 'crypto';

class SecureStorage {
  private storageKey = 'ovomarket_secure_store';

  async setItem(key: string, value: string): Promise<void> {
    const store = this.getStore();
    store[key] = value;
    localStorage.setItem(this.storageKey, JSON.stringify(store));
  }

  async getItem(key: string): Promise<string | null> {
    const store = this.getStore();
    return store[key] || null;
  }

  async removeItem(key: string): Promise<void> {
    const store = this.getStore();
    delete store[key];
    localStorage.setItem(this.storageKey, JSON.stringify(store));
  }

  private getStore(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }
}

export default new SecureStorage();
