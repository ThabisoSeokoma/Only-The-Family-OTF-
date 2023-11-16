import React, { useState } from 'react';
import { getAuth,sendPasswordResetEmail } from 'firebase/auth';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
/*const auth = initializeAuth(App, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});*/

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // Assuming you have initialized 'database' and 'history' somewhere in your code

  const handleSubmit = async () => {
    try {
      sendPasswordResetEmail(getAuth(),email);
      setMessage('Check your email for password reset instructions');
      // Redirect or navigate to another page here if needed using 'history'
      // history.push('/login'); // Example navigation to login page
    } catch (error) {
      setMessage(error.code);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Reset Password" onPress={handleSubmit} />
      {message && <Text>{message}</Text>}
    </View>
  );
}

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});
