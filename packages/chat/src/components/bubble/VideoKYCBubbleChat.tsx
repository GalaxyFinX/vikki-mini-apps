import {IEssentialImageVideoAudio, IArrowRight} from '../../assets';
import {ChatMessage} from '../../customer-service.interface';
import {BaseButton} from '@galaxyfinx/react-native-common-ui';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BubbleProps} from 'react-native-gifted-chat';
import MessageTick from '../tick/MessageTick';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
  bubbleContainer: {
    overflow: 'hidden',
    borderRadius: Size.ms(16),
    width: Size.ms(287),
    height: Size.ms(80),
    backgroundColor: Colors.BG.GrayLight,
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
  arrowRightIc: {
    padding: Size.ms(6),
    backgroundColor: Colors.BG.GrayLight,
    borderRadius: Size.ms(20),
    marginLeft: Size.hs(16),
    marginRight: Size.hs(8),
  },
  label: {
    ...Typography.TextBody.Medium,
  },
  des: {
    ...Typography.TextBody.Small,
    color: Colors.TextBlack.Secondary,
    marginTop: Size.vs(4),
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: Size.ms(4),
    justifyContent: 'flex-end',
  },
});

export const VideoKYCBubbleChat: React.FC<
  BubbleProps<ChatMessage> & {onVideoKYCPress: (url: string) => void}
> = props => {
  const {currentMessage, onVideoKYCPress} = props;
  const {t} = useTranslation();

  const onPress = useCallback(() => {
    onVideoKYCPress(currentMessage?.text as string);
  }, [currentMessage?.text]);

  return (
    <BaseButton style={styles.bubbleContainer} onPress={onPress}>
      <View style={styles.bubble}>
        <View style={styles.iconContainer}>
          <IEssentialImageVideoAudio
            baseColor={Colors.Icon.Base}
            primaryColor={Colors.Icon.Primary}
          />
        </View>
        <View>
          <Text style={styles.label}>{t('customerService.callNow')}</Text>
          <Text style={styles.des}>{t('customerService.clickToStart')}</Text>
        </View>
        <View style={styles.arrowRightIc}>
          <IArrowRight baseColor={Colors.TextBlack.Secondary} />
        </View>
      </View>
      <View style={styles.timeContainer}>
        {!!props.renderTime && props.renderTime(props)}
        <MessageTick currentMessage={currentMessage as ChatMessage} />
      </View>
    </BaseButton>
  );
};
