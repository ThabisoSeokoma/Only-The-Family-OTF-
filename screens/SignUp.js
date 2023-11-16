import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {  ScrollView,View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import FormInput from '../components/UserInput';
import FormButton from '../components/SignLogButton';
import { Fireauth } from '../firebase'; // Import Firebase Authentication
import { getAuth, createUserWithEmailAndPassword,updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database'
import zxcvbn from 'zxcvbn';


const SignupScreen = ({ navigation }) => {
 
  const [name, setName] = useState(''); // Add state for name
  const [surname, setSurname] = useState(''); // Add state for surname
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date()); // Initialize with the current date, or the default date you prefer
  const [role, setRole] = useState('Athlete'); // Default role is player
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);


  const auth = getAuth();

  const signUpWithEmailPassword = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        // Store additional user information in the Realtime Database
        const db = getDatabase();
        const node = role === 'Managements' ? 'Managements' : 'Athletes';

        const userRef = ref(db, `${node}/${user.uid}`);
        set(userRef, {
          name,
          surname,
          email,
          dateOfBirth: dateOfBirth.toISOString(), // Convert to ISO format for consistency
        })
          .then(() => {
            // Profile updated successfully
            console.log('User information stored in Realtime Database:', user);
            if (role == 'Athlete') {
              navigation.navigate('Player');
            }
            else{
              navigation.navigate('Coach');
            }
  
            // You can navigate to another screen or perform additional actions here.
          })
          .catch((error) => {
            console.error('Error storing user information:', error);
          });
      })
      .catch((error) => {
        // Handle errors during sign-up
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing up:', errorCode, errorMessage);
        // You can display an error message to the user here.
      });
  };
  const handlePasswordChange = (userPassword) => {
    setPassword(userPassword);
  
    // Check password strength
    const passwordStrength = zxcvbn(userPassword);
    setPasswordStrength(passwordStrength.score);
  };
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
  
    if (selectedDate !== undefined) {
      // If the user selected a date, update the date of birth
      setDateOfBirth(selectedDate);
    } 
    };
    const renderCalendar = () => {
      return showCalendar ? (
        <Calendar
          onDayPress={(day) => {
            setDateOfBirth(new Date(day.dateString));
            setShowCalendar(false);
          }}
        />
      ) : null;
    };
  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Create an account</Text>

       {/* Add Name input */}
      <FormInput
        labelValue={name}
        onChangeText={(userName) => setName(userName)}
        placeholderText="Name"
        iconType="user"
        keyboardType="default"
        autoCapitalize="words"
        autoCorrect={false}
      />

      {/* Add Surname input */}
      <FormInput
        labelValue={surname}
        onChangeText={(userSurname) => setSurname(userSurname)}
        placeholderText="Surname"
        keyboardType="default"
        iconType="user"
        autoCapitalize="words"
        autoCorrect={false}

                           />
      
  {/* Date of Birth input */}
  <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => setShowDatePicker(true)}>
        <Text>{`Date of Birth: ${dateOfBirth.toDateString()}`}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date(1900, 0, 1)} // Adjust the minimum date as needed
        />
      )}
      {/* Select role */}
      <Text style={styles.roleText}>Select role:</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => {
            console.log('Selected value:', itemValue);
            setRole(itemValue);
          }}
          //style={styles.androidPickerContainer}
          style={styles.picker}
        >
          <Picker.Item label="Athlete" value="Athlete" />
          <Picker.Item label="Managements" value="Managements" />
        </Picker>


    {/* Email input */}
      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Password input */}
      <FormInput
  labelValue={password}
  onChangeText={(userPassword) => handlePasswordChange(userPassword)}
  placeholderText="Password"
  iconType="lock"
  secureTextEntry={true}
/>

      {/* Display password strength indicator */}
      {passwordStrength !== null && (
        <Text style={{ color: passwordStrength < 3 ? 'red' : 'green' }}>
          Password Strength: {passwordStrength}
        </Text>
      )}

      {/* Display error message for weak password */}
      {passwordStrength !== null && passwordStrength < 3 && (
        <Text style={{ color: 'red' }}>Password is weak. Choose a stronger password.</Text>
      )}

      {/* Confirm Password input */}
      <FormInput
        labelValue={confirmPassword}
        onChangeText={(userPassword) => setConfirmPassword(userPassword)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />

      {/* Sign-Up Button */}
      <FormButton
        buttonTitle="Sign Up"
        onPress={() => signUpWithEmailPassword()}
      />

      {/* Already have an account? Login */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.navButtonText}>Have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView> 

    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  /*androidPickerContainer: {
    borderWidth: 80,
    borderColor: '#ccc',
    borderRadius: 1,
    backgroundColor: 'white',
  },*/

  calendarButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 25,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 250,
  },
  roleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 230,
  },
  picker: {
    width: '50%', 
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Roboto',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: 'grey',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginRight: 200,
  },
  
});

export default SignupScreen;
