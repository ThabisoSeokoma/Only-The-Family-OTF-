/*
Resting heart rate (on waking in the morning)
Quality and hours of sleep
VAS (Visual Analogue Scale)
Pain from previous day
Mental Health*/

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet, ScrollView } from 'react-native';
import FormInput from '../components/UserInput';
import FormButton from '../components/SignLogButton';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';

const ProgressScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}> Deez Nuts Chief </Text>
    </ScrollView>
  );
};

export default ProgressScreen;

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