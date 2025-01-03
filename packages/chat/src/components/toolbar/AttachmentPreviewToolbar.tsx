import {IClose, IDocument, ISendMail} from '../../assets';
import {BaseButton, FloatButton} from '@galaxyfinx/react-native-common-ui';
import {isMediaFile} from '../../customer-service.helper';
import {ChatMessage, UploadedFile} from '../../customer-service.interface';
import {Colors, Size} from '@galaxyfinx/react-native-common-ui';
import React, {memo} from 'react';
import {FlatList, Platform, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {InputToolbarProps} from 'react-native-gifted-chat';
import * as Progress from 'react-native-progress';

export const styles = StyleSheet.create({
  toolbarWrapper: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginHorizontal: Size.hs(16),
    paddingRight: Size.hs(8),
    paddingVertical: Size.vs(4),
    paddingLeft: Size.hs(6),
    borderRadius: Size.ms(16),
    borderWidth: Size.ms(1),
    borderColor: Colors.Stroke.GrayLow,
  },
  listAttachmentsContainer: {
    height: Size.ms(75),
  },
  imageBackgroundWrapper: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: Size.ms(66),
  },
  imageBackground: {
    width: Size.ms(64),
    height: Size.ms(64),
    borderRadius: Size.ms(12),
    overflow: 'hidden',
    marginVertical: Size.vs(4),
    marginRight: Size.hs(2),
    marginLeft: Size.hs(2),
  },
  documentPlaceholder: {
    marginHorizontal: Size.hs(16),
    marginTop: -Size.vs(7),
  },
  documentFileName: {maxWidth: Size.ms(50)},
  closeButtonWrapper: {
    marginTop: Size.vs(4),
    marginLeft: Size.hs(40),
    marginRight: Size.hs(4),
    borderRadius: Size.ms(100),
    borderWidth: Size.ms(1),
    borderColor: Colors.BG.GrayLight,
    backgroundColor: Colors.BG.GrayLight,
    width: Size.ms(20),
    height: Size.ms(20),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    marginLeft: Size.hs(4),
    marginTop: Size.vs(40),
    borderRadius: Size.ms(100),
  },
  progressBar: {
    marginHorizontal: Size.hs(14),
    marginTop: Platform.select({
      ios: Size.vs(5),
      android: Size.vs(10),
    }),
    backgroundColor: Colors.BG.OverlayLight30,
  },
});

interface AttachmentPreviewToolbarProps extends InputToolbarProps<ChatMessage> {
  uploadingFiles: UploadedFile[];
  disableSendButton: boolean;
  removeUploadingFile: (index: number) => void;
  onSubmit: () => void;
}

const AttachmentPreviewToolbar: React.FC<
  AttachmentPreviewToolbarProps
> = props => {
  const {
    uploadingFiles,
    removeUploadingFile,
    onSubmit,
    disableSendButton,
    ...restProps
  } = props;

  const isDocumentUpload = !(
    uploadingFiles.length && isMediaFile(uploadingFiles[0].path)
  );

  const renderUploadingFiles = ({
    item,
    index,
  }: {
    item: UploadedFile;
    index: number;
  }) => {
    const isUploading = !!(item.progress && item.progress < 100);
    const completed = !isUploading && !!item.progress;
    const isImage = isMediaFile(item.path);
    return (
      <View style={styles.imageBackgroundWrapper}>
        <FastImage
          style={[
            styles.imageBackground,
            completed
              ? {backgroundColor: Colors.BG.GrayLight}
              : {backgroundColor: Colors.BG.OverlayDark25},
          ]}
          source={isImage && completed ? {uri: item.path} : {}}
          resizeMode={FastImage.resizeMode.cover}>
          <BaseButton
            style={styles.closeButtonWrapper}
            onPress={() => {
              removeUploadingFile(index);
            }}>
            <IClose
              baseColor={Colors.Icon.Base}
              width={Size.ms(12)}
              height={Size.ms(12)}
            />
          </BaseButton>
          {!(isImage && completed) && (
            <IDocument
              width={Size.ms(32)}
              height={Size.ms(32)}
              baseColor={Colors.Icon.Base}
              style={styles.documentPlaceholder}
            />
          )}
          {!completed && (
            <Progress.Bar
              progress={item.progress}
              color={Colors.Base.White}
              borderColor={Colors.BG.OverlayLight30}
              borderWidth={Size.ms(0.5)}
              borderRadius={Size.ms(10)}
              style={styles.progressBar}
              height={Size.ms(2)}
              width={Size.ms(36)}
            />
          )}
        </FastImage>
        {!isImage && (
          <Text numberOfLines={1} style={styles.documentFileName}>
            {item.name}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.toolbarWrapper,
        {
          borderColor: disableSendButton
            ? Colors.Stroke.GrayLow
            : Colors.Main.Active,
        },
      ]}
      {...restProps}>
      <FlatList
        horizontal
        showsVerticalScrollIndicator={false}
        style={[
          styles.listAttachmentsContainer,
          isDocumentUpload ? {height: Size.ms(90)} : {},
        ]}
        data={uploadingFiles}
        renderItem={renderUploadingFiles}
        keyExtractor={(item, index) => `${item.name}_${index}`}
      />
      <FloatButton
        size="xSmall"
        type="primary"
        state={disableSendButton ? 'disabled' : 'enabled'}
        style={[
          styles.sendButton,
          isDocumentUpload ? {marginTop: Size.vs(50)} : {},
        ]}
        onPress={onSubmit}
        Icon={ISendMail}
      />
    </View>
  );
};

export default memo(AttachmentPreviewToolbar);
