import {
  CHAT_MEMBER_STATE,
  CHAT_MEMBER_ROLE,
} from '../customer-service.constants';
import {
  isSystemMessage,
  normalizeMessage,
  populateUserDetails,
} from '../customer-service.helper';
import {
  ChatConfigParams,
  GetChatMembersResponse,
} from '../customer-service.interface';
import {
  getChatMembers,
  getUploadFileUrls,
} from '../customer-service.services';

export const useChatUtilities = (
  isAuthenticated: boolean,
  members: any,
  chatConfig: any,
) => {
  const getChatMemberDetails = async (id: string) => {
    const { entities } = (await getChatMembers(id)) as GetChatMembersResponse;
    members.current = entities;
    return entities;
  };

  const updateMembersState = (info: any) => {
    const joinedAgent = members.current.find(
      mem => mem.id === info.sender?.id && mem.role === CHAT_MEMBER_ROLE.AGENT,
    );
    if (joinedAgent) {
      joinedAgent.state = CHAT_MEMBER_STATE.DISCONNECTED;
    }
  };

  const getUploadedFilePresignedURLs = async (files: string[]) => {
    if (!chatConfig.current) {
      return;
    }
    const { phoneNumber, displayName } =
      chatConfig?.current as ChatConfigParams;
    const url = await getUploadFileUrls(
      files,
      phoneNumber,
      displayName,
      isAuthenticated,
    );

    return url;
  };

  const populateMessageData = (event: any) => {
    const { eventBody } = event;
    const message = normalizeMessage(eventBody);
    if (eventBody.participantPurpose) {
      return {
        ...message,
        user: { role: String(eventBody.participantPurpose).toUpperCase() },
      };
    }

    const newMessage = populateUserDetails(
      { ...message, system: isSystemMessage(eventBody.bodyType) },
      members.current,
    );

    return newMessage;
  };

  return {
    getChatMemberDetails,
    getUploadedFilePresignedURLs,
    updateMembersState,
    populateMessageData,
  };
};
