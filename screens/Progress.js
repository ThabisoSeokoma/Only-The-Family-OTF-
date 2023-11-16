import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { getAuth } from '@firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) {
    return null;
  }

  const dob = new Date(dateOfBirth);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dob.getFullYear();

  // Check if the birthday has occurred this year
  if (
    currentDate.getMonth() < dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
};


const ProgressScreen = ({ navigation }) => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [bmi, setBMI] = useState('');
  const [sportSpeciality, setSportSpeciality] = useState(null);
  const [age, setAge] = useState(null);

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        setUser(null);
        setUserName('');
      }
    });
  
    return () => unsubscribe();
  }, [auth]);

  const fetchUserData = (userId) => {
    const db = getDatabase();
    const userRef = ref(db, `Athletes/${userId}`);
    
    // Set up a listener for changes in the user's data
    onValue(userRef, (snapshot) => {
      console.log('User Data:', snapshot.val());  // Log the entire snapshot for debugging
      const userData = snapshot.val();
      if (userData) {
        setUserName(userData.name || '');
        setHeight(userData.height || '');
        setWeight(userData.weight || '');
        setBMI(userData.bmi || '');
        setSportSpeciality(userData.sportSpeciality.trim() || '');
        setAge(calculateAge(userData.dateOfBirth));
        setUser(userData);
      }
    });
  };
  const bmiColor = (bmi) => {
    if (!bmi) {
      // Return a default color if BMI is not available
      return 'black';
    }
  
    if (bmi < 18.5) {
      return 'red'; // Underweight
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return 'green'; // Healthy Weight
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      return 'red'; // Overweight
    } else {
      return 'red'; // Obese
    }
  };

  const sportSpecialties = {
    // Football
        striker: { height: { min: 170, max: 190 }, weight: { min: 70, max: 90 } },
        midfielder: { height: { min: 160, max: 180 }, weight: { min: 60, max: 80 } },
        defender: { height: { min: 170, max: 200 }, weight: { min: 80, max: 110 } },
        goalkeeper: { height: { min: 180, max: 200 }, weight: { min: 70, max: 100 } },
    
    // Basketball
        pointGuard: { height: { min: 180, max: 195 }, weight: { min: 70, max: 90 } },
        shootingGuard: { height: { min: 185, max: 200 }, weight: { min: 80, max: 100 } },
        smallForward: { height: { min: 190, max: 210 }, weight: { min: 90, max: 110 } },
        powerForward: { height: { min: 195, max: 210 }, weight: { min: 90, max: 120 } },
        center: { height: { min: 200, max: 220 }, weight: { min: 100, max: 130 } },
    
    // Netball
    
        shooter: { height: { min: 160, max: 180 }, weight: { min: 50, max: 70 } },
        goalAttack: { height: { min: 165, max: 185 }, weight: { min: 55, max: 75 } },
        wingAttack: { height: { min: 160, max: 180 }, weight: { min: 50, max: 70 } },
        center: { height: { min: 160, max: 180 }, weight: { min: 50, max: 70 } },
        wingDefense: { height: { min: 165, max: 185 }, weight: { min: 55, max: 75 } },
        goalDefense: { height: { min: 160, max: 180 }, weight: { min: 50, max: 70 } },
        goalkeeper: { height: { min: 165, max: 185 }, weight: { min: 55, max: 75 } },
    // Volleyball

        setter: { height: { min: 160, max: 180 }, weight: { min: 50, max: 70 } },
        outsideHitter: { height: { min: 170, max: 190 }, weight: { min: 60, max: 80 } },
        middleBlocker: { height: { min: 165, max: 185 }, weight: { min: 55, max: 75 } },
        oppositeHitter: { height: { min: 170, max: 190 }, weight: { min: 60, max: 80 } },
        libero: { height: { min: 160, max: 180 }, weight: { min: 50, max: 70 } },
      
    // Tennis
  
        singlesPlayer: { height: { min: 160, max: 190 }, weight: { min: 50, max: 90 } },
        doublesPlayer: { height: { min: 170, max: 190 }, weight: { min: 60, max: 80 } },
      
    // Rugby

        prop: { height: { min: 170, max: 190 }, weight: { min: 80, max: 110 } },
        hooker: { height: { min: 175, max: 195 }, weight: { min: 85, max: 115 } },
        lock: { height: { min: 180, max: 200 }, weight: { min: 90, max: 120 } },
        flanker: { height: { min: 175, max: 195 }, weight: { min: 85, max: 115 } },
        numberEight: { height: { min: 180, max: 200 }, weight: { min: 90, max: 120 } },
        scrumHalf: { height: { min: 165, max: 185 }, weight: { min: 60, max: 80 } },
        flyHalf: { height: { min: 170, max: 190 }, weight: { min: 70, max: 90 } },
        center: { height: { min: 175, max: 195 }, weight: { min: 80, max: 110 } },
        wing: { height: { min: 180, max: 200 }, weight: { min: 85, max: 115 } },
        fullback: { height: { min: 170, max: 190 }, weight: { min: 70, max: 90 } },
    
  
  };
  
  
  // Function to check if the user's attribute is within the recommended range
  const isAttributeInRange = (attribute, sport,userData) => {
    
    if (!userData || !userData.sportSpeciality) {
      console.error('User or sportSpeciality is null or undefined');
      return false;
    }
    const sportRanges = sportSpecialties[sport];
    if (!sportRanges) {
      // Handle the case where sport is not found
      alert(`Sport '${sport}' not found in sportSpecialties`);
      return false;
    }
  
    const range = sportRanges[attribute];
    if (!range) {
      // Handle the case where attribute is not found for the given sport
      alert(`Attribute '${attribute}' not found for sport '${sport}'`);
      return false;
    }
   
    return userData[attribute] >= range.min && userData[attribute] <= range.max;
  };
  const handleUpdateProfile = () => {
    // Navigate to the UpdateProfile screen
    navigation.navigate('Update');
  };
  
  return (
    
    <ScrollView contentContainerStyle={styles.container}>
  {user ?(
    <>
    
      <Text style={styles.text}>{`${userName}'s progress`}</Text>

      <View style={styles.inputContainer}>
  <Text style={styles.label}>Height:</Text>
  <TextInput
    style={[styles.input, isAttributeInRange('height', sportSpeciality, user) ? null : styles.invalidInput]}
    placeholder="Enter height"
    keyboardType="numeric"
    value={height ? `${height.toString()} m` : 'NOT SPECIFIED'}
    onChangeText={(text) => setHeight(text)}
    editable={false} // Set editable to false to make it non-editable
  />
  <View style={styles.spacer} /> {/* Spacer */}
  {/* Display a red or green square based on validation */}
  {isAttributeInRange('height', sportSpeciality, user) ? (
    <View style={{ width: 20, height: 20, backgroundColor: 'green' }} />
  ) : (
    <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />
  )}
</View>

<View style={styles.inputContainer}>
  <Text style={styles.label}>Weight:</Text>
  <TextInput
    style={[styles.input, isAttributeInRange('weight', sportSpeciality, user) ? null : styles.invalidInput]}
    placeholder="Enter weight"
    keyboardType="numeric"
    value={weight ? `${weight.toString()} kg` : 'NOT SPECIFIED'}
    onChangeText={(text) => setWeight(text)}
    editable={false} // Set editable to false to make it non-editable
  />
  <View style={styles.spacer} /> {/* Spacer */}
  {/* Display a red or green square based on validation */}
  {isAttributeInRange('weight', sportSpeciality, user) ? (
    <View style={{ width: 20, height: 20, backgroundColor: 'green' }} />
  ) : (
    <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />
  )}
</View>
<View style={styles.inputContainer}>
  <Text style={styles.label}>BMI:</Text>
  <Text style={styles.input}>{bmi ? bmi.toString() : 'NOT SPECIFIED'}</Text>
  {/* Display a red or green square based on BMI category */}
  {bmi && (
    <View style={{ width: 20, height: 20, backgroundColor: bmiColor(bmi) }} />
  )}
 </View>


      <View style={styles.inputContainer}>
        <Text style={styles.label}>SportSpeciality:</Text>
        <Text style={styles.input}>{sportSpeciality ? sportSpeciality.toString() : 'NOT SPECIFIED'}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age:</Text>
        <Text style={styles.input}>{age ? age.toString() : 'NOT SPECIFIED'}</Text>
      </View>

      <TouchableOpacity style={styles.updateProfileButton} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </>
  ) : (
    <Text style={styles.text}>Welcome</Text>
  )}
</ScrollView>

  );
};  

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    padding: 20,
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
    paddingHorizontal: 20,
  },
  input: {
    height: 20,
    borderColor: 'white',
    marginBottom: 2,
    paddingHorizontal: 120,
    flex: 1,
  },
  updateProfileButton: {
    marginTop: 150,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#2e64e5',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    width: 120, 
    color: 'white',
    textAlign: 'center',
  },
  spacer: {
    width: 128, 
  },

  invalidInput: {
    borderColor: 'red',
    borderWidth: 0,
  },
});