export const CHAT_SCREEN_TEST_ID = 'ChatScreen';

export const SOCKET_EVENT_TYPE = 'message';

export const CONVERSATION_ACTION_THROTTLE = 1000;

export const GENESYS_AXIOS_TIME_OUT = 3000;

export const MAX_API_RETRY = 1;

export const GUEST_NAME_MAX_LENGTH = 50;
export const GUEST_NAME_MIN_LENGTH = 3;
export const GUEST_PHONE_MAX_LENGTH = 10;

export enum GENESYS_CHAT_ERROR {
  CHAT_INACTIVE_ERROR_CODE = 'chat.error.conversation.state',
  UNAUTHENTICATED = 'authentication.required',
  UNAUTHORIZED = 'unauthorized',
}

export enum GENESYS_CHAT_HISTORY_TYPE {
  MEMBER_LEAVE = 'MEMBERLEAVE',
  MEMBER_JOIN = 'MEMBERJOIN',
  STANDARD = 'STANDARD',
}

export enum GENESYS_SYSTEM_MESSAGE_TYPE {
  MEMBER_LEAVE = 'member-leave',
  MEMBER_JOIN = 'member-join',
}

export enum GENESYS_TARGET_TYPE {
  QUEUE = 'queue',
}

export enum EVENT_TYPE {
  MESSAGE = 'message',
  MEMBER_CHANGE = 'member-change',
  TYPING = 'typing-indicator',
}

export enum GENESYS_MESSAGE_TYPE {
  MEMBER_JOIN = 'member-join',
  STANDARD = 'standard',
  MEMBER_LEAVE = 'member-leave',
}

export enum CHAT_GPT_MESSAGE_TYPE {
  STREAMING = 'streaming',
}

export enum CHAT_MEMBER_ROLE {
  AGENT = 'AGENT',
  CUSTOMER = 'CUSTOMER',
  SYSTEM = 'ACD',
  WORKFLOW = 'WORKFLOW',
  ASSISTANT = 'ASSISTANT',
}

export enum CHAT_MEMBER_STATE {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export const CONVERSATION_CHAT_STORAGE_KEY = 'CONVERSATION_CHAT_STORAGE_KEY';
export const CONVERSATION_CHAT_MESSAGE_HISTORY_STORAGE_KEY =
  'CONVERSATION_CHAT_MESSAGE_HISTORY_STORAGE_KEY';

export const MAX_CHAT_MESSAGE_IN_HISTORY = 300;

export const MAX_FILE_SIZE_UPLOAD_MB = 5;
export const MAX_FILE_SIZE_TO_UPLOAD = MAX_FILE_SIZE_UPLOAD_MB * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE_TO_UPLOAD_MULTIPLE_FILES = 10 * 1024 * 1024 * 3; // 30MB
export const MAX_INPUT_LENGTH = 4000;
export const MAX_INPUT_LINE_NUMBER = 4;
export const MAX_LOAD_MORE_MESSAGE_LIMIT = 15;

export const GOOGLE_PDF_VIEWER = 'https://docs.google.com/gview?url=';

export const CUSTOMER_SERVICE_PHONE = '1900 6608';
export const EMAIL_VIKKI_CARE = '19006608@vikki.vn';

export const OPEN_CAMERA_SETTING = {
  mediaType: 'photo',
  forceJpg: true,
  compressImageQuality: 0.7,
};

export const OPEN_LIBRARY_SETTING = {
  mediaType: 'photo',
  multiple: true,
  forceJpg: true,
  compressImageQuality: 0.7,
};

export enum GPT_END_STREAM_SIGNAL {
  DONE = '[DONE]',
  LENGTH = 'length',
  GENERAL = 'GPT_GENERAL_ERROR',
}

export const CHAT_GPT_MAX_TOKEN = 500;

export const CHAT_GPT_TIMEOUT = 3000;

export const CHAT_GPT_FEED = [
  {
    role: 'system',
    content:
      'Tôi là trợ lý ảo của Vikki by HD Bank. Chúng tôi là một ngân hàng kỹ thuật số thuần túy phục vụ thị trường Việt Nam. Chúng tôi cung cấp nhiều loại sản phẩm và dịch vụ bao gồm tiền gửi, cho vay và đầu tư. Liên hệ với chúng tôi qua số hotline 19006608 hoặc truy cập website vikki.vn',
  },
];

export const SAVED_CONVERSATION_LIMIT = 999;
