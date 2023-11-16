import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Text, TextInput,TouchableWithoutFeedback ,Button ,TouchableOpacity,ScrollView} from 'react-native';
import Slider from '@react-native-community/slider';
import {get,set, ref ,push} from "firebase/database";

import { db , auth} from "../firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { onAuthStateChanged } from "firebase/auth";

const SurveyQuestion = ({ question, options, selectedOption, onSelectOption, isTextInput }) => {
  const handleOptionSelect = (option) => {
    onSelectOption(option);
  };

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.label}>{question}</Text>
      <View style={[styles.ratingContainer, { justifyContent: 'center' }]}>
        {isTextInput ? (
          <TextInput
            style={styles.textInput} // Define a style for the text input
            value={selectedOption}
            onChangeText={(value) => onSelectOption(value)}
          />
          ) : (
          options.map((option, index) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.ratingOption,
                selectedOption === option ? styles.selectedRatingOption : null,
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.ratingText}>{option}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

const Player_input = ({ navigation }) => {
  const [heartRate, setHeartRate] = useState('');
  const [hoursOfSleep, setHoursOfSleep] = useState('');
  const [qualityOfSleep, setQualityOfSleep] = useState('');
  const [rpe, setRPE] = useState('');
  const [mentalhealthscale, setMentalHealthScale] = useState('');
  const [physicalwellness, setwellness] = useState('');
  const [painScale, setPainScale] = useState('');
  const [userName, setName] = useState('');
  const [dateandtime, setDatandtime] = useState(new Date());

  const labels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
  const Painlabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const RPElabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const user = auth.currentUser;
  const userSurveyRef = ref(db, `DataToPlot/${user.uid}`);
  useEffect(() => {
    if (user) {
      get(userSurveyRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setHeartRate(data.heartRate || '');
            setHoursOfSleep(data.hoursOfSleep || '');
            setQualityOfSleep(data.qualityOfSleep || '');
            setRPE(data.rpe || '');
            setMentalHealthScale(data.mentalhealthscale || '');
            setPainScale(data.painScale || '');
          }
        });
    }
  }, [user]);


  const handleClick = async () => {
    if (!user) {
      console.error('User not Authenticated');
      return;
    }
 
  try {
    //const surveyDataRef = ref(db, `DataToPlot/${user.uid}`);
    get(userSurveyRef)
    .then((snapshot) => {
      const data = snapshot.val() || {};
      // Append new values to the arrays
      data.heartRate = data.heartRate || [];
      data.heartRate.push(heartRate);
      data.hoursOfSleep = data.hoursOfSleep || [];
      data.hoursOfSleep.push(hoursOfSleep);
      data.qualityOfSleep = data.qualityOfSleep || [];
      data.qualityOfSleep.push(qualityOfSleep);
      data.rpe = data.rpe || [];
      data.rpe.push(rpe);
      data.mentalhealthscale = data.mentalhealthscale || [];
      data.mentalhealthscale.push(mentalhealthscale);
      data.painScale = data.painScale || [];
      data.painScale.push(painScale);
    
    set(userSurveyRef, data)
    .then(() => {
      console.log('Data saved to the Realtime Database');
      alert('Data has been saved');
      navigation.navigate('Player');
    })
    .catch((error) => {
      console.error('Error saving data to the Realtime Database:', error);
    });
    });
  } catch (error) {
  console.error('Error saving data to the Realtime Database:', error);
  }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today's Survey</Text>
      <View style={styles.questionContainer}>
      <Text style={styles.label}>Heart Rate:</Text>
      <View style={styles.inputContainer}>
        <TextInput
        placeholder="Enter Heart Rate (BPM)"
        onChangeText={(text) => setHeartRate(text)} 
        style={styles.textInput}
        />
      </View>
    </View>
        <SurveyQuestion
        question="RPE:"
        options={RPElabels}
        selectedOption={rpe}
        onSelectOption={(value) => setRPE(value)} 
      />
      <SurveyQuestion
        question="Pain Scale:"
        options={RPElabels}
        selectedOption={painScale}
        onSelectOption={(value) => setPainScale(value)} 
      />
      <SurveyQuestion
        question="Hours of Sleep:"
        options={Painlabels}
        selectedOption={hoursOfSleep}
        onSelectOption={(value) => setHoursOfSleep(value)} 
      />
      <SurveyQuestion
        question="Quality of Sleep:"
        options={Painlabels}
        selectedOption={qualityOfSleep}
        onSelectOption={(value) => setQualityOfSleep(value)} 
      />
      <SurveyQuestion
        question="Mental Wellness:"
        options={labels}
        selectedOption={mentalhealthscale}
        onSelectOption={(value) => setMentalHealthScale(value)} 
      />
      <SurveyQuestion
        question="Physical Health:"
        options={labels}
        selectedOption={physicalwellness}
        onSelectOption={(value) => setwellness(value)} 
      />
      <View style={styles.buttonContainer}>
      <Button
        onPress={handleClick}
        title="Save"
        style={styles.customButton}
      />
      </View>
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'left',
    padding: 20,
    height: 500,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  label: {
    fontSize: 17.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: 10,
  },
  ratingOption: {
    width:53,
    height: 53,
    borderRadius: 40,
    borderColor: 'gray',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    marginBottom: 5,
  },
  selectedRatingOption: {
    borderColor: 'gold',
  
  },
  ratingText: {
    fontSize: 10,
    color: 'black',
  },
  buttonContainer: {
    marginTop: 30,
    width:70,
    height:70,
    alignItems: 'center',
    
  },
  customButton: {
    width: 200,  
    height: 200,  
  },
  questionContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 17.5,
  },
  inputContainer: {
    flex: 1, 
    marginLeft: 10, 
  },
  textInput: {
    height: 40, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: 'gray',
    paddingLeft: 10, 
  },
});

export default Player_input;
