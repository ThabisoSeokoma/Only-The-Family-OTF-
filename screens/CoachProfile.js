/* 
Coach profile that allows them to see the profiles of the players and their progress
*/

import React from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';

const CoachProfile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.hello}>This is the coach's profile</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default CoachProfile;