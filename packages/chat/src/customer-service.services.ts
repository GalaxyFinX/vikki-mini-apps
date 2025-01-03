// import {HttpClient} from '@services';
import axios from 'axios';
import {
  CHAT_GPT_MAX_TOKEN,
  CHAT_GPT_TIMEOUT,
  GENESYS_MESSAGE_TYPE,
  GPT_END_STREAM_SIGNAL,
  SAVED_CONVERSATION_LIMIT,
} from './customer-service.constants';
import {
  CreateConversationRequest,
  CreateConversationResponse,
  GetChatMembersResponse,
  IAuthToken,
  SignedDataTokenResponse,
  UploadedFile,
} from './customer-service.interface';

import EventSource, {EventSourceListener} from 'react-native-sse';
import {MessageQueueClass} from './customer-service.helper';
import {t} from 'i18next';
// import {CommonService} from '../common/common.services';
import {IS_IOS} from './constants';
import {HttpClient} from './httpClient';

const API_END_POINTS = {
  CUSTOMER_SERVICE_CHAT_BASE_URL: `https://api.apne2.pure.cloud/api/v2/`,
  CREATE_CONVERSATION: 'webchat/guest/conversations',
  GET_AUTHENTICATED_CHAT_TOKEN: 'messaging/conversation/token',
  GET_SIGNEDDATA_TOKEN: `https://api.apne2.pure.cloud/api/v2/signeddata`,
  END_CONVERSATION: (conversationID: string, memberID: string) =>
    `webchat/guest/conversations/${conversationID}/members/${memberID}`,
  SEND_MESSAGE: (conversationID: string, memberID: string) =>
    `webchat/guest/conversations/${conversationID}/members/${memberID}/messages`,
  GET_CHAT_MEMBER_DETAIL: (conversationID: string) =>
    `webchat/guest/conversations/${conversationID}/members`,
  GET_CHAT_MESSAGES: (conversationID: string) =>
    `webchat/guest/conversations/${conversationID}/messages`,
  PRESIGNED_UPLOAD_FILE_URL: 'messaging/public/images/multiPresignedUrls',
  PRESIGNED_UPLOAD_FILE_URL_AUTH: 'messaging/private/images/multiPresignedUrls',
  STORE_CONVERSATION_TO_DB: (conversationID: string) =>
    `messaging/conversation/authentication/${conversationID}`,
  GET_CONVERSATION_IDS: (pageSize: number) =>
    `messaging/conversations?pageSize=${pageSize}`,
  GET_CONVERSATION_DETAILS_BY_ID: (conversationsId: string) =>
    `conversations/${conversationsId}/recordings`,
};

export const axiosChatInstance = axios.create({
  baseURL: API_END_POINTS.CUSTOMER_SERVICE_CHAT_BASE_URL,
});

const ejectInterceptors = (id: number) => {
  axiosChatInstance.interceptors.request.eject(id);
};
const injectInterceptors = (onFulfilled: any) => {
  return axiosChatInstance.interceptors.request.use(request => {
    if (onFulfilled) {
      onFulfilled(request);
    }
    return request;
  });
};

