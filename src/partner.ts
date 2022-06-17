import axios, { AxiosInstance } from 'axios';
import jwtDecode from 'jwt-decode';
import { formatDate } from './helpers/format-date';
import { App, Discount, DlrEvent, Rating, Status, Template, Usage, Wallet } from './types';

/**
 * https://www.gupshup.io/docs/partner/
 */
export class GupshupPartnerApi {
  private readonly axios: AxiosInstance;

  private token: string;

  constructor(private readonly email: string, private readonly password: string) {
    this.axios = axios.create({
      baseURL: 'https://partner.gupshup.io/partner',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * Here you can create a template for a particular app.
   */
  async applyForTemplates(
    token: string,
    appId: string,
    template: Record<string, any>,
  ): Promise<Template> {
    const res = await this.axios.post(`/app/${appId}/templates`, new URLSearchParams(template), {
      headers: {
        token,
      },
    });

    return res.data.template;
  }

  /**
   * Using this API, you can upload your sample media and generate a handleId for it.
   * Using the handleId, you can create and submit a template along with a sample media.
   * The handleId is passed in the exampleMedia parameter of the Apply for templates with sample media API.
   */
  async getHandleIdForSampleMedia(
    token: string,
    appId: string,
    file: string,
    fileId: string,
  ): Promise<string> {
    const res = await this.axios.post(
      `/app/${appId}/upload/media`,
      new URLSearchParams({
        file,
        file_id: fileId,
      }),
      {
        headers: {
          token,
        },
      },
    );

    return res.data.handleId;
  }

  /**
   * This will provide you the list of templates for a particular app.
   * You will also get the rejection reason for templates.
   */
  async getTemplates(token: string, appId: string): Promise<Template[]> {
    const res = await this.axios.get(`/app/${appId}/templates`, {
      headers: {
        token,
      },
    });

    return res.data.templates;
  }

  async sendMessageWithTemplateId(
    token: string,
    appId: string,
    message: Record<string, any>,
  ): Promise<string> {
    const res = await this.axios.post(`/app/${appId}/template/msg`, new URLSearchParams(message), {
      headers: {
        token,
      },
    });

    return res.data.messageId;
  }

  /**
   * Using this API, you can delete a template using the elementName for it.
   */
  async deleteTemplate(token: string, appId: string, elementName: string): Promise<void> {
    await this.axios.delete(`/app/${appId}/template/${elementName}`, {
      headers: {
        token,
      },
    });
  }

  /**
   * This api will provide the access token for accessing particular app.
   * You can use this token to get app’s templates , submit templates, send messages etc.
   */
  async getAccessToken(appId: string): Promise<string> {
    const res = await this.axios.get(`/app/${appId}/token`, {
      headers: {
        token: await this.getPartnerToken(this.email, this.password),
      },
    });

    return res.data.token.token;
  }

  /**
   * You have to first use this api to get the token, this will help you in accessing other apis.
   * Currently expirey for the token is 24 hours.
   */
  async getPartnerToken(email: string, password: string): Promise<string> {
    const payload = jwtDecode<any>(this.token);

    if (!payload || payload.exp * 1000 >= Date.now()) {
      const res = await this.axios.post(
        '/account/login',
        new URLSearchParams({
          email,
          password,
        }),
      );

      this.token = res.data.token;
    }

    return this.token;
  }

  async blockUser(
    token: string,
    appId: string,
    phone: string,
    isBlocked: boolean = true,
  ): Promise<void> {
    await this.axios.put(
      `/app/${appId}/block`,
      new URLSearchParams({
        phone,
        isBlocked: String(isBlocked),
      }),
      {
        headers: {
          token,
        },
      },
    );
  }

  /**
   * Using this API, you can enable or disable template messaging for an App.
   */
  async toggleTemplateMessaging(
    token: string,
    appId: string,
    isHSMEnabled: boolean,
  ): Promise<void> {
    await this.axios.put(
      `/app/${appId}/appPreference`,
      new URLSearchParams({
        isHSMEnabled: String(isHSMEnabled),
      }),
      {
        headers: {
          token,
        },
      },
    );
  }

  async checkHealth(token: string, appId: string): Promise<boolean> {
    const res = await this.axios.get(`/app/${appId}/health`, {
      headers: {
        token,
      },
    });

    return res.data.healthy;
  }

  async getUserStatus(token: string, appId: string, phone: string): Promise<Status> {
    const res = await this.axios.get(`/app/${appId}/userStatus?phone=${phone}`, {
      headers: {
        token,
      },
    });

    return res.data.userStatus;
  }

  async getWalletBalance(token: string, appId: string): Promise<Wallet> {
    const res = await this.axios.get(`/app/${appId}/wallet/balance`, {
      headers: {
        token,
      },
    });

    return res.data.walletResponse;
  }

  async optinAppUser(token: string, appId: string, phone: string): Promise<void> {
    await this.axios.put(
      `/app/${appId}/optin`,
      new URLSearchParams({
        phone,
      }),
      {
        headers: {
          token,
        },
      },
    );
  }

  /**
   * You can use this API to check the Quality Rating, and Messaging Limits of your App.
   * For an App, API requests are limited to once every 24 hours.
   */
  async checkQualityRatingAndMessagingLimits(token: string, appId: string): Promise<Rating> {
    const res = await this.axios.get(`/app/${appId}/ratings`, {
      headers: {
        token,
      },
    });

    return res.data.ratings;
  }

  async appLink(appName: string, apiKey: string): Promise<App> {
    const res = await this.axios.post(
      '/account/api/appLink',
      new URLSearchParams({
        appName,
        apiKey,
      }),
      {
        headers: {
          token: await this.getPartnerToken(this.email, this.password),
        },
      },
    );

    return res.data.partnerApps;
  }

  /**
   * This api will provide you the list of Apps which are linked to your account.
   */
  async getAllAppDetails(): Promise<App> {
    const res = await this.axios.get('/account/api/partnerApps', {
      headers: {
        token: await this.getPartnerToken(this.email, this.password),
      },
    });

    return res.data.partnerAppsList;
  }

  /**
   * https://www.gupshup.io/developer/docs/bot-platform/guide/whatsapp-api-documentation#setupcallbackURL
   */
  async setCallbackUrl(token: string, appId: string, callbackUrl: string): Promise<void> {
    await this.axios.put(
      `/app/${appId}/callbackUrl`,
      new URLSearchParams({
        callbackUrl,
      }),
      {
        headers: {
          token,
        },
      },
    );
  }

  /**
   * Using this API, you can update the gupshup fee cap for an app.
   */
  async updateCapping(token: string, appId: string, cap: number): Promise<void> {
    await this.axios.put(
      `/app/${appId}/capping`,
      new URLSearchParams({
        cap: String(cap),
      }),
      {
        headers: {
          token,
        },
      },
    );
  }

  /**
   * Using this API you can get the inbound message logs for the specified duration.
   */
  async getInboundMessageEventLogs(): Promise<unknown> {
    throw new Error('Not Implemented');
  }

  /**
   * Using this API you can get the outbound message logs for the specified date.
   */
  async getOutboundMessageEventLogs(): Promise<unknown> {
    throw new Error('Not Implemented');
  }

  /**
   * Using this API you can get the daily usage breakdown for a particular app ranging between two dates.
   */
  async getAppUsage(token: string, appId: string, from: Date, to: Date): Promise<Usage> {
    const query = new URLSearchParams({
      from: formatDate(from),
      to: formatDate(to),
    });

    const res = await this.axios.get(`/app/${appId}/usage?${query}`, {
      headers: {
        token,
      },
    });

    return res.data.partnerAppUsageList;
  }

  /**
   * Using this API you can get the daily discount, daily bill, and the cumulative bill for a particular app ranging a month.
   */
  async getAppDailyDiscount(token: string, appId: string, date: Date): Promise<Discount[]> {
    const query = new URLSearchParams({
      month: date.getMonth().toString().padStart(2, '0'),
      year: date.getFullYear().toString(),
    });

    const res = await this.axios.get(`/app/${appId}/discount?${query}`, {
      headers: {
        token,
      },
    });

    return res.data.dailyAppDiscountList;
  }

  /**
   * Enable or disable gupshup's automated opt-in message for an app.
   */
  async toggleAutomatedOptinMessage(
    token: string,
    appId: string,
    enableOptinMessage: boolean,
  ): Promise<void> {
    await this.axios.put(
      `/app/${appId}/optinMessagePreference`,
      new URLSearchParams({
        enableOptinMessage: String(enableOptinMessage),
      }),
      {
        headers: {
          token,
        },
      },
    );
  }

  /**
   * Update inbound events that you want to receive on your App's callback URL.
   * You may provide all the values for which you want to receive events.
   * If no values are provided, all events will be deselected.
   */
  async updateDlrEvents(token: string, appId: string, ...modes: DlrEvent[]): Promise<void> {
    await this.axios.put(
      `/app/${appId}/callback/mode`,
      new URLSearchParams({
        modes: modes.length ? modes.join(',') : undefined,
      }),
      {
        headers: {
          token,
        },
      },
    );
  }
}
