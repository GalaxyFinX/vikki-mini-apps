import {ISendMail} from '../../assets';
import {FloatButton} from '@galaxyfinx/react-native-common-ui';
import {ChatMessage} from '../../customer-service.interface';
import {Size} from '@galaxyfinx/react-native-common-ui';
import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {SendProps} from 'react-native-gifted-chat';

const styles = StyleSheet.create({
  sendButton: {
    width: Size.ms(32),
    height: Size.ms(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Size.vs(8),
    borderRadius: Size.ms(100),
  },
  icon: {
    width: Size.ms(16),
    height: Size.ms(16),
  },
});

interface SendButtonProps extends SendProps<ChatMessage> {
  isDisable: boolean;
}

const SendButton: React.FC<SendButtonProps> = props => {
  const {isDisable, onSend, text} = props;

  const onSendHandler = () => {
    if (onSend && text) {
      onSend({text: text.trim()}, true);
    }
  };

  return (
    <FloatButton
      Icon={ISendMail}
      type={'primary'}
      state={isDisable ? 'disabled' : 'enabled'}
      onPress={onSendHandler}
      style={styles.sendButton}
      iconProps={styles.icon}
    />
  );
};

export default memo(SendButton);
