import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity,Button} from 'react-native';
import Slider from '@react-native-community/slider';
import {set, ref ,push} from "firebase/database";
import { db } from "/firebase";

const Player_input = () => {
  const [heartRate, setHeartRate] = useState('');
  const [hoursOfSleep, setHoursOfSleep] = useState('');
  const [qualityOfSleep, setQualityOfSleep] = useState(0);
  const [rpe, setRPE] = useState(0);
  const [mentalhealthscale, setMentalHealthScale] = useState(50);
  const [painScale, setPainScale] = useState(0);

  const handleSliderChange = (value) => {
    setPainScale(value);
  };

  const labels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

  const getLabel = (value) => {
    const index = Math.round(value / (100 / (labels.length - 1)));
    return labels[index];
  };

  const handleClick = (action) => {
    const surveyDataRef = ref(db, `/SurveyData`);
    const dataToSave = {
      heartRate,
      hoursOfSleep,
      qualityOfSleep,
      rpe,
      mentalhealthscale,
      painScale,
  };
  set(surveyDataRef, dataToSave)
    .then(() => {
      console.log('Data saved to Firebase');
    })
    .catch((error) => {
      console.error('Error saving data to Firebase:', error);
    });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today's Survey</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Heart Rate (BPM):</Text>
        <TextInput
          style={styles.input}
          value={heartRate}
          onChangeText={(text) => setHeartRate(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hours of Sleep:</Text>
        <TextInput
          style={styles.input}
          value={hoursOfSleep}
          onChangeText={(text) => setHoursOfSleep(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quality of Sleep:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={qualityOfSleep}
          onValueChange={(value) => setQualityOfSleep(value)}
        />
      <Text style={styles.sliderValue}>{getLabel(qualityOfSleep)}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mental Health:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={mentalhealthscale}
          onValueChange={(value) => setMentalHealthScale(value)}
        />
      <Text style={styles.sliderValue}>{getLabel(mentalhealthscale)}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pain Scale:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={painScale}
          onValueChange={handleSliderChange}
        />
        <Text style={styles.sliderValue}>{painScale}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>RPE:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={rpe}
          onValueChange={(value) => setRPE(value)}
        />
        <Text style={styles.sliderValue}>{rpe}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={() => handleClick('handleSave')} title="Save" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch', // Fill the screen width
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 2,
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
  },
  slider: {
    flex: 2,
    width:200 ,
  },
  sliderValue: {
    fontSize: 18,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems:'center',
    width:20,
  },
});

export default Player_input;
