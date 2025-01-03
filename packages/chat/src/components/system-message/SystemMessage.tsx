import {
  CHAT_MEMBER_ROLE,
  GENESYS_MESSAGE_TYPE,
} from '../../customer-service.constants';
import {ChatMessage} from '../../customer-service.interface';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {SystemMessageProps} from 'react-native-gifted-chat';

const styles = StyleSheet.create({
  systemMessage: {
    flex: 1,
    alignItems: 'center',
    marginVertical: Size.vs(10),
    height: Size.ms(65),
    paddingVertical: Size.vs(9),
    textAlign: 'center',
  },
  systemMessageText: {
    ...Typography.TextBody.Small,
    color: Colors.TextBlack.Secondary,
    textAlign: 'center',
  },
});

const SystemMessage: React.FC<SystemMessageProps<ChatMessage>> = ({
  currentMessage,
}) => {
  const {t} = useTranslation();
  const {user, type} = currentMessage ?? {};

  const [systemMessage, setSystemMessage] = useState('');
  useEffect(() => {
    switch (type) {
      case GENESYS_MESSAGE_TYPE.MEMBER_JOIN:
        if (user?.role === CHAT_MEMBER_ROLE.AGENT) {
          setSystemMessage('sessionStartMessage');
        }
        break;
      case GENESYS_MESSAGE_TYPE.MEMBER_LEAVE:
        if (user?.role === CHAT_MEMBER_ROLE.CUSTOMER) {
          setSystemMessage('sessionEndMessage');
        }
        break;
      default:
        setSystemMessage(currentMessage?.text || '');
        break;
    }
  }, [type]);

  if (!systemMessage) {
    return null;
  }

  return (
    <View style={styles.systemMessage}>
      <Text style={styles.systemMessageText}>{systemMessage}</Text>
    </View>
  );
};

export default memo(SystemMessage);
