import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity,TextInput, View, StyleSheet } from 'react-native';
import { getDatabase, ref, get, query, orderByChild, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useRoute } from '@react-navigation/native';

// const route = useRoute();
const db = getDatabase();


const ClubConstraints = ({ navigation  ,route}) => {
    const [heartRate, setHeartRate] = useState('');
    const [MaxhoursOfSleep, setMaxHoursOfSleep] = useState('');
    const [MinhoursOfSleep, setMinHoursOfSleep] = useState('');
    const [qualityOfSleep, setQualityOfSleep] = useState('');
    const [rpe, setRPE] = useState('');
    const [mentalhealthscale, setMentalHealthScale] = useState('');
    const [physicalwellness, setwellness] = useState('');
    const [painScale, setPainScale] = useState('');

     const { clubId } = route.params;

    // const route = useRoute();
    // const db = getDatabase();

    const handleSave = () => {

        if (clubId) {
        const auth = getAuth();
        const user = auth.currentUser;
    
        // Get the club ID from the route or wherever it is available
        const clubId = route.params.clubId; // Adjust this based on your routing mechanism
    
        // Reference to the "Managements/userId/clubs/clubId/club_constraints" path
        const clubConstraintsRef = ref(db, `Managements/${user.uid}/clubs/${clubId}/club_constraints`);
    
        // Prepare the data object with your constraints
        const constraintsData = {
          MaxhoursOfSleep,
          MinhoursOfSleep,
          qualityOfSleep,
          rpe,
          mentalhealthscale,
          physicalwellness,
          painScale,
        };
    
        // Push the constraints data to the database
        push(clubConstraintsRef)
          .then((newConstraintsRef) => {
            set(newConstraintsRef, constraintsData)
              .then(() => {
                console.log('Constraints saved successfully');
                navigation.navigate('ClubProfile');
              })
              .catch((error) => {
                console.error('Error saving constraints:', error);
              });
          })
          .catch((error) => {
            console.error('Error pushing new constraints reference:', error);
          });
        }else{
            console.error('clubId is undefined');

        }
      };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Set Constraints To Manage Your Team!</Text>

      <View style={styles.inputContainer}>
        <Text>Heart Rate(BPM):</Text>
        <TextInput
          style={styles.input}
          value={heartRate}
          onChangeText={setHeartRate}
          placeholder="enter value in BPM"
          placeholderTextColor="rgba(0, 0, 0, 0.2)" // Adjust opacity as needed (0.5 for 50% opacity)

        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Acceptable Pain Limit:</Text>
        <TextInput
          style={styles.input}
          value={painScale}
          onChangeText={setPainScale}
          placeholder="on a scale of 1-10"
          placeholderTextColor="rgba(0, 0, 0, 0.2)" // Adjust opacity as needed (0.5 for 50% opacity)

        />
        <Text>Acceptable RPE:</Text>
     <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          value={rpe}
          onChangeText={setRPE}
          placeholder="on a scale of 1-10"
          placeholderTextColor="rgba(0, 0, 0, 0.2)" // Adjust opacity as needed (0.5 for 50% opacity)

        />
        </View>
        <View style={styles.inputContainer}>
        <Text>Maximum Hours of sleep:</Text>
        <TextInput
          style={styles.input}
          value={MaxhoursOfSleep}
          onChangeText={setMaxHoursOfSleep}
          placeholder="enter max value"
          placeholderTextColor="rgba(0, 0, 0, 0.2)" // Adjust opacity as needed (0.5 for 50% opacity)

        />
        </View>
        <View style={styles.inputContainer}>
        <Text>Minimum hours of sleep:</Text>
        <TextInput
          style={styles.input}
          value={MinhoursOfSleep}
          onChangeText={setMinHoursOfSleep}
          placeholder="enter min value"
          placeholderTextColor="rgba(0, 0, 0, 0.2)" // Adjust opacity as needed (0.5 for 50% opacity)

        />
        </View>
        <View style={styles.inputContainer}>
        <Text>Desired quality of sleep:</Text>
        <TextInput
          style={styles.input}
          value={qualityOfSleep}
          onChangeText={setQualityOfSleep}
          placeholder="on a scale of 1-10"
          placeholderTextColor="rgba(0, 0, 0, 0.2)" // Adjust opacity as needed (0.5 for 50% opacity)

        />
        </View>
        <View style={styles.inputContainer}>
        <Text>Desired mental health of each member:</Text>
        <TextInput
          style={styles.input}
          value={mentalhealthscale}
          onChangeText={setMentalHealthScale}
          placeholder="on a scale of 0-5"
          placeholderTextColor="rgba(0, 0, 0, 0.2)" // Adjust opacity as needed (0.5 for 50% opacity)

        />
        </View>
        <View style={styles.inputContainer}>
        <Text>Desired Physical health of each member:</Text>
        <TextInput
          style={styles.input}
          value={physicalwellness}
          onChangeText={setwellness}
          placeholder="on a scale of 0-5"
          placeholderTextColor="rgba(0, 0, 0, 0.2)" // Adjust opacity as needed (0.5 for 50% opacity)

        />
        </View>
        <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}>
        <Text style={styles.addButtonLabel}>
          save constraints
        </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      padding: 20,
    },
    text: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 15,
      alignItems: 'flex-start',
      width: '100%',
    },
    label: {
      marginBottom: 5,
    },
    input: {
      height: 40,
      width: '50%',
      borderWidth: 0.5,
      borderColor: 'rgba(46 ,100 ,229 , 0.2)',
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    saveButton: {
        position: 'absolute',
        bottom: 20,
        right: 8,
        backgroundColor: '#2e64e5',
        padding: 15,
        borderRadius: 5,
        width: '48%',
      },
      addButtonLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        fontFamily: 'Roboto',
        textAlign: 'center',
      },
  });
  
  export default ClubConstraints;