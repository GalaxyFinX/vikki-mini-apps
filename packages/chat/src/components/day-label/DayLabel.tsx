import {ChatMessage} from '../../customer-service.interface';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import moment from 'moment';
import React, {memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {DayProps, isSameDay} from 'react-native-gifted-chat';

const DayLabel: React.FC<DayProps<ChatMessage>> = props => {
  const {currentMessage, previousMessage} = props;
  const {t} = useTranslation();

  const noNeedToRender = useMemo(() => {
    return (
      currentMessage == null ||
      (currentMessage &&
        previousMessage &&
        isSameDay(currentMessage, previousMessage))
    );
  }, [currentMessage, previousMessage]);

  const textTime = useMemo(() => {
    const time = moment(moment()).diff(currentMessage?.createdAt, 'minutes');

    if (time <= 1) {
      return t('customerService.justNow');
    }
    if (time < 60) {
      return t('customerService.fewMinutesAgo', {minute: time});
    }
    return moment(currentMessage?.createdAt).locale('en').format('ll');
  }, [currentMessage]);

  return noNeedToRender ? null : (
    <View style={styles.dayWrapper}>
      <Text style={styles.text}>{textTime}</Text>
    </View>
  );
};

export default memo(DayLabel);

const styles = StyleSheet.create({
  dayWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Size.vs(10),
    paddingVertical: Size.vs(9),
  },
  text: {
    ...Typography.TextBody.Small,
    color: Colors.TextBlack.Secondary,
  },
});
