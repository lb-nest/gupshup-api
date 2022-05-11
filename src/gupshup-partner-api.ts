import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { GupshupApp } from './types';

export class GupshupPartnerApi {
  private readonly endpoint = 'https://partner.gupshup.io/partner';

  private token: string;

  constructor(private readonly email: string, private readonly password: string) {}

  async login(email: string, password: string): Promise<string> {
    const payload = <jwt.JwtPayload>jwt.decode(this.token);
    if (payload.exp * 1000 >= Date.now()) {
      const res = await axios.post(
        this.endpoint.concat('/account/login'),
        new URLSearchParams({
          email,
          password,
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.token = res.data.token;
    }

    return this.token;
  }

  async linkApp(appName: string, apiKey: string): Promise<GupshupApp> {
    const res = await axios.post(
      this.endpoint.concat('/account/api/appLink'),
      new URLSearchParams({
        appName,
        apiKey,
      }),
      {
        headers: {
          authorization: await this.login(this.email, this.password),
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return res.data.partnerApps;
  }

  async createToken(appId: string): Promise<string> {
    const res = await axios.get(this.endpoint.concat(`/app/${appId}/token`), {
      headers: {
        token: await this.login(this.email, this.password),
      },
    });

    return res.data.token.token;
  }

  async setWebhook(appId: string, apiKey: string, callbackUrl: string): Promise<void> {
    await axios.put(
      this.endpoint.concat(`/app/${appId}/callbackUrl`),
      new URLSearchParams({
        callbackUrl,
      }),
      {
        headers: {
          authorization: apiKey,
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }
}
