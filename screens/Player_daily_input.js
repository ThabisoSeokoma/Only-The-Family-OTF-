import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput,TouchableWithoutFeedback ,Button ,TouchableOpacity,ScrollView} from 'react-native';
import Slider from '@react-native-community/slider';
import {set, ref ,push} from "firebase/database";
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


const Player_input = ({navigation}) => {
  const [heartRate, setHeartRate] = useState('');
  const [hoursOfSleep, setHoursOfSleep] = useState('');
  const [qualityOfSleep, setQualityOfSleep] = useState('');
  const [rpe, setRPE] = useState('');
  const [mentalhealthscale, setMentalHealthScale] = useState('');
  const [physicalwellness, setwellness] = useState('');
  const [painScale, setPainScale] = useState('');
  const [userName , setName] = useState("");
  const [dateandtime, setDatandtime] = useState(new Date()); 


  const labels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
  const Painlabels = ['None', ' Mild', ' Moderate', ' Severe'];
  const RPElabels = [1,2,3,4,5,6,7,8,9,10];

  const user = auth.currentUser;

  const handleClick = (action) => {
    if(!user){
      console.error('User not Authenticated');
      return;
    }
    const surveyDataRef = ref(db, `Athletes/${user.uid}/surveyData`);
    
    const dataToSave = {
      //dateandtime: dateandtime.toISOString(),
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
      alert("Data has been saved");
      navigation.navigate('Player');
    })
    .catch((error) => {
      console.error('Error saving data to Firebase:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today's Survey</Text>
      <View style={styles.containertwo}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Heart Rate(BPM):</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setHeartRate(text)}
        value={heartRate}
      />
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
  containertwo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  input: {
    flex: 2, 
    width:20,
    height: 35,
    borderColor: 'gray',
    borderWidth: 3,
    borderRadius: 5,
    paddingLeft: 10,
  },
});

export default Player_input;
