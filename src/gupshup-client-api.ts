import axios from 'axios';
import { Message } from './types';

export class GupshupClientApi {
  private readonly endpoint = 'https://api.gupshup.io/sm/api/v1/msg';

  constructor(
    private readonly source: string,
    private readonly sourceName: string,
    private readonly apiKey: string,
  ) {}

  async sendMessage(destination: string, message: Message): Promise<string> {
    const res = await axios.post<any>(
      this.endpoint,
      new URLSearchParams({
        channel: 'whatsapp',
        source: this.source,
        destination,
        message: JSON.stringify(message),
        'src.name': this.sourceName,
      }),
      {
        headers: {
          apiKey: this.apiKey,
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return res.data.messageId;
  }
}
