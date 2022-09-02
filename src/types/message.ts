/* https://docs.gupshup.io/reference/msg */

interface TextMessageData {
  type: 'text';
  text: string;
}

interface ImageMessageData {
  type: 'image';
  originalUrl: string;
  previewUrl: string;
  caption?: string;
}

interface FileMessageData {
  type: 'file';
  url: string;
  filename: string;
}

interface AudioMessageData {
  type: 'audio';
  url: string;
}

interface VideoMessageData {
  type: 'video';
  url: string;
  caption?: string;
}

interface StickerMessageData {
  type: 'sticker';
  url: string;
}

type MediaMessageData =
  | TextMessageData
  | ImageMessageData
  | FileMessageData
  | VideoMessageData
  | AudioMessageData
  | StickerMessageData;

interface ListMessageData {
  type: 'list';
  title: string;
  body: string;
  msgid?: string;
  globalButtons: Array<{
    type: 'text';
    title: string;
  }>;
  items: Array<{
    title: string;
    subtitle: string;
    options: Array<{
      type: 'text';
      title: string;
      description?: string;
      postbackText?: string;
    }>;
  }>;
}

interface QuickReplyMessageData {
  type: 'quick_reply';
  msgid?: string;
  content: {
    text: string;
    caption?: string;
  } & (
    | {
        type: 'text';
        header?: string;
      }
    | {
        type: 'image' | 'video';
        url: string;
      }
    | {
        type: 'file';
        url: string;
        filename: string;
      }
  );
  options: Array<{
    type: 'text';
    title: string;
    postbackText: string;
  }>;
}

interface LocationMessageData {
  type: 'location';
  longitude: number;
  latitude: number;
  name: string;
  address: string;
}

interface ContactMessageData {
  type: 'contact';
  contact: {
    addresses: Array<{
      city: string;
      country: string;
      countryCode: string;
      state: string;
      street: string;
      type: 'HOME' | 'WORK';
      zip: string;
    }>;
    birthday: string;
    emails: Array<{
      email: string;
      type: 'Personal' | 'Work';
    }>;
    name: {
      firstName: string;
      formattedName: string;
      lastName: string;
    };
    org: {
      company: string;
      department: string;
      title: string;
    };
    phones: Array<
      | {
          phone: string;
          type: 'HOME';
        }
      | {
          phone: string;
          type: 'WORK';
          wa_id: string;
        }
    >;
    urls: Array<{
      url: string;
      type: 'WORK';
    }>;
  };
}

export type MessageData =
  | MediaMessageData
  | ListMessageData
  | QuickReplyMessageData
  | LocationMessageData
  | ContactMessageData;
