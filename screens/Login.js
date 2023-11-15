import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet, ScrollView } from 'react-native';
import FormInput from '../components/UserInput';
import FormButton from '../components/SignLogButton';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth();

  // Function to handle user login
  const loginWithEmailPassword = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User signed in successfully
        const user = userCredential.user;

        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User signed in successfully
            console.log('User signed in:', user);

            // Retrieve the user's role from Firebase or your database
            // You need to implement this based on how you store the role during sign-up.
            const userRole = user.role; // Replace with the actual code to get the role.

            // Navigate based on the user's role
           // if (userRole === 'Athlete') {
              navigation.navigate('Player');
           // } else {
            //  navigation.navigate('Coach');
           // }
          }
        });
      })
      .catch((error) => {
        // Handle errors during login
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing in:', errorCode, errorMessage);
        // You can display an error message to the user here.
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/sports-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>Train-Assist: OTF dawg</Text>

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

      {/* Login Button */}
      <FormButton
        buttonTitle="Login"
        onPress={() => loginWithEmailPassword()}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('Forgot')}>
        <Text style={styles.navButtonText}>
          Forgot Password?
          </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.navButtonText}>
          Don't have an account? Create here
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
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
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Roboto',
  },
});