const setChatToken = (token: string) => {
  axiosChatInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const sendTextMessage = async (
  text: string,
  conversationID: string,
  memberID: string,
) => {
  return axiosChatInstance.post(
    API_END_POINTS.SEND_MESSAGE(conversationID, memberID),
    {body: text, bodyType: GENESYS_MESSAGE_TYPE.STANDARD},
  );
};

const createConversation = async (
  data: CreateConversationRequest,
): Promise<CreateConversationResponse | Error> => {
  try {
    const result = await axiosChatInstance.post<CreateConversationResponse>(
      API_END_POINTS.CREATE_CONVERSATION,
      data,
    );
    return result.data;
  } catch (error: any) {
    return error;
  }
};

const endConversation = async (conversationID: string, memberID: string) => {
  return axiosChatInstance.delete(
    API_END_POINTS.END_CONVERSATION(conversationID, memberID),
  );
};

const getTokenForAuthenticatedChat = async (): Promise<string> => {
  try {
    const result = await HttpClient.Post<IAuthToken>(
      API_END_POINTS.GET_AUTHENTICATED_CHAT_TOKEN,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return result.payload?.accessToken ?? '';
  } catch (error: any) {
    return error;
  }
};

const getRecordingById = async (payload: any): Promise<any> => {
  try {
    const authToken = await getTokenForAuthenticatedChat();

    const result = await axiosChatInstance.get(
      API_END_POINTS.GET_CONVERSATION_DETAILS_BY_ID(payload.conversationId),
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${authToken}`,
        },
      },
    );

    return {isSuccess: true, payload: result.data};
  } catch (error: any) {
    return error;
  }
};

const getSignedDataTokenFromGenesys = async (
  displayName: string,
  phoneNumber: string,
): Promise<SignedDataTokenResponse> => {
  const defaultResult = {jwt: ''};
  try {
    const result = await axiosChatInstance.post<SignedDataTokenResponse>(
      API_END_POINTS.GET_SIGNEDDATA_TOKEN,
      {
        phoneNumber,
        displayName,
      },
    );
    return result.data ?? defaultResult;
  } catch (error: any) {
    return defaultResult;
  }
};

const getChatMembers = async (
  conversationID: string,
): Promise<GetChatMembersResponse | Error> => {
  try {
    const result = await axiosChatInstance.get<GetChatMembersResponse>(
      API_END_POINTS.GET_CHAT_MEMBER_DETAIL(conversationID),
    );
    return result.data;
  } catch (error: any) {
    return error;
  }
};

const getMessagesByConversationID = async (
  conversationID: string,
  afterID?: string,
  beforeID?: string,
): Promise<any | Error> => {
  const result = await axiosChatInstance.get<any>(
    API_END_POINTS.GET_CHAT_MESSAGES(conversationID),
    {params: {before: beforeID, after: afterID}},
  );
  return result.data;
};

const getUploadFileUrls = async (
  fileNames: string[],
  phoneNumber: string,
  customerName: string,
  isPrivate = false,
) => {
  const params = {
    fileNames,
    phoneNumber,
    customerName,
  };
  const requestUrl = isPrivate
    ? API_END_POINTS.PRESIGNED_UPLOAD_FILE_URL_AUTH
    : API_END_POINTS.PRESIGNED_UPLOAD_FILE_URL;
  const url = await HttpClient.Post(requestUrl, params);

  return url;
};

const uploadChatFilesToDMS = async (
  file: UploadedFile,
  cif: string,
  callback: (progress: Partial<UploadedFile>) => void,
) => {
  const form = new FormData();

  form.append('categoryCode', 'customer-finx#product#casa#otherdocs');
  form.append('fileName', file.name);
  form.append('documentType', 'otherdocs');
  form.append('cif', cif);
  const fileBody: any = {
    uri: file.path,
    name: `${Date.now()}_${file.name}`,
  };
  if (!IS_IOS) {
    fileBody.type = file.type;
  }
  form.append('file', fileBody);

  // const response = await CommonService.uploadToDMS(form, callback);

  // return response;
};

const storeCurrentConversationToDB = async (
  conversationID: string,
  phoneNumber: string,
): Promise<string> => {
  try {
    const result = await HttpClient.Post<string>(
      API_END_POINTS.STORE_CONVERSATION_TO_DB(conversationID),
      {phoneNumber},
    );
    return result.payload ?? '';
  } catch (error: any) {
    return error;
  }
};

const CHAT_TOKEN = 'sk-';
const createResourceStream = (content: string, context = []) => {
  return new EventSource('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CHAT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [...context, {role: 'user', content}],
      stream: true,
      max_tokens: CHAT_GPT_MAX_TOKEN,
    }),
    pollingInterval: -1, // No polling as we only listen to the request 1 time
  });
};

const virtualAssistantChat = async (
  content: string,
  context = [],
  callback: (chunk: string) => void,
  onEnd: (reason: string) => void,
) => {
  let es = null;
  const messageQueue = new MessageQueueClass(50, message => {
    message.isEnd ? onEnd(message.content) : callback(message.content);
  });

  try {
    es = createResourceStream(content, context);
    const timeout = setTimeout(() => {
      onEnd(GPT_END_STREAM_SIGNAL.GENERAL);
    }, CHAT_GPT_TIMEOUT);

    const listener: EventSourceListener = event => {
      const {data} = event;
      clearTimeout(timeout);

      if (data === GPT_END_STREAM_SIGNAL.DONE) {
        messageQueue.addMessage({
          content: GPT_END_STREAM_SIGNAL.DONE,
          isEnd: true,
        });
        return;
      }

      const {choices} = JSON.parse(data);

      if (choices?.length === 0) {
        return;
      }

      if (choices[0].finish_reason === GPT_END_STREAM_SIGNAL.LENGTH) {
        messageQueue.addMessage({
          content: GPT_END_STREAM_SIGNAL.LENGTH,
          isEnd: true,
        });

        messageQueue.addMessage({
          content: `...[${t('customerService.responseTooLong')}]`,
        });
        return;
      }
      messageQueue.addMessage({
        content: choices?.map(choice => choice.delta?.content).join(),
      });
    };

    es.addEventListener('message', listener);
  } catch (err) {
    es?.removeAllEventListeners();
    es?.close();
  }
};

const getConversationIds = async () => {
  try {
    const result = await HttpClient.Get<any>(
      API_END_POINTS.GET_CONVERSATION_IDS(SAVED_CONVERSATION_LIMIT),
    );
    return result;
  } catch (error: any) {
    return error;
  }
};

export {
  createConversation,
  endConversation,
  sendTextMessage,
  setChatToken,
  getTokenForAuthenticatedChat,
  getSignedDataTokenFromGenesys,
  getChatMembers,
  injectInterceptors,
  ejectInterceptors,
  getMessagesByConversationID,
  getUploadFileUrls,
  storeCurrentConversationToDB,
  virtualAssistantChat,
  uploadChatFilesToDMS,
  getConversationIds,
  getRecordingById,
};
