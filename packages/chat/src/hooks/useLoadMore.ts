import { useEffect, useState } from 'react';
import { MAX_LOAD_MORE_MESSAGE_LIMIT } from '../customer-service.constants';
import { ChatMessage } from '../customer-service.interface';

export const useLoadMore = ({
  allMessages,
}: {
  allMessages: ChatMessage[];
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadMore = () => {
    if (!allMessages?.length) {
      return;
    }

    const totalPage = Math.ceil(
      allMessages.length / MAX_LOAD_MORE_MESSAGE_LIMIT,
    );

    setCurrentPage(page => (page < totalPage ? ++page : totalPage));
  };

  const getMessageByPagination = () => {
    if (!allMessages?.length) {
      return;
    }
    const offSet = Math.min(allMessages.length, MAX_LOAD_MORE_MESSAGE_LIMIT);
    const newMessages = allMessages.slice(0, currentPage * offSet);
    setMessages(newMessages);
  };

  useEffect(() => {
    getMessageByPagination();
  }, [currentPage, allMessages]);

  return {
    loadedMessages: messages,
    setLoadedMessages: setMessages,
    loadMore,
  };
};
