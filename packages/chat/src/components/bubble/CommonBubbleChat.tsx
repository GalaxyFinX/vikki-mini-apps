import {ChatMessage} from '../../customer-service.interface';
import {
  CHAT_MEMBER_ROLE,
  GENESYS_MESSAGE_TYPE,
} from '../../customer-service.constants';
import React from 'react';
import {Text, View} from 'react-native';
import {Bubble, BubbleProps} from 'react-native-gifted-chat';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
  bubbleWrapper: {display: 'flex', flexDirection: 'column'},
  bubbleLeftWrapper: {
    backgroundColor: Colors.BG.GrayLight,
    minWidth: Size.ms(80),
    display: 'flex',
    paddingTop: Size.vs(4),
    borderTopLeftRadius: Size.ms(16),
    borderBottomLeftRadius: Size.ms(16),
  },
  bubbleRightWrapper: {
    backgroundColor: Colors.BGSupport.PrimaryBlueLow,
    paddingTop: Size.vs(4),
    minWidth: Size.ms(80),
    borderTopRightRadius: Size.ms(16),
    borderBottomRightRadius: Size.ms(16),
  },
  text: {
    ...Typography.TextBody.Medium,
  },
  agentInfoContainer: {
    height: Size.ms(18),
    display: 'flex',
    flexDirection: 'row',
  },
  agentNameText: {
    ...Typography.TextTitle.XSmall,
  },
  agentIdText: {
    ...Typography.TextTitle.XSmall,
    color: Colors.TextBlack.Secondary,
  },
});

export const CommonBubbleChat: React.FC<BubbleProps<ChatMessage>> = props => {
  const {currentMessage, previousMessage} = props;

  const bubble = (
    <Bubble
      {...props}
      textStyle={{
        left: styles.text,
        right: styles.text,
      }}
      wrapperStyle={{
        left: styles.bubbleLeftWrapper,
        right: styles.bubbleRightWrapper,
      }}
    />
  );

  const memberJoinConversation =
    previousMessage?.type === GENESYS_MESSAGE_TYPE.MEMBER_JOIN &&
    currentMessage?.type === GENESYS_MESSAGE_TYPE.STANDARD;

  const messageFromDifferentUser =
    memberJoinConversation ||
    currentMessage?.user?._id !== previousMessage?.user?._id;

  const isAgent = currentMessage?.user.role === CHAT_MEMBER_ROLE.AGENT;

  return memberJoinConversation || messageFromDifferentUser ? (
    <View style={styles.bubbleWrapper}>
      <View style={[styles.agentInfoContainer]}>
        {isAgent && (
          <Text style={styles.agentNameText}>{currentMessage?.user.name}</Text>
        )}
      </View>
      {bubble}
    </View>
  ) : (
    bubble
  );
};
