import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
const ChatScreen = (props: any) => {
  const [messages, setMessages] = useState<Array<{id: string; text: string}>>(
    [],
  );
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      setMessages(prev => [
        ...prev,
        {id: Date.now().toString(), text: inputText},
      ]);
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => props.navigation?.goBack()}>
            <Text style={styles.backButtonText}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.titleText}>{props.title}</Text>
          <View style={styles.backButton} />
        </View>
        <FlatList
          data={messages}
          renderItem={({item}) => (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#0078FE',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0078FE',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatScreen;

const API_END_POINTS = {
  CUSTOMER_SERVICE_CHAT_BASE_URL: `https://api.apne2.pure.cloud/api/v2/`,
  CREATE_CONVERSATION: 'webchat/guest/conversations',
  GET_AUTHENTICATED_CHAT_TOKEN: 'messaging/conversation/token',
  GET_SIGNEDDATA_TOKEN: `https://api.apne2.pure.cloud/api/v2/signeddata`,
  END_CONVERSATION: (conversationID: string, memberID: string) =>
    `webchat/guest/conversations/${conversationID}/members/${memberID}`,
  SEND_MESSAGE: (conversationID: string, memberID: string) =>
    `webchat/guest/conversations/${conversationID}/members/${memberID}/messages`,
  GET_CHAT_MEMBER_DETAIL: (conversationID: string) =>
    `webchat/guest/conversations/${conversationID}/members`,
  GET_CHAT_MESSAGES: (conversationID: string) =>
    `webchat/guest/conversations/${conversationID}/messages`,
  PRESIGNED_UPLOAD_FILE_URL: 'messaging/public/images/multiPresignedUrls',
  PRESIGNED_UPLOAD_FILE_URL_AUTH: 'messaging/private/images/multiPresignedUrls',
  STORE_CONVERSATION_TO_DB: (conversationID: string) =>
    `messaging/conversation/authentication/${conversationID}`,
  GET_CONVERSATION_IDS: (pageSize: number) =>
    `messaging/conversations?pageSize=${pageSize}`,
  GET_CONVERSATION_DETAILS_BY_ID: (conversationsId: string) =>
    `conversations/${conversationsId}/recordings`,
};
