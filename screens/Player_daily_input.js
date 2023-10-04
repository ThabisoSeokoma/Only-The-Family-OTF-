import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput,TouchableWithoutFeedback ,Button ,TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import {set, ref ,push} from "firebase/database";
import { db ,auth} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";


const SurveyQuestion = ({ question, options, selectedOption, onSelectOption }) => {
  const handleOptionSelect = (option) => {
    onSelectOption(option);
  };

  const renderOptions = () => {
    return options.map((option, index) => (
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
    ));
  };

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.label}>{question}</Text>
      <View style={[styles.ratingContainer, { justifyContent: 'center' }]}>
        {renderOptions()}
      </View>
    </View>
  );
};


const Player_input = () => {
  const [heartRate, setHeartRate] = useState('');
  const [hoursOfSleep, setHoursOfSleep] = useState('');
  const [qualityOfSleep, setQualityOfSleep] = useState('');
  const [rpe, setRPE] = useState('');
  const [mentalhealthscale, setMentalHealthScale] = useState('');
  const [painScale, setPainScale] = useState('');
  const [userName , setName] = useState("");


  

  const labels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
  const Painlabels = ['None', ' Mild', ' Moderate', ' Severe'];
  const RPElabels = ['Very Light' ,'Light' , 'Moderate' , 'Vigorous' ,'Very hard' , 'Max Effort'];

 // const user = user.currentUser;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      setName(user);
    } else { 
    }
  });

  const handleClick = (action) => {
    const surveyDataRef = ref(db, `/SurveyData`);
    const dataToSave = {
      //userName,
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
      navigation.navigate('Details');
    })
    .catch((error) => {
      console.error('Error saving data to Firebase:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today's Survey</Text>
      <SurveyQuestion
        question="Hours of Sleep:"
        options={['<5', '5-7', '8-10', '>10']}
        selectedOption={hoursOfSleep}
        onSelectOption={(value) => setHoursOfSleep(value)}
      />
      <SurveyQuestion
        question="Quality of Sleep:"
        options={labels}
        selectedOption={qualityOfSleep}
        onSelectOption={(value) => setQualityOfSleep(value)} 
      />
      <SurveyQuestion
        question="Heart Rate (BPM):"
        options={['Low', 'Normal', 'High']}
        selectedOption={heartRate}
        onSelectOption={(value) => setHeartRate(value)} 
      />
      <SurveyQuestion
        question="RPE:"
        options={RPElabels}
        selectedOption={rpe}
        onSelectOption={(value) => setRPE(value)} 
      />
      <SurveyQuestion
        question="Pain Scale:"
        options={Painlabels}
        selectedOption={painScale}
        onSelectOption={(value) => setPainScale(value)} 
      />
      <SurveyQuestion
        question="Overall Wellness:"
        options={labels}
        selectedOption={mentalhealthscale}
        onSelectOption={(value) => setMentalHealthScale(value)} 
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
    alignItems : 'right',
    justifyContent: 'center',
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
    marginHorizontal: 10,
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
    alignItems: 'center',
    
  },
  customButton: {
    width: 200,  
    height: 200,  
  },
  
});

export default Player_input;