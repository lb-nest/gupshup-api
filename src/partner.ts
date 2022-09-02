import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import jwtDecode from 'jwt-decode';
import { formatDate } from './helpers/format-date';
import {
  App,
  AppDailyDiscount,
  AppLink,
  AppUsage,
  DlrEvent,
  ProfileDetails,
  Template,
  TemplateData,
  UserStatus,
  WalletBalance,
} from './types';

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
  async applyForTemplates(token: string, appId: string, template: TemplateData): Promise<Template> {
    const res = await this.axios.post(
      `/app/${appId}/templates`,
      new URLSearchParams(
        Object.fromEntries(
          Object.entries(template).map(([key, value]) => [
            key,
            typeof value === 'object' ? JSON.stringify(value) : value?.toString(),
          ]),
        ),
      ),
      {
        headers: {
          token,
          authorization: token,
        },
      },
    );

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
    file: Buffer,
    fileType: string,
  ): Promise<string> {
    const form = new FormData();

    form.append('file', file);
    form.append('file_type', fileType);

    const res = await this.axios.post(`/app/${appId}/upload/media`, form, {
      headers: {
        ...form.getHeaders(),
        token,
        authorization: token,
      },
    });

    return res.data.handleId.message;
  }

  /**
   * This will provide you the list of templates for a particular app.
   * You will also get the rejection reason for templates.
   */
  async getTemplates(token: string, appId: string): Promise<Template[]> {
    const res = await this.axios.get(`/app/${appId}/templates`, {
      headers: {
        token,
        authorization: token,
      },
    });

    return res.data.templates;
  }

  async sendMessageWithTemplateId(
    token: string,
    appId: string,
    message: {
      id: number;
      params: string[];
    },
  ): Promise<string> {
    const res = await this.axios.post(
      `/app/${appId}/template/msg`,
      new URLSearchParams(
        Object.fromEntries(
          Object.entries(message).map(([key, value]) => [
            key,
            typeof value === 'object' ? JSON.stringify(value) : value?.toString(),
          ]),
        ),
      ),
      {
        headers: {
          token,
          authorization: token,
        },
      },
    );

    return res.data.messageId;
  }

  /**
   * Using this API, you can delete a template using the elementName for it.
   */
  async deleteTemplate(token: string, appId: string, elementName: string): Promise<void> {
    await this.axios.delete(`/app/${appId}/template/${elementName}`, {
      headers: {
        token,
        authorization: token,
      },
    });
  }

  /**
   * This api will provide the access token for accessing particular app.
   * You can use this token to get app’s templates, submit templates, send messages etc.
   */
  async getAccessToken(appId: string): Promise<string> {
    const token = await this.getPartnerToken(this.email, this.password);
    const res = await this.axios.get(`/app/${appId}/token`, {
      headers: {
        token,
        authorization: token,
      },
    });

    return res.data.token.token;
  }

  /**
   * You have to first use this api to get the token, this will help you in accessing other apis.
   * Currently expirey for the token is 24 hours.
   */
  async getPartnerToken(email: string, password: string): Promise<string> {
    if (!this.token || jwtDecode<{ exp: number }>(this.token).exp * 1000 - Date.now() > 0) {
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
          authorization: token,
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
    isHsmEnabled: boolean,
  ): Promise<void> {
    await this.axios.put(
      `/app/${appId}/appPreference`,
      new URLSearchParams({
        isHSMEnabled: String(isHsmEnabled),
      }),
      {
        headers: {
          token,
          authorization: token,
        },
      },
    );
  }

  async checkHealth(token: string, appId: string): Promise<boolean> {
    const res = await this.axios.get(`/app/${appId}/health`, {
      headers: {
        token,
        authorization: token,
      },
    });

    return res.data.healthy;
  }

  async getUserStatus(token: string, appId: string, phone: string): Promise<UserStatus> {
    const res = await this.axios.get(`/app/${appId}/userStatus?phone=${phone}`, {
      headers: {
        token,
        authorization: token,
      },
    });

    return res.data.userStatus;
  }

  async getWalletBalance(token: string, appId: string): Promise<WalletBalance> {
    const res = await this.axios.get(`/app/${appId}/wallet/balance`, {
      headers: {
        token,
        authorization: token,
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
          authorization: token,
        },
      },
    );
  }

  /**
   * You can use this API to check the Quality Rating, and Messaging Limits of your App.
   * For an App, API requests are limited to once every 24 hours.
   */
  async checkQualityRatingAndMessagingLimits(token: string, appId: string): Promise<unknown> {
    throw new Error('Not implemented');
  }

  async appLink(appName: string, apiKey: string): Promise<AppLink> {
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
  async getAllAppDetails(): Promise<App[]> {
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
          authorization: token,
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
          authorization: token,
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
  async getAppUsage(token: string, appId: string, from: Date, to: Date): Promise<AppUsage[]> {
    const query = new URLSearchParams({
      from: formatDate(from),
      to: formatDate(to),
    });

    const res = await this.axios.get(`/app/${appId}/usage?${query}`, {
      headers: {
        token,
        authorization: token,
      },
    });

    return res.data.partnerAppUsageList;
  }

  /**
   * Using this API you can get the daily discount, daily bill, and the cumulative bill for a particular app ranging a month.
   */
  async getAppDailyDiscount(token: string, appId: string, date: Date): Promise<AppDailyDiscount[]> {
    const query = new URLSearchParams({
      month: date.getMonth().toString().padStart(2, '0'),
      year: date.getFullYear().toString(),
    });

    const res = await this.axios.get(`/app/${appId}/discount?${query}`, {
      headers: {
        token,
        authorization: token,
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
          authorization: token,
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
        modes: modes.length > 0 ? modes.join(',') : undefined,
      }),
      {
        headers: {
          token,
          authorization: token,
        },
      },
    );
  }

  async getProfileDetails(token: string, appId: string): Promise<ProfileDetails> {
    const res = await this.axios.get(`/app/${appId}/business/profile`, {
      headers: {
        token,
        authorization: token,
      },
    });

    return res.data.profile;
  }

  async getAbout(token: string, appId: string): Promise<string> {
    const res = await this.axios.get(`/app/${appId}/business/profile/about`, {
      headers: {
        token,
        authorization: token,
      },
    });

    return res.data.about?.message;
  }

  async updateProfileDetails(token: string, appId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async updateAbout(token: string, appId: string, about: string): Promise<void> {
    await this.axios.put(
      `/app/${appId}/business/profile/about`,
      new URLSearchParams({
        about,
      }),
      {
        headers: {
          token,
          authorization: token,
        },
      },
    );
  }

  async getProfilePicture(token: string, appId: string): Promise<string> {
    const res = await this.axios.get(`/app/${appId}/business/profile/photo`, {
      headers: {
        token,
        authorization: token,
      },
    });

    return res.data.message;
  }

  async updateProfilePicture(token: string, appId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async removeProfilePicture(token: string, appId: string): Promise<void> {
    await this.axios.delete(`/app/${appId}/business/profile/photo`, {
      headers: {
        token,
        authorization: token,
      },
    });
  }
}
