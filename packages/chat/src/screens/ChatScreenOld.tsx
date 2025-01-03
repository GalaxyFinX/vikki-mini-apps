import {onDocumentPicker, openCamera, openImageLibrary} from '@services';
import {
  ActionList,
  BaseButton,
  BottomModalManager,
  GestureDetectorView,
  IAttachmentSelectionSheetProps,
  ImageSelectionSheet,
} from '@src/components';
import {IS_IOS, ROUTES, STORAGE_KEY} from '@src/constants';
import {navigate} from '@src/navigations';
import {Colors, DEVICE_WIDTH, Shadow, Size, Typography} from '@src/vikkiverse';
import React, {memo, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {openComposer} from 'react-native-email-link';
import {GiftedChat} from 'react-native-gifted-chat';
import {Image, Options} from 'react-native-image-crop-picker';
import {
  Action,
  Avatar,
  BubbleChat,
  ChatScreenHeader,
  ComposerCustom,
  DayLabel,
  Message,
  MessageTick,
  ScrollBottomButton,
  SendButton,
  SystemMessage,
  TimeChat,
  Toolbar,
  Tooltip,
} from '../components';
import {
  CHAT_MEMBER_STATE,
  CUSTOMER_SERVICE_PHONE,
  EMAIL_VIKKI_CARE,
  CHAT_MEMBER_ROLE,
  OPEN_CAMERA_SETTING,
  OPEN_LIBRARY_SETTING,
  GENESYS_MESSAGE_TYPE,
} from '../customer-service.constants';
import {
  getUploadFilesChunk,
  isValidDocument,
  isValidFileSize,
  isValidMediaFormat,
  normalizeFiles,
} from '../customer-service.helper';
import {ChatMessage, UploadedFile} from '../customer-service.interface';
import {ChatScreenProps} from '../customer-service.navigation';
import {useChat} from '../hooks/useChat';
import {uploadChatFilesToDMS} from '../customer-service.services';
import {openSystemPhoneCall, Storage} from '@src/utils';
import {
  useGetChatConversationIdsQuery,
  useLazyGetConversationRecordingByIdQuery,
} from '../customer-service.query';

const Chat: React.FC<ChatScreenProps> = ({route}) => {
  const {
    params: {name, phone, isAuthenticated},
  } = route;

  const {t} = useTranslation();
  const {
    loadedMessages,
    sendText,
    currentMemberID,
    endConversation,
    members,
    // getUploadedFilePresignedURLs,
    resendMessage,
    loadMore,
    populateMessageData,
    setLoadedMessages,
  } = useChat({isAuthenticated, name, phone});

  const [disableSendButton, setDisableSendButton] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([]);
  const [isShowTooltip, setIsShowTooltip] = useState(false);
  const [isDisabledTooltip, setIsDisabledTooltip] = useState(false);
  const [chatHeight, setChatHeight] = useState(0);
  const partyId = Storage.retrieve(STORAGE_KEY.CUSTOMER_ID);

  const toolbarMaxHeight = IS_IOS ? Size.ms(110) : Size.ms(100);

  const modalRef = useRef<any>(null);
  const chatRef = useRef<FlatList<ChatMessage>>();

  const {data: conversationIds} = useGetChatConversationIdsQuery(
    {},
    {
      skip: !isAuthenticated,
      refetchOnMountOrArgChange: true,
    },
  );
  const [getChatMessageById] = useLazyGetConversationRecordingByIdQuery();
  const [getChatLoading, setGetChatLoading] = useState(false);

  const [loadedConversationIdsIndex, setLoadedConversationIdsIndex] =
    useState(1);

  const onSend = async (arrMessages: ChatMessage[] = []) => {
    if (arrMessages && arrMessages.length) {
      setDisableSendButton(true);
      await sendText(arrMessages[0].text);
    }
  };

  const openActionsMenu = () => {
    Keyboard.dismiss();
    BottomModalManager.present<IAttachmentSelectionSheetProps>({
      SheetComponent: ImageSelectionSheet,
      sheetProps: {
        actionItems: {
          [ActionList.CAMERA]: () =>
            openCamera(uploadMedia, OPEN_CAMERA_SETTING as Options),
          [ActionList.LIBRARY]: () =>
            openImageLibrary(uploadMedia, OPEN_LIBRARY_SETTING as Options),
          [ActionList.DOCUMENT]: () => onDocumentPicker(uploadDocument),
        },
        title: 'customerService.addAttachment',
      },
    });
  };

  const openChatOptions = () => {
    const nextState = !isShowTooltip;
    setIsShowTooltip(nextState);
    if (nextState) {
      const joinedAgent = members.current?.find(
        mem =>
          mem.role === CHAT_MEMBER_ROLE.AGENT &&
          mem.state === CHAT_MEMBER_STATE.CONNECTED,
      );
      setIsDisabledTooltip(joinedAgent === undefined);
    }
  };

  const onCloseConversationPress = async () => {
    setIsShowTooltip(false);
    await endConversation();
  };

  const onSendMailPress = async () => {
    openComposer({
      to: EMAIL_VIKKI_CARE,
      subject: t('customerService.emailSubject', {
        accountName: name,
        phoneNumber: phone,
      }),
    });
  };

  const onMediaPress = (url: string) => {
    navigate(ROUTES.COMMON.IMAGE_VIEW_MODAL_SCREEN, {
      imageUrls: [
        {
          url,
        },
      ],
    });
  };

  const postUploadedFiles = async (viewURLs: string[]) => {
    if (viewURLs.length) {
      await sendText(viewURLs);
    }
  };

  const uploadMedia = (files: Image[] | Image) => {
    const fileArray = Array.isArray(files) ? files : [files];

    const fileToUpload = (fileArray as any).filter(
      (item: any) => isValidMediaFormat(item) && isValidFileSize(item),
    );

    if (fileToUpload.length) {
      uploadFiles(fileToUpload);
    }
  };

  const uploadDocument = async (files: DocumentPickerResponse[]) => {
    const validFiles = files.filter(
      item => isValidDocument(item) && isValidFileSize(item),
    );
    if (validFiles.length) {
      await uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (files: any[] | DocumentPickerResponse[]) => {
    modalRef.current?.dismiss();
    setDisableSendButton(true);
    const sourceFiles = normalizeFiles(files);
    const validFiles = getUploadFilesChunk(sourceFiles);

    setUploadingFiles(validFiles as any);

    await Promise.all(
      validFiles.map(async (file: UploadedFile) => {
        return await uploadChatFilesToDMS(
          file,
          partyId || phone,
          (update: Partial<UploadedFile>) => {
            setUploadingFiles(prev =>
              prev.map(item =>
                item.name === file.name ? {...file, ...update} : item,
              ),
            );
          },
        );
      }),
    );

    setDisableSendButton(false);
  };

  const removeUploadingFile = (index: number) => {
    const result = uploadingFiles.splice(index, 1);
    const filteredFiles = uploadingFiles.filter(
      file => file.name !== result[0].name,
    );
    setUploadingFiles(filteredFiles);

    if (filteredFiles.length === 0) {
      setDisableSendButton(true);
    }
  };

  const openPhoneCall = () => {
    openSystemPhoneCall(CUSTOMER_SERVICE_PHONE);
  };

  const submitAttachments = async () => {
    setUploadingFiles([]);
    const viewUrls = uploadingFiles.map(file => file.viewUrl ?? '');
    await postUploadedFiles(viewUrls);
    setDisableSendButton(true);
  };

  const onTapEndHandler = () => {
    setIsShowTooltip(false);
  };

  const onVideoKYCPress = async (url: string) => {
    const canOpenURL = await Linking.canOpenURL(url || '');
    if (canOpenURL) {
      Linking.openURL(url as string).catch();
    }
  };

  const canLoadOlderMessages = useMemo(() => {
    return (
      isAuthenticated &&
      conversationIds?.conversations &&
      conversationIds?.conversations.length > 1 &&
      loadedConversationIdsIndex <= conversationIds?.conversations.length - 1
    );
  }, [
    isAuthenticated,
    conversationIds?.conversations?.length,
    loadedConversationIdsIndex,
  ]);

  const loadOlderMessage = async () => {
    try {
      if (!conversationIds?.conversations[loadedConversationIdsIndex]) {
        return;
      }
      setGetChatLoading(true);
      const response = await getChatMessageById({
        conversationId:
          conversationIds.conversations[loadedConversationIdsIndex] || '',
      });
      setLoadedConversationIdsIndex(loadedConversationIdsIndex + 1);
      const {data} = response;
      if (data && data.length > 0) {
        const {transcript} = (data[0] as any) || {};

        const populatedInfoMessages = transcript
          .map((item: ChatMessage) => populateMessageData({eventBody: item}))
          .filter(
            (item: ChatMessage) =>
              item.type !== GENESYS_MESSAGE_TYPE.STANDARD || item.text !== null,
          )
          .reverse();

        setLoadedMessages(prev => [...prev, ...populatedInfoMessages]);

        setTimeout(() => {
          const APPROXIMATE_MESSAGE_HEIGHT = 100;
          chatRef?.current?.scrollToOffset({
            offset: loadedMessages.length * APPROXIMATE_MESSAGE_HEIGHT,
          });
        }, 500);
      }
    } catch (err) {
    } finally {
      setGetChatLoading(false);
    }
  };

  return (
    <>
      <ChatScreenHeader
        title={t('customerService.screenTitle')}
        callCenterAction={openPhoneCall}
        openChatOptions={openChatOptions}
      />
      <GestureDetectorView onTapEnd={onTapEndHandler}>
        <View
          style={styles.container}
          onLayout={e => setChatHeight(e.nativeEvent.layout.height)}>
          {canLoadOlderMessages && (
            <BaseButton
              style={styles.seeMoreButton}
              onPress={loadOlderMessage}
              disabled={getChatLoading}>
              <View style={styles.seeMoreLoadingContainer}>
                {getChatLoading && (
                  <ActivityIndicator
                    size={'small'}
                    color={Colors.Brand.Blue1000}
                  />
                )}

                <Text style={styles.seeMore}>
                  {t('customerService.seeMore')}
                </Text>
              </View>
            </BaseButton>
          )}
          <GiftedChat
            _messageContainerRef={chatRef}
            messages={loadedMessages}
            messagesContainerStyle={
              uploadingFiles.length
                ? {height: chatHeight - toolbarMaxHeight}
                : undefined
            }
            showAvatarForEveryMessage={true}
            keyboardShouldPersistTaps={'never'}
            alignTop={IS_IOS ? false : true}
            scrollToBottom={true}
            showUserAvatar={false}
            wrapInSafeArea={false}
            listViewProps={{
              keyboardDismissMode: 'on-drag',
              contentContainerStyle: styles.customMessageContentContainer,
              onEndReached: loadMore, //inverted list
            }}
            alwaysShowSend={true}
            isKeyboardInternallyHandled={true}
            infiniteScroll={true}
            minComposerHeight={
              uploadingFiles.length ? Size.ms(80) : Size.ms(32)
            }
            maxComposerHeight={Size.ms(80)}
            minInputToolbarHeight={
              uploadingFiles.length ? toolbarMaxHeight : Size.ms(72)
            } //padding vertical + toolbar
            bottomOffset={Size.vs(12)}
            onPressActionButton={openActionsMenu}
            renderMessage={props => <Message {...props} />}
            renderAvatar={props => <Avatar {...props} />}
            renderSystemMessage={props => <SystemMessage {...props} />}
            renderTime={props => <TimeChat {...props} />}
            renderBubble={props => (
              <BubbleChat
                {...props}
                onResend={resendMessage}
                onMediaPress={onMediaPress}
                onVideoKYCPress={onVideoKYCPress}
              />
            )}
            renderInputToolbar={props => (
              <Toolbar
                {...props}
                disableSendButton={disableSendButton}
                uploadingFiles={uploadingFiles}
                removeUploadingFile={removeUploadingFile}
                sendUploadingFiles={submitAttachments}
              />
            )}
            renderActions={props => (
              <Action {...props} disableSendButton={disableSendButton} />
            )}
            renderComposer={props => (
              <ComposerCustom
                {...props}
                disableSendButton={setDisableSendButton}
              />
            )}
            renderTicks={(message: ChatMessage) => (
              <MessageTick currentMessage={message} />
            )}
            renderSend={props => (
              <SendButton {...props} isDisable={disableSendButton} />
            )}
            renderDay={props => <DayLabel {...props} />}
            scrollToBottomComponent={() => <ScrollBottomButton />}
            scrollToBottomStyle={styles.scrollToBottom}
            onSend={messages => onSend(messages)}
            user={{
              _id: currentMemberID,
            }}
          />
        </View>
      </GestureDetectorView>
      {isShowTooltip && (
        <Tooltip
          onCloseConversationPress={onCloseConversationPress}
          onSendMailPress={onSendMailPress}
          isDisable={isDisabledTooltip}
        />
      )}
    </>
  );
};

export default memo(Chat);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BG.White,
    flex: 1,
  },
  customMessageContentContainer: {
    flexGrow: 1,
    justifyContent: Platform.select({ios: 'flex-end', android: 'flex-start'}),
  },
  headerText: {
    ...Typography.TextHeading.XSmall,
    color: Colors.TextBlack.Primary,
  },
  chatOptions: {
    marginRight: Size.hs(12),
  },
  scrollToBottom: {
    right: (DEVICE_WIDTH - Size.hs(152)) / 2,
    borderRadius: Size.ms(10),
    backgroundColor: Colors.BG.White,
    opacity: 1,
    alignSelf: 'center',
    width: Size.ms(152),
    height: Size.ms(32),
    ...Shadow.Low,
    borderWidth: Size.ms(1),
    borderColor: Colors.Stroke.Dark10,
  },
  seeMore: {
    ...Typography.TextLabel.Small,
    width: Size.ms(80),
    textAlign: 'center',
    color: Colors.Brand.Blue1000,
  },
  seeMoreButton: {
    padding: 4,
    alignSelf: 'center',
    borderRadius: 4,
  },
  seeMoreLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
