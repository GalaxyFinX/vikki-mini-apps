import {IDocument} from '../../assets';
import {ChatMessage} from '../../customer-service.interface';
import {BaseButton} from '@galaxyfinx/react-native-common-ui';
import {GOOGLE_PDF_VIEWER} from '../../customer-service.constants';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BubbleProps} from 'react-native-gifted-chat';
import MessageTick from '../tick/MessageTick';

const styles = StyleSheet.create({
  bubbleContainer: {
    overflow: 'hidden',
    borderRadius: Size.ms(16),
    width: Size.ms(287),
    height: Size.ms(80),
    backgroundColor: Colors.BGSupport.PrimaryBlueLow,
  },
  bubble: {
    backgroundColor: Colors.Base.White,
    margin: Size.ms(2),
    borderRadius: Size.ms(16),
    overflow: 'hidden',
    height: Size.ms(56),
    flexDirection: 'row',
    alignItems: 'center',
    padding: Size.ms(8),
  },
  iconContainer: {
    padding: Size.ms(6),
    backgroundColor: Colors.BG.GrayLight,
    borderRadius: Size.ms(20),
    marginRight: Size.hs(16),
  },
  fileName: {
    ...Typography.TextBody.Medium,
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: Size.ms(4),
    justifyContent: 'flex-end',
  },
});

export const DocumentBubbleChat: React.FC<BubbleProps<ChatMessage>> = props => {
  const {currentMessage} = props;

  const fileName = currentMessage?.text.substring(
    currentMessage?.text.indexOf('_') + 1,
    currentMessage?.text.indexOf('?'),
  );

  const onPressPdf = () => {
    const encodedUrl = encodeURIComponent(currentMessage?.text || '');
    const iFrameUrl = GOOGLE_PDF_VIEWER + encodedUrl;
    // navigate(ROUTES.COMMON.WEB_VIEW, {
    //   uri: iFrameUrl,
    // });
  };

  return (
    <BaseButton style={styles.bubbleContainer} onPress={onPressPdf}>
      <View style={styles.bubble}>
        <View style={styles.iconContainer}>
          <IDocument baseColor={Colors.TextBlack.Secondary} />
        </View>
        <Text style={styles.fileName}>{fileName}</Text>
      </View>
      <View style={styles.timeContainer}>
        {!!props.renderTime && props.renderTime(props)}
        <MessageTick currentMessage={currentMessage as ChatMessage} />
      </View>
    </BaseButton>
  );
};
