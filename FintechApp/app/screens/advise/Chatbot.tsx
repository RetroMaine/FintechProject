import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';

const markdownStyles = {
    body:         { color: '#333', fontSize: 16, lineHeight: 22 },
    strong:       { fontWeight: '700' },
    bullet_list:  { marginBottom: 4 },
    heading2:     { fontSize: 18, fontWeight: '600', marginVertical: 6 },
  } as any;

const ChatbotScreen = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    setLoading(true);
    setResponse('');

    try {
      const userData = {
        Income: Number(await AsyncStorage.getItem('Income')) || 0,
        Rating: Number(await AsyncStorage.getItem('Rating')) || 0,
        Cards: Number(await AsyncStorage.getItem('Cards')) || 0,
        Age: Number(await AsyncStorage.getItem('Age')) || 0,
        Education: Number(await AsyncStorage.getItem('Education')) || 0,
        Balance: Number(await AsyncStorage.getItem('Balance')) || 0,
        Ethnicity: (await AsyncStorage.getItem('Ethnicity')) || "Not Specified",
        Student: (await AsyncStorage.getItem('Student')) === 'true',
        Married: (await AsyncStorage.getItem('Married')) === 'true',
      };

      const res = await fetch('http://127.0.0.1:8000/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, userData }),
      });

      const data = await res.json();
      setResponse(data.reply || 'No response received.');
    } catch (error) {
      console.error(error);
      setResponse('Failed to connect to the chatbot.');
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Financial Chatbot</Text>
      <TextInput
        placeholder="Ask a financial question..."
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        multiline
      />
      <Button title="Ask" onPress={sendQuestion} disabled={loading || !question.trim()} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {response !== '' && (
        // <View style={styles.responseBox}>
        //   <Text style={styles.responseText}>{response}</Text>
        // </View>
        <Markdown style={markdownStyles}>
            {response}
            </Markdown>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderColor: '#ccc', borderWidth: 1, borderRadius: 8,
    padding: 10, minHeight: 80, textAlignVertical: 'top', marginBottom: 10
  },
  responseBox: {
    marginTop: 20,
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 8,
  },
  responseText: { fontSize: 16 },
});

export default ChatbotScreen;
