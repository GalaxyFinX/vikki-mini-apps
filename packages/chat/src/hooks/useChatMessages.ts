import {Storage} from '../utils';
import {useState} from 'react';
import {ChatMessage} from '../customer-service.interface';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const removeCurrentMessageById = (id: string) => {
    setMessages(prev => prev.filter(m => m._id !== id));
  };

  const addNewMessage = (message: ChatMessage) => {
    setMessages(prev => [message, ...prev]);
  };

  const upsertNewMessage = (newMessage: ChatMessage) => {
    setMessages(prev => {
      const index = prev.findIndex(m => m._id === newMessage._id);
      if (index !== -1) {
        prev[index] = newMessage;
        return prev;
      } else {
        return [newMessage, ...prev];
      }
    });
  };

  const updateMessage = (message: ChatMessage) => {
    setMessages(prev => prev.map(m => (m._id === message._id ? message : m)));
  };

  const replaceMessage = (id: string, message: ChatMessage) => {
    setMessages(prev => prev.map(m => (m._id === id ? message : m)));
  };

  const overwriteMessages = (newMessageList: ChatMessage[]) => {
    setMessages(newMessageList);
  };

  const removeFromStorageByMessageById = (id: string, key: string) => {
    const historyIndex = messages.findIndex(item => item._id === id);
    if (historyIndex > -1) {
      const newHistory = messages.filter(m => m._id !== id);
      setMessages(prev => prev.filter(m => m._id !== id));
      Storage.save(key as any, newHistory);
    }
  };

  return {
    messages,
    replaceMessage,
    removeFromStorageByMessageById,
    removeCurrentMessageById,
    addNewMessage,
    overwriteMessages,
    upsertNewMessage,
    updateMessage,
  };
};
