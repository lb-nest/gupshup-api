import axios, { AxiosInstance } from 'axios';
import { MessageData } from './types';

export class GupshupClientApi {
  private readonly axios: AxiosInstance;

  constructor(private readonly source: string, apiKey: string) {
    this.axios = axios.create({
      baseURL: 'https://api.gupshup.io/sm/api/v1/msg',
      headers: {
        authorization: apiKey,
        apiKey,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async sendMessage(destination: string, message: MessageData): Promise<string> {
    const res = await this.axios.post(
      '/',
      new URLSearchParams({
        channel: 'whatsapp',
        source: this.source,
        destination,
        message: JSON.stringify(message),
      }),
    );

    return res.data.messageId;
  }
}
