import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';


const AddClubScreen = () => {
  const navigation = useNavigation();
  const [clubName, setClubName] = useState('');

  const handleSaveClub = () => {
    // Ensure the user is authenticated
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Save clubName and clubLogo to the user's "clubs" table
    const db = getDatabase();
    const userClubsRef = ref(db, `Managements/${user.uid}/clubs`);
    const newClubRef = push(userClubsRef);

    // Create a new club object with name and logo
    const newClub = {
      name: clubName,
    };

    // Set the club data in the Realtime Database
    set(newClubRef, newClub)
      .then(() => {
        console.log('Club data saved in the database.');
        // navigate to coach screen
        navigation.navigate('Coach');
      })
      .catch((error) => {
        console.error('Error saving club data:', error);
        // Handle errors during data storage
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Team</Text>

      {/* Club Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Club Name"
        onChangeText={(text) => setClubName(text)}
        value={clubName}
      />

      {/* Button to Save Club */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleSaveClub}>
        <Text style={styles.addButtonLabel}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#2e64e5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#2e64e5',
    padding: 15,
    borderRadius: 5,
  },
  addButtonLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
});

export default AddClubScreen;
