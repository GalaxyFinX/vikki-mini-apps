import React, {memo} from 'react';
import {MessageProps, Message as GiftedMessage} from 'react-native-gifted-chat';
import {ChatMessage} from '../../customer-service.interface';
import {CHAT_MEMBER_ROLE} from '../../customer-service.constants';

const Message: React.FC<MessageProps<ChatMessage>> = props => {
  const {currentMessage} = props;
  const isCurrentUser =
    currentMessage?.user._id === props.user?._id ||
    currentMessage?.user.role === CHAT_MEMBER_ROLE.CUSTOMER;

  return (
    <GiftedMessage {...props} position={isCurrentUser ? 'right' : 'left'} />
  );
};

export default memo(Message);
