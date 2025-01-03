import {IMessage, User} from 'react-native-gifted-chat';
import {
  CHAT_GPT_MESSAGE_TYPE,
  GENESYS_MESSAGE_TYPE,
} from './customer-service.constants';

export type CreateConversationRequest = {
  organizationId: string;
  deploymentId: string;
  routingTarget: {
    targetType: string;
    targetAddress: string;
  };
  memberInfo: {
    displayName: string;
    avatarImageUrl?: string;
    phoneNumber?: string;
    customFields?: Record<string, string>;
  };
  memberAuthToken?: string;
};

export type ChatMemberDetails = {
  id: string;
  displayName: string;
  avatarImageUrl: string;
  role: string;
  state: string;
};

export type GuestInformation = {
  name: string;
  phone: string;
};

export type ChatConnectionRequest = {
  queueName: string;
  displayName: string;
  phoneNumber: string;
};

export type ChatConfigParams = {
  displayName: string;
  queueName: string;
  phoneNumber: string;
  conversationID: string;
  currentMemberID: string;
};

export type CreateConversationResponse = {
  id: string;
  jwt: string;
  eventStreamUri: string;
  member: {
    id: string;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatarImageUrl: string;
    role: string;
    joinDate: string;
    leaveDate: string;
    authenticatedGuest: boolean;
    state: string;
  };
};

export type GetChatMembersResponse = {
  entities: ChatMemberDetails[];
};

export interface ChatUser extends User {
  id?: string;
  role?: string;
}

export enum MessageStatus {
  SENDING = 'SENDING',
  FAILED = 'FAILED',
  SENT = 'SENT',
}

export type CHAT_MESSAGE_TYPE = GENESYS_MESSAGE_TYPE | CHAT_GPT_MESSAGE_TYPE;

export interface ChatMessage extends IMessage {
  senderCommunicationId?: string;
  type: CHAT_MESSAGE_TYPE;
  user: ChatUser;
  status?: MessageStatus;
  createdAt: any;
  finishedReason?: string;
}

export interface AgentState {
  isTyping?: boolean;
}

export interface GenesysGeneralApiError {
  code: string;
  status: number;
  message: string;
}

export interface TranslationObject {
  res: string;
  usedKey: string;
  exactUsedKey: string;
  usedNS: string;
  usedLng: string;
}

export interface ChatScreenParams {
  name: string;
  phone: string;
  isAuthenticated: boolean;
}

export interface SignedDataTokenResponse {
  jwt: string;
}

export interface IAuthToken {
  accessToken: string;
  expiresIn: number;
  tokenType?: string;
  refreshToken?: string;
}

export interface IUseChatProps {
  isAuthenticated: boolean;
  name: string;
  phone: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  path: string;
  url?: string;
  viewUrl?: string;
  progress?: number;
  type?: string;
  mime?: string;
}

export interface MultiPresignedURLsResponse {
  name: string;
  url: string;
}

export interface ConversationInfo {
  id: number;
  partyId: number;
  conversationId: string;
}

export interface ConversationsData {
  pageSize: number;
  conversations: ConversationInfo[];
}
