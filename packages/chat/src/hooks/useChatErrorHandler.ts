import { useRef } from 'react';
import { MAX_API_RETRY } from '../customer-service.constants';
import { AxiosError } from 'axios';
import { throttle } from 'lodash';
import { CONVERSATION_ACTION_THROTTLE } from '../customer-service.constants';

export const useChatErrorHandler = (
  isConnected: boolean,
  onCloseConnection: () => void,
  onTimeout: () => void,
) => {
  const retryCounter = useRef<number>(0);

  const handleError = throttle(error => {
    if (
      error.code === AxiosError.ERR_NETWORK ||
      retryCounter.current >= MAX_API_RETRY ||
      !isConnected
    ) {
      return;
    }

    retryCounter.current++;
    onCloseConnection();
    onTimeout();
  }, CONVERSATION_ACTION_THROTTLE);

  return { handleError };
};
