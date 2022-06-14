import axios, { AxiosInstance } from 'axios';

export class GupshupClientApi {
  private readonly axios: AxiosInstance;

  constructor(private readonly source: string, private readonly apiKey: string) {
    this.axios = axios.create({
      baseURL: 'https://api.gupshup.io/sm/api/v1/msg',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async sendMessage(destination: string, message: Record<string, any>): Promise<string> {
    const res = await this.axios.post(
      '/',
      new URLSearchParams({
        channel: 'whatsapp',
        source: this.source,
        destination,
        message: JSON.stringify(message),
      }),
      {
        headers: {
          apiKey: this.apiKey,
        },
      },
    );

    return res.data.messageId;
  }
}
