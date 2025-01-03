import {useEffect} from 'react';
import {createTempMessage} from '../customer-service.helper';
import {ChatMessage, MessageStatus} from '../customer-service.interface';

import {useChatMessages} from './useChatMessages';
import {Storage} from '../utils';
import {useLoadMore} from './useLoadMore';
import {virtualAssistantChat} from '../customer-service.services';
import {
  CHAT_GPT_FEED,
  CHAT_GPT_MESSAGE_TYPE,
  CHAT_MEMBER_ROLE,
} from '../customer-service.constants';

export const useVirtualAssistant = () => {
  const partyId = Storage.retrieve('6666');

  //hook calls
  const {messages, addNewMessage, overwriteMessages, updateMessage} =
    useChatMessages();

  const {loadedMessages} = useLoadMore({allMessages: messages});

  const virtualChatStorageKey = `VIRTUAL_ASSISTANT_HISTORY_${partyId}` as any;

  const retrieveMessagesHistory = (): ChatMessage[] => {
    return Storage.retrieve(virtualChatStorageKey) || [];
  };

  useEffect(() => {
    const oldMessages = retrieveMessagesHistory();
    overwriteMessages(oldMessages);
  }, []);

  const chatContext = () => {
    const lastTwoQA =
      messages.length > 1
        ? messages.reverse().slice(-2)
        : [...messages.reverse()];

    return [
      ...CHAT_GPT_FEED,
      ...lastTwoQA.map(item => ({
        role: item.user.role?.toLowerCase(),
        content: item.text,
      })),
    ];
  };

  const sendText = async (content: string) => {
    const sending = createTempMessage(content, partyId);
    addNewMessage({
      ...sending,
      status: MessageStatus.SENT,
      user: {
        _id: partyId,
        role: 'user',
      },
    });
    let responseMessage = {
      ...createTempMessage('', 'GPT'),
      status: MessageStatus.SENT,
      type: CHAT_GPT_MESSAGE_TYPE.STREAMING,
      user: {
        _id: 'GPT',
        role: CHAT_MEMBER_ROLE.ASSISTANT,
      },
    } as ChatMessage;
    addNewMessage(responseMessage);

    await virtualAssistantChat(
      content,
      chatContext() as any,
      chunk => {
        responseMessage = {
          ...responseMessage,
          text: responseMessage.text + chunk,
        };
        updateMessage(responseMessage);
      },
      reason => {
        responseMessage = {
          ...responseMessage,
          finishedReason: reason,
        };
        updateMessage(responseMessage);
      },
    );
  };

  const loadMore = () => {};

  return {
    loadedMessages,
    sendText,
    loadMore,
  };
};
