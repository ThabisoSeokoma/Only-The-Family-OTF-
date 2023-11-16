// UpdateProfileScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView,Modal,Pressable,Alert,} from 'react-native';
import { getAuth } from '@firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';



const calculateBMI = (height, weight) => {
  if (!height || !weight) {
    return null;
  }

  const heightInMeters = height / 100; // Convert height to meters
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
  return bmi;
};
const UpdateProfileScreen = () => {
  const navigation = useNavigation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [surname, setUserSurname] = useState('');
  const [dateOfBirth, setUserDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [bmi, setBMI] = useState('');
  const [sportSpeciality, setSportSpeciality] = useState(null);
  const [age, setAge] = useState(null);

  useEffect(() => {
    // Set up a listener for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setUser(user);
        // Fetch user's name, height, and weight from the Realtime Database
        fetchUserData(user.uid);
      } else {
        // No user is signed in.
        setUser(null);
        setUserName(''); // Reset the userName when the user signs out
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [auth]);
  

  const fetchUserData = (userId) => {
    const db = getDatabase();
    const userRef = ref(db, `Athletes/${userId}`);
    
    // Set up a listener for changes in the user's data
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        setUserName(userData.name || '');
        setUserSurname(userData.surname || '');
        setUserDateOfBirth(userData.dateOfBirth || '');
        setEmail(userData.email || '');
        setHeight(userData.height || null);
        setWeight(userData.weight || null);
        setBMI(userData.bmi || null);
        setSportSpeciality(userData.sportSpeciality ? userData.sportSpeciality.trim() : '');
        setAge(userData.age || null);
       
      }
    });
  };
  
  
  const handleSaveHeightWeight = () => {
    const newBMI = calculateBMI(height, weight);
    const db = getDatabase();
    const userRef = ref(db, `Athletes/${user.uid}`);
    console.log('Before state update:', { height, weight, bmi: newBMI, sportSpeciality, age });
  
    set(userRef, {
      name: userName,
      surname: surname,
      dateOfBirth: dateOfBirth,
      email: email,
      weight,
      bmi: newBMI,
      height,
      sportSpeciality,
      age,
    })
      .then(() => {
        console.log('Data saved successfully!');
        setShowConfirmation(true);
      })
      .catch((error) => {
        console.error('Error saving height and weight:', error);
      });
  };
  
  const closeConfirmation = () => {
    setShowConfirmation(false);
    navigation.navigate('Progress');
  };
return (
  <ScrollView contentContainerStyle={styles.container}>
    {user ? (
      <>
        <Text style={styles.text}>{`${userName} please update below:`}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Height(m):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter height"
            keyboardType="numeric"
            value={height ? height.toString() : ''}
            onChangeText={(text) => setHeight(text)}
            textAlignVertical="top"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight(kg):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter weight"
            keyboardType="numeric"
            value={weight ? weight.toString() : ''}
            onChangeText={(text) => setWeight(text)}
            textAlignVertical="top"
          />
        </View>
        <View style={styles.inputContainer}>
        
          <Text style={styles.label}>BMI:</Text>
          <TextInput
           style={[styles.input, styles.nonEditableInput]}
            placeholder="BMI"
            value={bmi ? bmi.toString() : ''}
            onChangeText={(text) => setBMI(text)}
            editable={false} 
            textAlignVertical="top"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>SportSpeciality:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter SportSpeciality"
            value={sportSpeciality ? sportSpeciality.toString() : ''}
            onChangeText={(text) => setSportSpeciality(text)}
            textAlignVertical="top"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Age"
            keyboardType="numeric"
            value={age ? age.toString() : ''}
            onChangeText={(text) => setAge(text)}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity style={styles.updateProfileButton} onPress={handleSaveHeightWeight}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <Modal
    animationType="slide"
    transparent={true}
    visible={showConfirmation}
    onRequestClose={() => {
      setShowConfirmation(!showConfirmation);
    }}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>Data Saved Successfully!</Text>
      <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={closeConfirmation}
      >
        <Text style={styles.textStyle}>OK</Text>
      </Pressable>
    </View>
  </View>
</Modal>
      </>
    ) : (
      <Text style={styles.text}>Please </Text>
    )}
  </ScrollView>
);
};  

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    padding: 60,
    paddingTop: 50,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#051d5f',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    flex: 1,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: 'green',  
  },

  updateProfileButton: {
    marginTop: 150,
    padding: 10,
    backgroundColor: '#2e64e5',
    borderRadius: 0.5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  spacer: {
    width: 20,
  },

  invalidInput: {
    borderColor: 'red',
    borderWidth: 2,
  },
  nonEditableInput: {
    borderWidth: 0,  
    borderBottomWidth: 0,  
      
  },
  
});


