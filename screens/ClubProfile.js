import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue,get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const ClubProfile = () => {

  const navigation = useNavigation();
  const [players, setPlayers] = useState([]);
  //const [ACWR, setACWR] = useState(null);
  const [playerDetails, setPlayerDetails] = useState({});

  const [clubId, setClubId] = useState('');
  const [maxACWRThreshold, setMaxACWRThreshold] = useState(5); // Default value, you can adjust it as needed

  const handleAddPlayer = () => {
    navigation.navigate('AddPlayer', { clubId: clubId });
  };
  const handlelimits = () => {
    navigation.navigate('Constraints', { clubId:clubId });

  };

  const getPlayerInfo=(id)=>{
    navigation.navigate('CoachPlayer',{id:id});
  }
  
  const auth = getAuth();
  const user = auth.currentUser;

  //const playerIdPath = 'Athletes/${athlete.uid}/';



useEffect(() => {
  // ... (existing code)
  const db = getDatabase();
  const userId = user.uid;
  const clubIdPath = `Managements/${user.uid}/clubs`; 
  const userClubsRef = ref(db, clubIdPath);

  onValue(userClubsRef, (snapshot) => {
    const clubData = snapshot.val();
    if (clubData) {
      const firstClubId = Object.keys(clubData)[0];
      setClubId(firstClubId);

      const clubConstraintsRef = ref(db, `Managements/${user.uid}/clubs/${firstClubId}/club_constraints/Maxacwr`);

      onValue(clubConstraintsRef, (constraintsSnapshot) => {
        const maxACWRValue = constraintsSnapshot.val();
        if (maxACWRValue !== null) {
        const numericValue = parseFloat(maxACWRValue);

        if (!isNaN(numericValue)) {
      // Conversion successful, set the state
      setMaxACWRThreshold(numericValue);
  } else {
    maxACWRValue=0
    console.warn('Invalid numeric value for maxACWR from the database.');
  }
} else {
  setMaxACWRThreshold(0);
  console.warn('maxACWRValue is default.');
}
      });

      const clubPlayersRef = ref(db, `Managements/${user.uid}/clubs/${firstClubId}/club_players`);


      onValue(clubPlayersRef, async (playersSnapshot) => {
        const playersData = playersSnapshot.val();
      
        if (playersData) {
          const playersArray = await Promise.all(
            Object.keys(playersData).map(async (playerId) => {
              const player = {
                id: playerId,
                ...playersData[playerId],
              };
      
              // Fetch RPE data for each player from club_players path
              const rpePath = `Managements/${user.uid}/clubs/${firstClubId}/club_players/${playerId}/rpe`;
              const rpeRef = ref(db, rpePath);
      
              try {
                const rpeSnapshot = await get(rpeRef);
      
                if (rpeSnapshot.exists()) {
                  const rpeData = rpeSnapshot.val();
                  player.rpe = rpeData || null;
      
                  // Add functionality to flag players with RPE less than a threshold
                  const  flagRpeThreshold= maxACWRThreshold; 
      
                  if (player.rpe !== null && player.rpe > flagRpeThreshold) {
                    player.flagged = true; // You can customize the flagging mechanism based on your needs
                  } else {
                    player.flagged = false;
                  }
                }
              } catch (error) {
                console.error('Error fetching RPE data:', error);
              }
      
              return player;
            })
          );
      
          setPlayers(playersArray);
        } else {
          console.log('No players found for this club.');
        }
      });
    } else {
      console.log('No clubs found for this user.');
    }
  });
}, []);

return (
  <ScrollView contentContainerStyle={{flexGrow: 1, ...styles.container}}>
    <Image
      source={require('../assets/sports-logo.png')}
      style={styles.logo}
    />
    <Text style={styles.text}>TEAM PLAYERS</Text>

    {players.map((player) => (
      <TouchableOpacity
        key={player.id}
        style={[
          styles.clubContainer,
          player.flagged && { backgroundColor: 'red' },
        ]}
        onPress={() => getPlayerInfo(player.uid)}
      >
        <Text style={styles.playerNameButton}>
          {player.name + " " + player.surname}
          
        </Text>
      </TouchableOpacity>
    ))}

    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPlayer}
      >
        <Text style={styles.addButtonLabel}>
          + Add PLAYER
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.setButton}
        onPress={handlelimits}
      >
        <Text style={styles.addButtonLabel}>
          Set Team Constraints
        </Text>
      </TouchableOpacity>
    </View>
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
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        width: '90%', // Remove fixed width
        alignItems: 'center',
      },
      
      clubName: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        fontFamily: 'Roboto',
      },
      addButton: {
        margin: 10,
        backgroundColor: '#2e64e5',
        padding: 15,
        borderRadius: 10,
        width: '48%',
      },
      setButton: {
        margin: 10,
        backgroundColor: '#2e64e5',
        padding: 15,
        borderRadius: 10,
        width: '48%',
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
      playerNameButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        padding: 10, // Add padding
      },
      
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10, // Add vertical padding
        width: '100%',
      },
      
});

export default ClubProfile;
