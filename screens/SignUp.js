import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import FormInput from '../components/UserInput';
import FormButton from '../components/SignLogButton';
import { Fireauth } from '../firebase'; // Import Firebase Authentication
import { createUserWithEmailAndPassword } from '@firebase/auth';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Function to handle user sign-up
  const signUpWithEmailPassword = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    Fireauth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User signed up successfully
        const user = userCredential.user;
        console.log('User signed up:', user);
        // You can navigate to another screen or perform additional actions here.
      })
      .catch((error) => {
        // Handle errors during sign-up
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing up:', errorCode, errorMessage);
        // You can display an error message to the user here.
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>

      {/* Email input */}
      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Password input */}
      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      {/* Confirm Password input */}
      <FormInput
        labelValue={confirmPassword}
        onChangeText={(userPassword) => setConfirmPassword(userPassword)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />

      {/* Sign-Up Button */}
      <FormButton
        buttonTitle="Sign Up"
        onPress={() => signUpWithEmailPassword()}
      />

      {/* Already have an account? Login */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.navButtonText}>Have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Roboto',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: 'grey',
  },
});
