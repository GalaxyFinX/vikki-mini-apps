import {IAttachment} from '../../assets';
import {BaseButton} from '@galaxyfinx/react-native-common-ui';
import {Colors, Size} from '@galaxyfinx/react-native-common-ui';
import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {ActionsProps} from 'react-native-gifted-chat';

const styles = StyleSheet.create({
  action: {
    width: Size.ms(32),
    height: Size.ms(32),
    backgroundColor: Colors.BG.GrayLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Size.hs(8),
    marginVertical: Size.vs(8),
    borderRadius: Size.ms(100),
  },
});

const iconSize = {
  width: Size.ms(16),
  height: Size.ms(16),
};

interface CustomActionProps extends ActionsProps {
  disableSendButton: boolean;
}

const Action: React.FC<CustomActionProps> = props => {
  const {disableSendButton} = props;

  return disableSendButton ? (
    <BaseButton
      {...props}
      style={styles.action}
      onPress={props.onPressActionButton}>
      <IAttachment {...iconSize} baseColor={Colors.Icon.Base} />
    </BaseButton>
  ) : null;
};

export default memo(Action);
