import {Storage} from '../utils';
import {isEmpty, throttle} from 'lodash';
import {
  MutableRefObject,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  CONVERSATION_ACTION_THROTTLE,
  EVENT_TYPE,
  GENESYS_MESSAGE_TYPE,
  MAX_CHAT_MESSAGE_IN_HISTORY,
} from '../customer-service.constants';
import {
  createTempMessage,
  getConversationHistoryStorageKey,
  getGenesysConversationConfig,
  normalizeMessage,
  populateUserDetails,
  unescapeObjectString,
} from '../customer-service.helper';
import {
  ChatConfigParams,
  ChatConnectionRequest,
  ChatMemberDetails,
  ChatMessage,
  CreateConversationResponse,
  MessageStatus,
} from '../customer-service.interface';
import {
  createConversation as createGenesysConversation,
  endConversation as endGenesysConversation,
  getMessagesByConversationID,
  getSignedDataTokenFromGenesys,
  getTokenForAuthenticatedChat,
  sendTextMessage,
  setChatToken,
  storeCurrentConversationToDB,
} from '../customer-service.services';
import {useChatMessages} from './useChatMessages';
import {useChatUtilities} from './useChatUtilities';
import {useLoadMore} from './useLoadMore';

export const useChatConversation = ({
  members,
  chatConfig,
  isAuthenticated,
  handleError,
  establishConnection,
}: {
  members: MutableRefObject<ChatMemberDetails[]>;
  chatConfig: any;
  isAuthenticated: boolean;
  handleError: any;
  establishConnection: any;
}) => {
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  //hook calls
  const {
    messages,
    addNewMessage,
    overwriteMessages,
    removeCurrentMessageById,
    updateMessage,
    replaceMessage,
    upsertNewMessage,
  } = useChatMessages();

  const {
    messages: messageHistory,
    overwriteMessages: overwriteHistoryMessages,
    removeFromStorageByMessageById: removeHistoryFromStorageByMessageById,
  } = useChatMessages();

  const {getChatMemberDetails, updateMembersState, populateMessageData} =
    useChatUtilities(isAuthenticated, members, chatConfig);

  //Messages handlers
  const allMessages = useMemo(() => {
    return [...(messages ?? []), ...(messageHistory ?? [])] as ChatMessage[];
  }, [messages, messageHistory]);

  const {loadedMessages, loadMore, setLoadedMessages} = useLoadMore({
    allMessages,
  });

  const saveMessage = (event: any): void => {
    const newMessage = populateMessageData(event);
    upsertNewMessage(newMessage);
  };

  const retrieveMessagesHistory = (): ChatMessage[] => {
    if (isAuthenticated) {
      return [];
    } else {
      return Storage.retrieve(getConversationHistoryStorageKey() as any) || [];
    }
  };

  const handleTextMessage = async (event: any) => {
    try {
      const {eventBody} = event;
      switch (eventBody.bodyType) {
        case GENESYS_MESSAGE_TYPE.MEMBER_LEAVE: {
          updateMembersState(event.eventBody);
          saveMessage(event);
          break;
        }
        case GENESYS_MESSAGE_TYPE.STANDARD: {
          if (eventBody.sender?.id === chatConfig?.current?.currentMemberID) {
            break; // save message when sent success already
          }
          saveMessage(event);
          break;
        }
        case GENESYS_MESSAGE_TYPE.MEMBER_JOIN: {
          await getChatMemberDetails(event.eventBody.conversation.id);
          saveMessage(event);
          break;
        }
      }
    } catch (error) {
      return false;
    }
  };

  const handleEventMessage = (eventString: any) => {
    const event = unescapeObjectString(eventString.data);
    try {
      switch (event.metadata?.type) {
        case EVENT_TYPE.MESSAGE: {
          handleTextMessage(event);
          break;
        }
      }
    } catch (error) {
      return false;
    }
  };

  const getChatMessages = async () => {
    const result = await getMessagesByConversationID(
      chatConfig.current?.conversationID || '',
    );

    if (!result.entities) {
      return;
    }

    const serverMessages = result?.entities?.map((message: any) => {
      return populateMessageData({eventBody: message});
    }) as any[];

    const messageList = [...localMessages, ...serverMessages].sort((a, b) =>
      String(a.createdAt) > String(b.createdAt) ? -1 : 1,
    );

    overwriteMessages(messageList);
  };

  const resendMessage = (message: ChatMessage) => {
    removeCurrentMessageById(String(message._id));
    setLocalMessages(prev => prev.filter(m => m._id !== message._id));

    removeHistoryFromStorageByMessageById(
      String(message._id),
      getConversationHistoryStorageKey(isAuthenticated),
    );
    sendText(message.text);
  };

  const handleSendingMessage = async (message: any) => {
    const {conversationID, currentMemberID} =
      chatConfig?.current as ChatConfigParams;

    addNewMessage(message);
    const result = await sendTextMessage(
      message.text,
      conversationID,
      currentMemberID,
    );
    const newMessage = normalizeMessage(result?.data);
    const updatedMessage = populateUserDetails(newMessage, members.current, {
      status: MessageStatus.SENT,
    });
    replaceMessage(message._id, updatedMessage);
  };

  const handleFailedSendingMessage = (failedMessages: any[], error: any) => {
    const result = failedMessages.map(message => {
      const failedMessage = {
        ...message,
        status: MessageStatus.FAILED,
      } as ChatMessage;
      updateMessage(failedMessage);
      return failedMessage;
    });
    setLocalMessages(prev => [...result, ...prev]);
    handleError(error);
  };

  const sendText = async (input: any) => {
    let tempMessages = null;
    let promises = [] as any[];

    if (typeof input === 'string') {
      tempMessages = new Array(
        createTempMessage(input, chatConfig?.current?.currentMemberID || ''),
      );
    } else {
      tempMessages = input.map((i: string) =>
        createTempMessage(i, chatConfig?.current?.currentMemberID || ''),
      );
    }

    try {
      if (isEmpty(chatConfig)) {
        return;
      }

      if (isConversationClosed) {
        await createConversation(chatConfig.current);
      }

      tempMessages.forEach((message: ChatMessage) => {
        const promise = handleSendingMessage(message);
        promises.push(promise);
      });
      await Promise.all(promises);
    } catch (error) {
      handleFailedSendingMessage(tempMessages, error);
    }
  };

  //conversation handlers
  const isConversationClosed = useMemo(() => {
    if (!messages || messages.length === 0) {
      return true;
    }

    return messages.some(
      message =>
        message.type === GENESYS_MESSAGE_TYPE.MEMBER_LEAVE &&
        message?.user?._id === chatConfig?.current?.currentMemberID,
    );
  }, [messages, chatConfig?.current?.conversationID]);

  const _storeCurrentConversationToStorage = () => {
    const newConversationHistory = [...messages, ...messageHistory]
      .filter(item => item.status !== MessageStatus.FAILED)
      .slice(0, MAX_CHAT_MESSAGE_IN_HISTORY);

    overwriteMessages([]);
    overwriteHistoryMessages(newConversationHistory);
    Storage.save(
      getConversationHistoryStorageKey(isAuthenticated) as any,
      newConversationHistory,
    );
  };

  const createConversation = useCallback(
    throttle(async (params: ChatConnectionRequest) => {
      try {
        let config = getGenesysConversationConfig(params);
        if (!config) {
          return false;
        }
        if (isAuthenticated) {
          const authToken = await getTokenForAuthenticatedChat();
          setChatToken(authToken);
          const {jwt} = await getSignedDataTokenFromGenesys(
            params.displayName,
            params.phoneNumber,
          );
          config = {...config, memberAuthToken: jwt};
        }
        const data = (await createGenesysConversation(
          config,
        )) as CreateConversationResponse;
        const isSuccess = await establishConnection(
          {
            ...params,
            jwt: data.jwt,
            eventStreamUri: data?.eventStreamUri,
            currentMemberID: data?.member.id,
            conversationID: data?.id,
          },
          handleEventMessage,
        );
        if (isSuccess) {
          if (isAuthenticated) {
            await storeCurrentConversationToDB(data?.id, params.phoneNumber);
          }
          _storeCurrentConversationToStorage();
        }

        return true;
      } catch (error) {
        return false;
      }
    }, CONVERSATION_ACTION_THROTTLE),
    [messages, messageHistory],
  );

  const endConversation = async () => {
    try {
      const {conversationID, currentMemberID} =
        chatConfig?.current as ChatConfigParams;
      await endGenesysConversation(conversationID, currentMemberID);
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const oldMessages = retrieveMessagesHistory();
    overwriteHistoryMessages(oldMessages);
  }, []);

  return {
    localMessages,
    saveMessage,
    resendMessage,
    sendText,
    handleEventMessage,
    getChatMessages,
    createConversation,
    endConversation,
    loadedMessages,
    loadMore,
    populateMessageData,
    setLoadedMessages,
  };
};
