import {ChatMessage} from '../../customer-service.interface';

import React from 'react';
import {BubbleProps} from 'react-native-gifted-chat';
import {StyleSheet, Text, View} from 'react-native';
import {CommonBubbleChat} from './CommonBubbleChat';
import {Size, Typography} from '@galaxyfinx/react-native-common-ui';
import {GPT_END_STREAM_SIGNAL} from '../../customer-service.constants';
import {t} from 'i18next';

export const StreamingTextBubble: React.FC<
  BubbleProps<ChatMessage>
> = props => {
  const RenderText = ({currentMessage}: {currentMessage: ChatMessage}) => {
    const content =
      currentMessage.finishedReason === GPT_END_STREAM_SIGNAL.GENERAL
        ? t('common.sthWentWrong')
        : currentMessage?.text;

    return (
      <View style={styles.bubbleText}>
        <Text style={Typography.TextBody.Medium}>
          <Text>{content}</Text>
          {/* {!currentMessage?.finishedReason && (
            <BlinkCursor blinkTime={200} cursorStyle={styles.cursorStyle} />
          )} */}
        </Text>
      </View>
    );
  };

  return (
    <CommonBubbleChat
      {...props}
      renderMessageText={({currentMessage}) => (
        <RenderText currentMessage={currentMessage!} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  cursorStyle: {
    height: Size.vs(8),
    width: Size.hs(2),
  },
  bubbleText: {marginHorizontal: Size.hs(12), marginTop: Size.vs(12)},
});
