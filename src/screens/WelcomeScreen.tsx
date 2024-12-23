import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';

const WelcomeScreen = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('Welcome to React Native!');

  const updateMessage = () => {
    setMessage(`Hello, ${name || 'Guest'}!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Update Message" onPress={updateMessage} />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});
