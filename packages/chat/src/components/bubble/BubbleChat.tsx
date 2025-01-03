import {ChatMessage, MessageStatus} from '../../customer-service.interface';
import {BaseButton} from '@galaxyfinx/react-native-common-ui';
import {
  CHAT_GPT_MESSAGE_TYPE,
  GENESYS_MESSAGE_TYPE,
} from '../../customer-service.constants';
import {
  isDocumentMessage,
  isMediaMessage,
  isValidUrlString,
  isVideoKYCMessage,
} from '../../customer-service.helper';
import {isEqual} from 'lodash';
import React, {memo} from 'react';
import {View} from 'react-native';
import {BubbleProps} from 'react-native-gifted-chat';
import {CommonBubbleChat} from './CommonBubbleChat';
import {DocumentBubbleChat} from './DocumentBubbleChat';
import {MediaBubbleChat} from './MediaBubbleChat';
import {StreamingTextBubble} from './StreamingTextBubble';
import {VideoKYCBubbleChat} from './VideoKYCBubbleChat';

const BubbleChat: React.FC<
  BubbleProps<ChatMessage> & {
    onResend: (message: ChatMessage) => void;
    onMediaPress: (url: string) => void;
    onVideoKYCPress: (url: string) => void;
  }
> = props => {
  const {currentMessage, onResend} = props;

  const BubbleContent = () => {
    if (!currentMessage) {
      return null;
    }
    const {type} = currentMessage;

    switch (type) {
      case GENESYS_MESSAGE_TYPE.STANDARD:
        if (isValidUrlString(currentMessage.text)) {
          if (isMediaMessage(currentMessage.text)) {
            return <MediaBubbleChat {...props} />;
          }
          if (isDocumentMessage(currentMessage.text)) {
            return <DocumentBubbleChat {...props} />;
          }
          if (isVideoKYCMessage(currentMessage.text)) {
            return <VideoKYCBubbleChat {...props} />;
          }
        }
        return <CommonBubbleChat {...props} />;
      case CHAT_GPT_MESSAGE_TYPE.STREAMING:
        return <StreamingTextBubble {...props} />;
      default:
        return <CommonBubbleChat {...props} />;
    }
  };

  const Wrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
    if (currentMessage?.status === MessageStatus.FAILED) {
      return (
        <BaseButton onPress={() => onResend(currentMessage)}>
          <View pointerEvents="none">{children}</View>
        </BaseButton>
      );
    } else {
      return <View>{children}</View>;
    }
  };

  return (
    <Wrapper>
      <BubbleContent />
    </Wrapper>
  );
};

export default memo(BubbleChat, (prev, next) =>
  isEqual(prev.currentMessage, next.currentMessage),
);
