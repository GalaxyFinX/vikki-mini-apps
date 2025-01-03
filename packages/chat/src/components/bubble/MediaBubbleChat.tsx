import {ChatMessage} from '../../customer-service.interface';
import {BaseButton} from '@galaxyfinx/react-native-common-ui';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BubbleProps} from 'react-native-gifted-chat';
import {MessageTick, TimeChat} from '..';
// import { CommonBubbleChat } from './CommonBubbleChat';

const styles = StyleSheet.create({
  bubbleContainer: {
    overflow: 'hidden',
    borderRadius: Size.ms(16),
    width: Size.ms(300),
    height: Size.ms(200),
  },
  image: {
    width: Size.ms(300),
    height: Size.ms(200),
  },
  timeContainer: {
    flexDirection: 'row',
    position: 'absolute',
    maxWidth: Size.ms(80),
    backgroundColor: Colors.TextBlack.Secondary,
    bottom: Size.vs(8),
    right: Size.hs(12),
    borderRadius: Size.ms(10),
    paddingVertical: Size.vs(2),
  },
  timeText: {
    ...Typography.TextBody.XSmall,
    color: Colors.Base.White,
  },
  messageTick: {
    color: Colors.Base.White,
  },
});

const MediaBubbleChat: React.FC<
  BubbleProps<ChatMessage> & {onMediaPress: (url: string) => void}
> = props => {
  const {currentMessage} = props;
  const [loadImageFailed, setLoadImageFailed] = useState(false);

  const onPress = useCallback(
    () => props.onMediaPress(currentMessage?.text as string),
    [currentMessage?.text],
  );

  if (loadImageFailed) {
    // return <CommonBubbleChat {...props} />;
    return null;
  }

  return (
    <BaseButton style={styles.bubbleContainer} onPress={onPress}>
      <FastImage
        style={styles.image}
        source={{uri: currentMessage?.text}}
        resizeMode={FastImage.resizeMode.cover}
        onError={() => setLoadImageFailed(true)}
      />
      <View style={styles.timeContainer}>
        <TimeChat
          {...props}
          timeTextStyle={{
            right: styles.timeText,
            left: styles.timeText,
          }}
        />
        <MessageTick
          currentMessage={currentMessage as ChatMessage}
          textStyle={styles.messageTick}
          tickColor={Colors.Base.White}
        />
      </View>
    </BaseButton>
  );
};

export {MediaBubbleChat};
