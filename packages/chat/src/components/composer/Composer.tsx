import {
  MAX_INPUT_LENGTH,
  MAX_INPUT_LINE_NUMBER,
} from '../../customer-service.constants';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import React, {Dispatch, memo, SetStateAction} from 'react';
import {useTranslation} from 'react-i18next';
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputChangeEventData,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import {Composer, ComposerProps} from 'react-native-gifted-chat';

export const styles = StyleSheet.create({
  composer: {
    paddingTop: Platform.select({ios: Size.vs(5), android: 0}),
    paddingBottom: 0,
    ...Typography.TextBody.Medium,
    color: Colors.TextBlack.Secondary,
    marginRight: Size.hs(8),
    marginLeft: 0,
    marginBottom: Size.vs(8),
  },
});

interface ComposerCustomProps extends ComposerProps {
  disableSendButton: Dispatch<SetStateAction<boolean>>;
}

const ComposerCustom: React.FC<ComposerCustomProps> = props => {
  const {t} = useTranslation();
  const {onInputSizeChanged, disableSendButton} = props;

  const onChangeHandler = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const isTyping = !!nativeEvent.text.trim();
    disableSendButton(!isTyping);
  };

  const onContentSizeChangeHandler = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    if (onInputSizeChanged) {
      onInputSizeChanged({
        width: event.nativeEvent.contentSize.width,
        height: event.nativeEvent.contentSize.height,
      });
    }
  };

  return (
    <Composer
      {...props}
      multiline={true}
      placeholder={t('customerService.composerPlaceHolder')}
      placeholderTextColor={Colors.TextBlack.Secondary}
      textInputProps={{
        maxLength: MAX_INPUT_LENGTH,
        numberOfLines: MAX_INPUT_LINE_NUMBER,
        onChange: event => onChangeHandler(event),
        onContentSizeChange: event => onContentSizeChangeHandler(event),
      }}
      textInputStyle={styles.composer}
    />
  );
};

export default memo(ComposerCustom);
