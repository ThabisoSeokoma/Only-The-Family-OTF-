import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const ClubProfile = ({route}) => {
  const navigation = useNavigation();
  const [players, setPlayers] = useState([]);
  const [playerDetails, setPlayerDetails] = useState({});

  const { clubId } = route.params; 

  const handleAddPlayer = () => {
    navigation.navigate('AddPlayer', { clubId: clubId });
  };
  const handlelimits = () => {
    navigation.navigate('Constraints', { clubId:clubId });

  };

  const getPlayerInfo=()=>{
    navigation.navigate('CoachPlayer');
  }
  
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const db = getDatabase();
    const userId = user.uid;
    const clubPlayersRef = ref(db, `Managements/${userId}/clubs/${clubId}/club_players`);

    onValue(clubPlayersRef, (playersSnapshot) => {
      const playersData = playersSnapshot.val();

      if (playersData) {
        const playersArray = Object.keys(playersData).map((playerId) => ({
          id: playerId,
          ...playersData[playerId],
        }));
        setPlayers(playersArray);
      } else {
        console.log('No players found for this club.');
        setPlayers([]);
      }
    });
  }, [clubId]);

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
        onPress={() => getPlayerInfo(player.id)}
      >
        <Text style={styles.playerName}>{player.name + " " + player.surname}</Text>
        <Text style={styles.playerReadinesss}>{"status: " + (player.status || "No data")}</Text>
      </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPlayer}>
        <Text style={styles.addButtonLabel}>
          + Add PLAYER
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.setButton}
        onPress={handlelimits}>
        <Text style={styles.addButtonLabel}>
          Set Club Constraints
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
        backgroundColor: 'rgba(46, 100, 229, 0.20)', 
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '90%',
        alignItems: 'center',
        height: 100, 
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
        left: 10,
        backgroundColor: '#2e64e5',
        padding: 15,
        borderRadius: 5,
        width: '48%',
      },
      setButton: {
        position: 'absolute',
        bottom: 20,
        right: 10,
        backgroundColor: '#2e64e5',
        padding: 15,
        borderRadius: 5,
        width: '45%',
      },
      addButtonLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        fontFamily: 'Roboto',
        textAlign: 'center',
      },
      playerName: {
        fontSize: 18, // Adjust as needed
        fontWeight: 'bold', // To emphasize the name
        marginBottom: 5, // Spacing between name and status
      },
      playerReadinesss: {
        fontSize: 14, // Adjust as needed
        color: 'white', // Status text color
      },
});

export default ClubProfile;
