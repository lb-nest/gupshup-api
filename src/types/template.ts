interface TextTemplateData {
  templateType: 'TEXT';
  header?: string;
}

interface MediaTemplateData {
  templateType: 'IMAGE' | 'DOCUMENT' | 'VIDEO';
  exampleMedia: string;
}

export type TemplateData = {
  elementName: string;
  languageCode: string;
  category: 'TRANSACTIONAL' | 'MARKETING' | 'OTP';
  vertical: string;
  content: string;
  footer?: string;
  buttons?: Array<
    | {
        type: 'QUICK_REPLY';
        text: string;
      }
    | {
        type: 'PHONE_NUMBER';
        text: string;
        phone_number: string;
      }
    | {
        type: 'URL';
        text: string;
        url: string;
        example?: string[];
      }
  >;
  example: string;
  enableSample: true;
} & (TextTemplateData | MediaTemplateData);

export interface Template {
  appId: string;
  category: string;
  createdOn: number;
  data: string;
  elementName: string;
  id: string;
  languageCode: string;
  languagePolicy: string;
  master: boolean;
  meta: string;
  modifiedOn: number;
  namespace: string;
  reason?: string;
  status: 'REJECTED' | 'APPROVED';
  templateType: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'VIDEO';
  vertical: string;
}
