import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, FlatList } from 'react-native';
import { getDatabase, ref, get, query, orderByChild, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useRoute } from '@react-navigation/native';

const AddPlayerScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allAthletes, setAllAthletes] = useState([]);
  const [user, setUser] = useState(null);
  const route = useRoute(); // Get the route object

  // Define the db variable
  const db = getDatabase();

  const handleAddPlayerToClub = (selectedPlayer) => {
    // Get the club ID from the route or wherever it is available
    const clubId = route.params.clubId; // Adjust this based on your routing mechanism

    // Reference to the "Management/clubs/club_players" path
    const clubPlayersRef = ref(db, `Management/clubs/${clubId}/club_players`);

    // Define the data you want to save (you may need to adjust this based on your player data structure)
    const playerData = {
      name: selectedPlayer.name,
      // Add other player data fields as needed
    };

    // Use the set method to add the player to the club_players path
    set(clubPlayersRef, playerData)
      .then(() => {
        console.log(`Player ${selectedPlayer.name} added to club.`);
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
