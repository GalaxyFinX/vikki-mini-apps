import {Storage} from '../utils';
import {useRef} from 'react';
import {SOCKET_EVENT_TYPE} from '../customer-service.constants';
import {getStorageKeyByQueueName} from '../customer-service.helper';
import {ChatConfigParams} from '../customer-service.interface';
import {setChatToken} from '../customer-service.services';

const delay = (ms: number, response?: any): Promise<any> => {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve(response);
    }, ms),
  );
};

export const useSocketConnection = (
  chatConfig: any,
  isAuthenticated: boolean,
) => {
  const socketInstance = useRef<WebSocket | null>();

  const isConnectionReady =
    socketInstance.current?.readyState === WebSocket.OPEN &&
    !!chatConfig?.current?.currentMemberID;

  const establishConnection = async (
    data: ChatConfigParams & {
      jwt: string;
      eventStreamUri: string;
    },
    messageHandler: any,
  ) => {
    try {
      if (socketInstance.current) {
        _stopListenEvent(messageHandler);
        socketInstance.current?.close();
      }

      if (!data || !data.eventStreamUri) {
        return false;
      }
      setChatToken(data?.jwt);

      createSocketConnection(data?.eventStreamUri, messageHandler);

      chatConfig.current = {
        ...data,
        conversationID: data?.conversationID,
        currentMemberID: data?.currentMemberID,
      };

      const partyId = Storage.retrieve('6666');

      Storage.save(
        getStorageKeyByQueueName(
          chatConfig.current.queueName,
          isAuthenticated,
          partyId,
        ) as any,
        data,
      );

      await delay(500); // Note: Genesys will not work right after initialize;

      return true;
    } catch (error) {
      return false;
    }
  };

  const createSocketConnection = (stream: string, _handleEventMessage: any) => {
    if (!stream) {
      return;
    }
    if (socketInstance.current) {
      socketInstance.current.close();
      _stopListenEvent(_handleEventMessage);
    }

    socketInstance.current = new WebSocket(stream);
    _startListenEvent(_handleEventMessage);
  };

  const _startListenEvent = (handler: any) => {
    socketInstance.current?.addEventListener(SOCKET_EVENT_TYPE, handler);
  };

  const _stopListenEvent = (handler: any) => {
    socketInstance.current?.removeEventListener(SOCKET_EVENT_TYPE, handler);
  };

  const closeConnection = () => {
    if (socketInstance.current) {
      socketInstance.current.close();
    }
  };

  return {
    createSocketConnection,
    establishConnection,
    isConnectionReady,
    closeConnection,
    socketInstance,
  };
};
