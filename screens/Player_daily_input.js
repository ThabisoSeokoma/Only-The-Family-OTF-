import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Text, TextInput,TouchableWithoutFeedback ,Button ,TouchableOpacity,ScrollView} from 'react-native';
import Slider from '@react-native-community/slider';
import {get,set, ref ,push} from "firebase/database";

import { db , auth} from "../firebase";
import DateTimePicker from '@react-native-community/datetimepicker';
import { onAuthStateChanged } from "firebase/auth";

const SurveyQuestion = ({
  question,
  options,
  selectedOption,
  onSelectOption,
  isTextInput,
  threshold,
}) => {
  const handleOptionSelect = (option) => {
    onSelectOption(option);
  };

  const getColorForOption = (optionValue) => {
    // Define logic for color change based on the threshold
    if (optionValue < threshold) {
      return 'rgba(255, 0, 0, 0.5)'; // Red with 50% transparency
    } else {
      return 'rgba(0, 255, 0, 0.5)'; // Green with 50% transparency
    }
  };

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.label}>{question}</Text>
      <View style={[styles.ratingContainer, { justifyContent: 'center' }]}>
        {isTextInput ? (
          <TextInput
            style={styles.textInput}
            value={selectedOption}
            onChangeText={(value) => onSelectOption(value)}
          />
        ) : (
          options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.ratingOption,
                {
                  backgroundColor:
                    selectedOption === index
                      ? getColorForOption(index) 
                      : 'opaque',
                },
              ]}
              onPress={() => handleOptionSelect(index)}
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
  const [userComment , setComment] = useState('');
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
    get(userSurveyRef)
    .then((snapshot) => {
      const data = snapshot.val() || {};
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

  const survDataRef = ref(db, `Athletes/${user.uid}/SurveyData`);
  const constraintsData = {
    hoursOfSleep,
    qualityOfSleep,
    rpe,
    mentalhealthscale,
    physicalwellness,
    painScale,
    userComment,
  };

  set(survDataRef, constraintsData)
    .then(() => {
      console.log('Survey data saved successfully');
    })
    .catch((error) => {
      console.error('Error saving survey data:', error);
    });

        
      
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Today's Survey</Text>
      <View style={styles.questionContainer}>
      <Text style={styles.label}>Heart Rate:</Text>
      <View style={styles.inputContainer}>
        <TextInput
        placeholder="Enter Heart Rate (BPM)"
        placeholderTextColor="rgba(0, 0, 0, 0.2)"
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
        threshold={5}
      />
      <SurveyQuestion
        question="Quality of Sleep:"
        options={Painlabels}
        selectedOption={qualityOfSleep}
        onSelectOption={(value) => setQualityOfSleep(value)} 
        threshold={5}
      />
      <SurveyQuestion
        question="Mental Wellness:"
        options={labels}
        selectedOption={mentalhealthscale}
        onSelectOption={(value) => setMentalHealthScale(value)} 
        threshold={2}
      />
      <SurveyQuestion
        question="Physical Health:"
        options={labels}
        selectedOption={physicalwellness}
        onSelectOption={(value) => setwellness(value)} 
        threshold={2}
      />
        <Text style={styles.label}>Comment:</Text>
        <TextInput
          placeholder="give a brief explanation of overall wellness"
          placeholderTextColor="rgba(0, 0, 0, 0.2)"
          onChangeText={(text) => setComment(text)}
          style={styles.textInput}
      />
        <Button
          onPress={handleClick}
          title="Save"
          style={styles.customButton}
        />
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: 10,
  },
  ratingOption: {
    width: 53,
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
    width: 70,
    height: 70,
    alignItems: 'center',
  },
  customButton: {
    position: 'absolute',
    bottom: 20,
    right: 8,
    backgroundColor: '#2e64e5',
    padding: 15,
    borderRadius: 5,
    width: '50%',
    height: '30%',
  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textInput: {
    height: '30%',
    weight: '50%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 10,
  },
});


export default Player_input;
