import {
  SafeAreaContainer,
  SimpleHeader,
} from '@galaxyfinx/react-native-common-ui';
import {
  Colors,
  DEVICE_WIDTH,
  Shadow,
  Size,
  Typography,
} from '@galaxyfinx/react-native-common-ui';
import React, {memo, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {GiftedChat} from 'react-native-gifted-chat';

import {
  Avatar,
  BubbleChat,
  ComposerCustom,
  DayLabel,
  Message,
  MessageTick,
  ScrollBottomButton,
  SendButton,
  SystemMessage,
  TimeChat,
  Toolbar,
} from '../components';

import {ChatMessage} from '../customer-service.interface';
import {useVirtualAssistant} from '../hooks/useVirtualAssistant';
import {Storage} from '../utils';
import {ResourceKey, t} from 'i18next';

const VirtualAssistantChat: React.FC = () => {
  const partyId = Storage.retrieve('6666');

  const {loadedMessages, sendText, loadMore} = useVirtualAssistant();

  const [disableSendButton, setDisableSendButton] = useState(true);

  const onSend = async (arrMessages: ChatMessage[] = []) => {
    await sendText(arrMessages[0].text);
  };

  const DisclaimerText = () => (
    <>
      <Text style={{textAlign: 'center'}}>
        <Text style={Typography.TextTitle.Large}>
          {t('customerService.disclaimer')}
        </Text>
        {'\n'}
        {t('customerService.chatGPTDisclaimer' as ResourceKey)}
      </Text>
    </>
  );
  return (
    <SafeAreaContainer>
      <>
        <SimpleHeader
          style={{marginHorizontal: Size.hs(20)}}
          title="Vikki ChatGPT"
          allowContact={false}
        />
        <View style={styles.container}>
          <GiftedChat
            messages={loadedMessages}
            showAvatarForEveryMessage={true}
            messagesContainerStyle={{paddingBottom: 12}}
            keyboardShouldPersistTaps={'never'}
            renderChatEmpty={() => (
              <View style={styles.disclaimerContainer}>
                <DisclaimerText />
              </View>
            )}
            alignTop={false}
            scrollToBottom={true}
            showUserAvatar={false}
            wrapInSafeArea={false}
            listViewProps={{
              keyboardDismissMode: 'on-drag',
              contentContainerStyle: styles.customMessageContentContainer,
              // contentInset: { top: 50 },
              onEndReached: loadMore, //inverted list
            }}
            alwaysShowSend={true}
            isKeyboardInternallyHandled={true}
            infiniteScroll={true}
            renderMessage={props => <Message {...props} />}
            renderAvatar={props => <Avatar {...props} />}
            renderSystemMessage={props => <SystemMessage {...props} />}
            renderTime={props => <TimeChat {...props} />}
            renderBubble={props => (
              <BubbleChat
                {...props}
                onResend={() => {}}
                onMediaPress={() => {}}
              />
            )}
            renderInputToolbar={props => (
              <Toolbar
                {...props}
                disableSendButton={disableSendButton}
                uploadingFiles={[]}
              />
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
              _id: partyId,
            }}
          />
        </View>
      </>
    </SafeAreaContainer>
  );
};

export default memo(VirtualAssistantChat);

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
  disclaimerContainer: {
    width: '100%',
    height: Size.ms(500),
    justifyContent: 'center',
    padding: Size.vs(30),
    transform: [{scaleY: -1}],
  },
});
