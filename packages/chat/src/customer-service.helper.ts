import {ToastManager} from '@galaxyfinx/react-native-common-ui';
import {AxiosError} from 'axios';
import {t} from 'i18next';
import {unescape} from 'lodash';
import moment from 'moment';

import {
  CONVERSATION_CHAT_MESSAGE_HISTORY_STORAGE_KEY,
  CONVERSATION_CHAT_STORAGE_KEY,
  CHAT_MEMBER_ROLE,
  GENESYS_MESSAGE_TYPE,
  GENESYS_SYSTEM_MESSAGE_TYPE,
  GENESYS_TARGET_TYPE,
  MAX_FILE_SIZE_TO_UPLOAD,
  MAX_FILE_SIZE_TO_UPLOAD_MULTIPLE_FILES,
  MAX_FILE_SIZE_UPLOAD_MB,
  GENESYS_CHAT_HISTORY_TYPE,
} from './customer-service.constants';
import {
  ChatConnectionRequest,
  ChatMemberDetails,
  ChatMessage,
  CreateConversationRequest,
  GenesysGeneralApiError,
  MessageStatus,
  UploadedFile,
} from './customer-service.interface';

const unescapeObjectString = (message: any) => {
  const unescaped = unescape(message);
  return JSON.parse(unescaped);
};

const isSystemMessage = (type: GENESYS_SYSTEM_MESSAGE_TYPE) => {
  return [
    GENESYS_SYSTEM_MESSAGE_TYPE.MEMBER_JOIN,
    GENESYS_SYSTEM_MESSAGE_TYPE.MEMBER_LEAVE,
  ].includes(type);
};

const normalizeMessage = (eventBody: any): ChatMessage => {
  const {id, body, timestamp, bodyType, sender, utc} = eventBody;
  const messageType =
    mapGenesysHistoryEventTypeWithNormalEvent(bodyType) || bodyType;
  return {
    _id: id,
    text: body,
    createdAt: timestamp || utc,
    type: messageType,
    system: isSystemMessage(messageType),
    user: {
      _id: sender?.id,
    },
  };
};

const populateUserDetails = (
  message: ChatMessage,
  members: ChatMemberDetails[],
  optionalFields?: Record<string, any>,
) => {
  const sender = members?.find(
    m => m.id === message.user._id || m.id === message.user.id,
  );
  return {
    ...message,
    user: {
      ...message.user,
      name: sender?.displayName,
      avatar: sender?.avatarImageUrl,
      role: sender?.role,
    },
    ...optionalFields,
  };
};

const isSendMessageRequest = (
  error: AxiosError<GenesysGeneralApiError, any>,
) => {
  const {config} = error;
  return config.method === 'post' && /\/messages$/.test(config.url || '');
};

const getStorageKeyByQueueName = (
  queueName: string,
  isAuthenticated: boolean,
  partyId: string,
) => {
  return `${
    isAuthenticated ? 'AUTHENTICATED_' : ''
  }${CONVERSATION_CHAT_STORAGE_KEY}_${queueName}_${partyId}`;
};

// TODO: remove authenticated as we move to use server storage
const getConversationHistoryStorageKey = () => {
  return `${CONVERSATION_CHAT_MESSAGE_HISTORY_STORAGE_KEY}`;
};

export const getBlob = async (fileUri: string) => {
  const resp = await fetch(fileUri);
  const imageBody = await resp.blob();
  return imageBody;
};

const isMediaFile = (name: string) => {
  return /.*\.(?:png|jpg|jpeg|PNG|JPG|JPEG|HEIC)$/.test(name);
};

const isMediaMessage = (text: string) => {
  return (
    /.*\.s3\..*/.test(text) &&
    /.*\.(?:png|jpg|jpeg|PNG|JPG|JPEG|HEIC)\?/.test(text)
  );
};

const isDocument = (name: string) => {
  return /.*\.(?:pdf|PDF)/.test(name);
};

const isDocumentMessage = (name: string) => {
  return /.*\.s3\..*/.test(name) && /.*\.(?:pdf|PDF)\?/.test(name);
};

const isVideoKYCMessage = (name: string) => {
  return /.*video\..*/.test(name);
};

const isValidMediaFormat = (file: any) => {
  if (!isMediaFile(file.filename || file.path)) {
    ToastManager.present({
      message: t('customerService.imageWrongFormat'),
      state: 'error',
    });
    return false;
  }
  return true;
};

const isValidDocument = (file: any) => {
  if (!isDocument(file.name || file.path)) {
    ToastManager.present({
      message: t('customerService.fileWrongFormat'),
      state: 'error',
    });
    return false;
  }
  return true;
};

