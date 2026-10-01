import SecureStorage from './storage';

class AIClient {
  private apiKey: string | null = null;
  private baseUrl: string | null = null;
  private model: string | null = null;

  private async init(): Promise<void> {
    this.apiKey = await SecureStorage.getItem('ai_api_key');
    this.baseUrl = await SecureStorage.getItem('ai_base_url') || 'https://api.openai.com/v1/chat/completions';
    this.model = await SecureStorage.getItem('ai_model') || 'gpt-3.5-turbo';
    if (!this.apiKey) throw new Error('AI credentials not configured');
  }

  async ask(prompt: string): Promise<string> {
    await this.init();

    const response = await fetch(this.baseUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are Ovo AI, the private AI assistant for Ovo Market. Analyze real Shopify data only. Never invent data. If information is unavailable, say DATA NOT AVAILABLE.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'DATA NOT AVAILABLE';
  }
}

export default AIClient;
