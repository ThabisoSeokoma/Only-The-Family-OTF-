/*
Graphs which will show for both the coach and the player
okay this will  be a selector for now
*/

import React, { useState } from 'react';
import { View, Text, Image, Platform, StyleSheet, ScrollView } from 'react-native';
import FormButton from '../components/SignLogButton';

const DetailsScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Button to player */}
      <FormButton
        buttonTitle="Go to Player"
        onPress={() => navigation.navigate('Player_inputs')}
      />

      {/* Button to coach */}
      <FormButton
        buttonTitle="Go to Coach"
        onPress={() => navigation.navigate('CoachProfile')}
      />
    </ScrollView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    flex: 1,
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