const isValidFileSize = (file: any) => {
  if (file.size > MAX_FILE_SIZE_TO_UPLOAD) {
    ToastManager.present({
      message: t('customerService.fileTooLarge', {
        size: MAX_FILE_SIZE_UPLOAD_MB,
      }),
      state: 'error',
    });
    return false;
  }
  return true;
};

export const normalizeFiles = (files: any[]): UploadedFile[] => {
  if (!files || !files.length) {
    return [];
  }
  return files.map((file, index) => {
    const fileName: string =
      file.filename ||
      file.name ||
      `${index}${Date.now().toString()}${index}.jpg`;
    return {
      name: fileName
        .replace(/\s/g, '')
        .replace(/_/g, '')
        .replace('HEIC', 'jpg')
        .toLowerCase(),
      size: file.size || 0,
      path: file.path || file.uri || '',
      type: file.mime || file.type,
    };
  });
};

const getUploadFilesChunk = (files: any[]): UploadedFile[] => {
  if (!files.length) {
    return [];
  }

  let totalSize = 0;

  const validFiles = files
    .sort((a, b) => (a > b ? 1 : -1))
    .reduce((arr, file) => {
      totalSize += file.size;
      if (totalSize <= MAX_FILE_SIZE_TO_UPLOAD_MULTIPLE_FILES) {
        arr.push(file);
      }
      return arr;
    }, [] as UploadedFile[]);

  return validFiles;
};

const isValidUrlString = (str: string) => {
  const validUrlRegex =
    /(^(https?):\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+.[-A-Za-z0-9+&@#/%=~_|]/;
  return validUrlRegex.test(str);
};

const getGenesysConversationConfig = (
  params: ChatConnectionRequest,
): CreateConversationRequest => {
  const {queueName, displayName, phoneNumber} = params;

  return {
    organizationId: 'a93ef4e8-26fb-4b96-91f2-84d0587d5a20',
    deploymentId: 'f239d010-68e2-4453-a2ed-7c1289f15e46',
    routingTarget: {
      targetType: GENESYS_TARGET_TYPE.QUEUE,
      targetAddress: queueName,
    },
    memberInfo: {
      displayName,
      phoneNumber,
      customFields: {
        phoneNumber,
      },
    },
  };
};

const createTempMessage = (text: string, currentMemberID: string) => {
  return {
    _id: `temp_${Date.now()}_${Math.random()}`,
    text,
    createdAt: moment().toISOString(),
    type: GENESYS_MESSAGE_TYPE.STANDARD,
    status: MessageStatus.SENDING,
    user: {
      _id: currentMemberID,
      role: CHAT_MEMBER_ROLE.CUSTOMER,
    },
  };
};

const mapGenesysHistoryEventTypeWithNormalEvent = (eventType: string) => {
  switch (eventType) {
    case GENESYS_CHAT_HISTORY_TYPE.MEMBER_JOIN:
      return GENESYS_MESSAGE_TYPE.MEMBER_JOIN;
    case GENESYS_CHAT_HISTORY_TYPE.MEMBER_LEAVE:
      return GENESYS_MESSAGE_TYPE.MEMBER_LEAVE;
    case GENESYS_CHAT_HISTORY_TYPE.STANDARD:
      return GENESYS_MESSAGE_TYPE.STANDARD;
    default:
      return null;
  }
};

type ChatGPTMessageType = {content: string; isEnd?: boolean};

class MessageQueueClass {
  private queue: ChatGPTMessageType[] = [];
  private timerId?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly interval: number,
    private readonly callback: (message: ChatGPTMessageType) => void,
  ) {}

  addMessage(message: ChatGPTMessageType) {
    this.queue.push(message);
    if (!this.timerId) {
      this.startTimer();
    }
  }

  private startTimer() {
    this.timerId = setTimeout(() => {
      if (this.queue.length === 0) {
        return;
      }

      const message = this.queue.shift();

      this.callback(message!);
      this.timerId = undefined;
      if (this.queue.length > 0) {
        this.startTimer();
      }
    }, this.interval);
  }

  stopTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
    this.queue = [];
  }
}

export {
  unescapeObjectString,
  normalizeMessage,
  populateUserDetails,
  isSendMessageRequest,
  getStorageKeyByQueueName,
  getConversationHistoryStorageKey,
  isSystemMessage,
  isMediaMessage,
  isValidMediaFormat,
  isValidDocument,
  isValidFileSize,
  isDocument,
  isDocumentMessage,
  isValidUrlString,
  getGenesysConversationConfig,
  createTempMessage,
  getUploadFilesChunk,
  isMediaFile,
  MessageQueueClass,
  isVideoKYCMessage,
  mapGenesysHistoryEventTypeWithNormalEvent,
};
