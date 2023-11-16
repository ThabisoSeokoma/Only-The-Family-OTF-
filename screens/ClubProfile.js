import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const ClubProfile = () => {
  const navigation = useNavigation();
  const [players, setPlayers] = useState([]);
  const [clubId, setClubId] = useState(''); // Add clubId state

  const handleAddPlayer = () => {
    navigation.navigate('AddPlayer', { clubId: clubId });
  };
  
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    // Get a reference to the database
    const db = getDatabase();

    // The actual user ID of the coach
    const userId = user.uid;

    // Path to the club ID in your database
    const clubIdPath = `Managements/${user.uid}/clubs`; // Modify this path accordingly

    // Get a reference to the user's clubs
    const userClubsRef = ref(db, clubIdPath);

    // Listen for changes in the user's club data
    onValue(userClubsRef, (snapshot) => {
      const clubData = snapshot.val();

      if (clubData) {
        // Assuming clubData is an object with club IDs as keys, get the first club ID
        const firstClubId = Object.keys(clubData)[0];
        setClubId(firstClubId); // Set the clubId state with the first club ID

        // Now, you can use the clubId to fetch club players
        const clubPlayersRef = ref(db, `Managements/${user.uid}/clubs/${firstClubId}/club_players`);

        // Listen for changes in the club players data
        onValue(clubPlayersRef, (playersSnapshot) => {
          const playersData = playersSnapshot.val();

          if (playersData) {
            // Convert the playersData object into an array of players
            const playersArray = Object.keys(playersData).map((playerId) => ({
              id: playerId,
              ...playersData[playerId],
            }));

            // Update the players state with the fetched players
            setPlayers(playersArray);
          } else {
            // Handle case when no players are found
            console.log('No players found for this club.');
          }
        });
      } else {
        // Handle case when no clubs are found
        console.log('No clubs found for this user.');
      }
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/sports-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>CLUB PLAYERS</Text>

      {players.map((player) => (
        <TouchableOpacity
          key={player.id}
          style={styles.clubContainer}
          onPress={() => {
            // Handle player click (e.g., navigate to player details screen)
          }}>
          <Text style={styles.playerName}>{player.name}</Text>
          {/* Add other player information here */}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPlayer}>
        <Text style={styles.addButtonLabel}>
          + Add PLAYER
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
      playerName: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        fontFamily: 'Roboto',
      },
});

export default ClubProfile;
