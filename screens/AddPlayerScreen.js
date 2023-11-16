import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, FlatList } from 'react-native';
import { getDatabase, ref, get, query, orderByChild, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


const AddPlayerScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allAthletes, setAllAthletes] = useState([]);
  const [user, setUser] = useState(null);


  const route = useRoute();

  // Define the db variable
  const db = getDatabase();

  const handleAddPlayerToClub = (selectedPlayer) => {
    // Ensure the user is authenticated
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Get the club ID from the route or wherever it is available
    const clubId = route.params.clubId; // Adjust this based on your routing mechanism

    // Reference to the "Management/clubs/club_players" path
    const clubPlayersRef = ref(db, `Managements/${user.uid}/clubs/${clubId}/club_players`);
    const newPlayerRef = push(clubPlayersRef);

    //const selectedPlayerUserId = selectedPlayer.uid;


    const surveyPath = `Athletes/${selectedPlayer.id}/SurveyData/mentalhealthscale`;

    // Assuming Firebase reference and retrieval operations
    const mentalHealthRef = ref(db, surveyPath);
    console.log('Survey Path:', surveyPath); // Log the constructed path


    

    // async function fetchData() {
    //   try {
    //     const snapshot = await get(mentalHealthRef);
    //     if (snapshot.exists()) {
    //       const mentalHealthData = snapshot.val();
    //       console.log('Mental health data:', mentalHealthData);
    //       return mentalHealthData;
    //     } else {
    //       console.log('Mental health data not found');
    //       return null;
    //     }
    //   } catch (error) {
    //     console.error('Error fetching mental health data:', error);
    //     return null;
    //   }
    // }
    
    // // Usage:
    // fetchData().then((data) => {
    //   console.log('Fetched data:', data); // Use data here
    // });

    
  //  console.log("mentally " , Data);



    // Define the data you want to save (you may need to adjust this based on your player data structure)
    const playerData = {
      name: selectedPlayer.name,
      surname: selectedPlayer.surname,
      //status: fetchData().then(data),
    };

    // Use the set method to add the player to the club_players path
    set(newPlayerRef, playerData)
      .then(() => {
        console.log(`Player ${selectedPlayer.name} added to club.`);
        alert(`Player ${selectedPlayer.name} added to club.`);
        const allPlayersRef = ref(db, `Managements/${user.uid}/clubs/${clubId}/club_players/AllPlayers`); // Adjust the path as needed
      
        // set(allPlayersRef, { [selectedPlayer.id]: playerData });
        // navigation.navigate('ClubProfile');
      })
      .catch((error) => {
        console.error('Error adding player to club:', error);
      });
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Fetch all athletes initially
    const athletesRef = ref(db, 'Athletes');

    get(athletesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const athletes = [];
          snapshot.forEach((childSnapshot) => {
            athletes.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            });
          });
          setAllAthletes(athletes);
        }
      })
      .catch((error) => {
        console.error('Error fetching athletes:', error);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSearch = () => {
    // Filter athletes based on the search query
    const filteredAthletes = allAthletes.filter((athlete) =>
      athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredAthletes);
  };

  const renderItem = ({ item }) => (
    <View style={styles.athleteItem}>
      <Text style={styles.athleteName}>{item.name}</Text>
      <Button
        title="Add to Club"
        onPress={() => handleAddPlayerToClub(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for an athlete"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <Button title="Search" onPress={handleSearch} />

      <FlatList
        data={searchResults.length > 0 ? searchResults : allAthletes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  athleteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  athleteName: {
    fontSize: 16,
  },
});

export default AddPlayerScreen;
