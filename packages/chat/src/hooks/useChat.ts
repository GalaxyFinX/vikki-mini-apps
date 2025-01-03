import {useNetwork} from '@hooks';
import {Storage} from '../utils';
import {AxiosError} from 'axios';
import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
// import Keys from 'react-native-keys';
import {getStorageKeyByQueueName} from '../customer-service.helper';
import {
  ChatConfigParams,
  ChatConnectionRequest,
  ChatMemberDetails,
} from '../customer-service.interface';
import {
  ejectInterceptors,
  injectInterceptors,
} from '../customer-service.services';
import {IUseChatProps} from './../customer-service.interface';
import {useChatConversation} from './useChatConversation';
import {useChatErrorHandler} from './useChatErrorHandler';
import {useChatUtilities} from './useChatUtilities';
import {useSocketConnection} from './useSocketConnection';

export const useChat = ({
  isAuthenticated = false,
  phone = '',
  name = '',
}: IUseChatProps) => {
  const members = useRef<ChatMemberDetails[]>([]);
  const chatConfig = useRef<ChatConfigParams | null>(null);
  const appState = useRef(AppState.currentState);

  //
  const {establishConnection, closeConnection, socketInstance} =
    useSocketConnection(chatConfig, isAuthenticated);

  const reconnectToCurrentChat = async () => {
    if (!chatConfig.current?.conversationID) {
      return;
    }
    establishConnection(chatConfig?.current as any, handleEventMessage);
    await getChatMemberDetails(chatConfig?.current.conversationID);
    await getChatMessages();
  };

  const {isConnected} = {isConnected: true};
  const {handleError} = useChatErrorHandler(
    isConnected,
    reconnectToCurrentChat,
    closeConnection,
  );

  const {getChatMemberDetails, getUploadedFilePresignedURLs} = useChatUtilities(
    isAuthenticated,
    members,
    chatConfig,
  );

  const {
    loadedMessages,
    handleEventMessage,
    getChatMessages,
    sendText,
    resendMessage,
    createConversation,
    endConversation,
    loadMore,
    populateMessageData,
    setLoadedMessages,
  } = useChatConversation({
    members,
    chatConfig,
    isAuthenticated,
    handleError,
    establishConnection,
  });

  //
  const addAppStateSubscription = () =>
    AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        reconnectToCurrentChat();
      }

      appState.current = nextAppState;
    });

  const connectToCustomerSupport = async (params: ChatConnectionRequest) => {
    const partyId = Storage.retrieve('6666');

    const latestConversation = Storage.retrieve(
      getStorageKeyByQueueName(
        params.queueName,
        isAuthenticated,
        partyId,
      ) as any,
    );

    if (latestConversation) {
      const isReconnectSuccess = await establishConnection(
        {
          ...latestConversation,
          displayName: params.displayName,
          phoneNumber: params.phoneNumber,
        },
        handleEventMessage,
      );
      if (isReconnectSuccess) {
        await getChatMemberDetails(latestConversation.conversationID);
        await getChatMessages();
      } else {
        createConversation(params);
      }
    } else {
      createConversation(params);
    }
  };

  //
  useEffect(() => {
    const subscription = addAppStateSubscription();

    if (!!socketInstance.current === false) {
      connectToCustomerSupport({
        queueName: 'Inbound Chat Sit',
        displayName: name,
        phoneNumber: phone,
      });
    }

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const interceptorId = injectInterceptors(() => {
      if (!isConnected) {
        throw new AxiosError('', AxiosError.ERR_NETWORK);
      }
    });
    if (isConnected) {
      reconnectToCurrentChat();
    }

    return () => {
      ejectInterceptors(interceptorId);
    };
  }, [isConnected]);

  return {
    loadedMessages,
    sendText,
    currentMemberID: chatConfig?.current?.currentMemberID,
    endConversation,
    members,
    getUploadedFilePresignedURLs,
    resendMessage,
    loadMore,
    populateMessageData,
    setLoadedMessages,
  };
};
