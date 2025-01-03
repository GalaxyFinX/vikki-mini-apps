import {IArrowRoundLeft, ICheck} from '../../assets';
import {ChatMessage, MessageStatus} from '../../customer-service.interface';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TextStyle, View} from 'react-native';
import * as Progress from 'react-native-progress';

const styles = StyleSheet.create({
  sendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Size.hs(12),
    marginBottom: Size.vs(3),
  },
  tick: {marginBottom: Size.vs(5)},
  tickContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Size.hs(12),
    marginBottom: Size.vs(5),
  },
  sendingText: {
    ...Typography.TextBody.XSmall,
    color: Colors.TextBlack.Secondary,
    marginRight: Size.hs(4),
  },
});

const iconSize = {
  width: Size.ms(12),
  height: Size.ms(12),
};

type MessageTickProps = {
  currentMessage: ChatMessage;
  textStyle?: TextStyle;
  tickColor?: string;
};

const MessageTick: React.FC<MessageTickProps> = ({
  currentMessage,
  textStyle = {},
  tickColor,
}) => {
  const {t} = useTranslation();

  if (currentMessage.status === MessageStatus.SENDING) {
    return (
      <View style={styles.sendingContainer}>
        <Text style={[styles.sendingText, textStyle]}>
          {t('customerService.messageStatusSending')}
        </Text>
        <Progress.CircleSnail
          size={Size.ms(12)}
          indeterminate={true}
          thickness={Size.ms(2)}
          color={[Colors.Main.Accent]}
        />
      </View>
    );
  }

  if (currentMessage.status === MessageStatus.FAILED) {
    return (
      <View style={styles.sendingContainer}>
        <Text style={[styles.sendingText, textStyle]}>
          {t('customerService.messageStatusError')}
        </Text>
        <IArrowRoundLeft {...iconSize} baseColor={Colors.TextSupport.Error} />
      </View>
    );
  }

  return (
    <View style={styles.tickContainer}>
      <ICheck
        baseColor={tickColor || Colors.TextBlack.Secondary}
        {...iconSize}
      />
    </View>
  );
};

export default MessageTick;
