/* Player profile that has the following
Name
Age
Sport
Speciality
Weight (kgs)
Height (m)
BMI (Body Mass Index) - divide your weight by your height
*/

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const PLayer_Profile = () => {
  const [rating, setRating] = useState(0); // State to store the selected rating

  // Function to handle rating selection
  const handleRatingPress = (selectedRating) => {
    setRating(selectedRating);
  };

  // Function to render rating options
  const renderRatingOptions = () => {
    const maxRating = 5; // You can adjust this based on your scale
    const ratingOptions = [];

    for (let i = 1; i <= maxRating; i++) {
      const isSelected = i <= rating;

      ratingOptions.push(
        <TouchableWithoutFeedback
          key={i}
          onPress={() => handleRatingPress(i)}
        >
          <View
            style={[
              styles.ratingOption,
              isSelected ? styles.selectedRatingOption : null,
            ]}
          >
            <View
              style={[
                styles.circle,
                isSelected ? styles.selectedCircle : null,
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return ratingOptions;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rate this:</Text>
      <View style={styles.ratingContainer}>{renderRatingOptions()}</View>
      <Text style={styles.selectedRatingText}>
        Selected Rating: {rating}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  ratingOption: {
    margin: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: 'gray',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRatingOption: {
    borderColor: 'gold',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 2,
  },
  selectedCircle: {
    borderColor: 'gold',
  },
  selectedRatingText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default PLayer_Profile;
