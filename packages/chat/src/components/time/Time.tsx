import {ChatMessage, MessageStatus} from '../../customer-service.interface';
import {Colors, Size} from '@galaxyfinx/react-native-common-ui';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Time, TimeProps} from 'react-native-gifted-chat';

const styles = StyleSheet.create({
  timeContainerWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
  timeLeftContainer: {
    minWidth: Size.ms(162),
    marginRight: Size.hs(4),
  },
  timeRightContainer: {
    minWidth: Size.ms(162),
    marginRight: Size.hs(4),
  },
  time: {
    color: Colors.TextBlack.Secondary,
  },
});

const TimeChat: React.FC<TimeProps<ChatMessage>> = props => {
  if (
    !!props.currentMessage?.status &&
    props.currentMessage.status !== MessageStatus.SENT
  ) {
    return null;
  }

  return (
    <View style={styles.timeContainerWrapper}>
      <Time
        {...props}
        containerStyle={{
          left: styles.timeLeftContainer,
          right: styles.timeRightContainer,
        }}
        timeTextStyle={{
          left: styles.time,
          right: styles.time,
        }}
        timeFormat="HH:mm"
      />
    </View>
  );
};

export default memo(TimeChat);
