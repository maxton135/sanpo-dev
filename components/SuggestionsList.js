import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import {
  createSuggestionsList,
  filterByDistance,
  filterByCircularity,
} from "../algorithms/createSuggestions";

export default function SuggestionsList({currentLocation, places, stores, inputs}) {

  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  const getSuggestions = () => {
    setIsLoading(true);
    // generate all possible paths that come in input order
    const allSuggestions = createSuggestionsList(
      places,
      stores,
      inputs.orderedStops,
      inputs.orderedStopTypes,
      currentLocation
    );

    // delete all paths in APP (all possible paths) that exceed threshold and sort
    const suggestionsFilteredByDistance = filterByDistance(
      allSuggestions,
      inputs.threshold,
      inputs.desiredDistance
    );

    // pass modified array through rankByCircularity function if true
    const suggestionsFilteredByCircularity = filterByCircularity(
      suggestionsFilteredByDistance,
      currentLocation
    );

    setSuggestions(suggestionsFilteredByCircularity.slice(0, 5));
    setIsLoading(false);
  };

  useEffect(() => {
    getSuggestions();
  }, []);

  return (
    <View style={styles.container}>
      <Text>SuggestionsList</Text>
      {isLoading ? (
        <Text>Loading SuggetionsList</Text>
      ) : suggestions ? (
        suggestions.map((suggestion, index) => (
          <TouchableOpacity
          key={index}
          onPress={() => {
            // navigation.navigate("Display", {
            //   suggestions: suggestions,
            //   selected: index,
            //   currentLocation: currentLocation,
            // });
            console.log(suggestion);
          }}
        >
          <Text>{"Suggestion " + index}</Text>
          <Text>{suggestion.totalDistance}</Text>
          <View>
            {suggestion.places.map((place, placeIndex) => (
              <Text key={placeIndex}>{place.name}</Text>
            ))}
          </View>
        </TouchableOpacity>
        ))
      ) : (
        <Text>Error Loading SuggestionsList</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
