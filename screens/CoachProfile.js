import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const CoachProfile = () => {
  const navigation = useNavigation();
  const [clubs, setClubs] = useState([]);

  const handleAddClub = () => {
    navigation.navigate('AddClub'); // Navigate to the AddClub screen
  };
  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    // Get a reference to the database
    const db = getDatabase();

    // Replace 'yourUserId' with the actual user ID of the coach
    const userId =  user.uid;

    // Get a reference to the user's clubs
    const userClubsRef = ref(db, `users/${userId}/clubs`);

    // Listen for changes in the clubs data
    onValue(userClubsRef, (snapshot) => {
      const clubsData = snapshot.val();

      // Convert the clubsData object into an array of clubs
      const clubsArray = [];
      for (const clubId in clubsData) {
        const club = clubsData[clubId];
        clubsArray.push({ id: clubId, ...club });
      }

      // Update the clubs state with the fetched clubs
      setClubs(clubsArray);
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/sports-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>CLUBS</Text>

      {clubs.map((club) => (
        <TouchableOpacity
          key={club.id}
          style={styles.clubContainer}
          onPress={() => {
            // Handle club click (e.g., navigate to club details screen)
          }}>
          <Text style={styles.clubName}>{club.name}</Text>
          {/* Add other club information here */}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddClub}>
        <Text style={styles.addButtonLabel}>
          + Add Club
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  clubContainer: {
    backgroundColor: '#2e64e5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
  },
  clubName: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Roboto',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#2e64e5',
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  addButtonLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
});

export default CoachProfile;
