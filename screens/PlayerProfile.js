/* Player profile that has the following
Name
Age
Sport
Speciality
Weight (kgs)
Height (m)
BMI (Body Mass Index) - divide your weight by your height
*/

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet, ScrollView } from 'react-native';
import FormButton from '../components/SignLogButton';

const PlayerScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/sports-logo.png')}
        style={styles.logo}
      />

      {/* Survey Button */}
      <FormButton
        buttonTitle="Survey Entries"
        onPress={() => navigation.navigate('Player_inputs')}
      />

      {/* Progress Button */}
      <FormButton
        buttonTitle="Progress Analysis"
        onPress={() => navigation.navigate('Progress')}
      />
    </ScrollView>
  );
};

export default PlayerScreen;

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