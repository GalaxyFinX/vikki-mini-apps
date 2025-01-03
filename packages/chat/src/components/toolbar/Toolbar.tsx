import {ChatMessage, UploadedFile} from '../../customer-service.interface';
import {IS_IOS} from '../../constants';
import {Colors, Size} from '@galaxyfinx/react-native-common-ui';
import React, {memo} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {InputToolbar, InputToolbarProps} from 'react-native-gifted-chat';
import {AttachmentPreviewToolbar} from '..';

const styles = StyleSheet.create({
  container: {
    borderRadius: Size.ms(28),
    borderWidth: Size.ms(1),
    borderTopWidth: Size.ms(1),
    marginHorizontal: Size.hs(16),
    paddingHorizontal: Size.hs(8),
    marginBottom: Platform.select({
      ios: Size.vs(20),
      android: Size.vs(10),
    }),
  },
});

interface CustomInputToolbarProps extends InputToolbarProps<ChatMessage> {
  uploadingFiles: UploadedFile[];
  removeUploadingFile: (index: number) => void;
  disableSendButton: boolean;
  sendUploadingFiles: () => void;
}

const Toolbar: React.FC<CustomInputToolbarProps> = props => {
  const {
    uploadingFiles,
    removeUploadingFile,
    disableSendButton,
    sendUploadingFiles,
  } = props;

  return uploadingFiles.length ? (
    <AttachmentPreviewToolbar
      {...props}
      uploadingFiles={uploadingFiles}
      disableSendButton={disableSendButton}
      removeUploadingFile={removeUploadingFile}
      onSubmit={sendUploadingFiles}
    />
  ) : (
    <InputToolbar
      {...props}
      containerStyle={[
        styles.container,
        {
          borderColor: disableSendButton
            ? Colors.Stroke.GrayLow
            : Colors.Main.Active,
          borderTopColor: disableSendButton
            ? Colors.Stroke.GrayLow
            : Colors.Main.Active,
          paddingTop: disableSendButton ? 0 : IS_IOS ? 0 : Size.vs(8),
          paddingLeft: disableSendButton ? Size.hs(8) : Size.hs(12),
        },
      ]}
    />
  );
};

export default memo(Toolbar);
