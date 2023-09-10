import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from "react";
import { UseFetchPlacesData } from "../components/hooks/getPlacesQuery";
import { UseFetchYelpData } from "../components/hooks/getYelpDataQuery";

import SuggestionsList from './SuggestionsList';

export default function RouteSuggestions({currentLocation}) {

  // User inputs below
  const [desiredDistance, setDesiredDistance] = useState(4);
  const [orderedStops, setOrderedStops] = useState("WFW");
  const [orderedStopTypes, setOrderedStopTypes] = useState([
    "park",
    "cafe",
    "lake",
  ]);
  const [threshold, setThreshold] = useState(0.5);

  // Store Google Places API Data
  const places = UseFetchPlacesData(currentLocation.location.lat, currentLocation.location.lng);
  const placesData = places.data;
  const isPlacesLoading = places.isLoading;

  // Store Yelp Fusion API Data
  const stores = UseFetchYelpData(currentLocation.location.lat, currentLocation.location.lng);
  const storesData = stores.data;
  const isStoresLoading = stores.isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <Text>RouteSuggestions</Text>
      {isPlacesLoading || isStoresLoading ? (
        <Text>Loading Data</Text>
      ) : placesData && storesData ? (
        <SuggestionsList
          currentLocation = {currentLocation}
          places = {placesData}
          stores = {storesData}
          inputs = {{
            desiredDistance: desiredDistance,
            orderedStops: orderedStops,
            orderedStopTypes: orderedStopTypes,
            threshold: threshold
          }}
        />
      ) : (
        <Text>Error Fetching API Data</Text>
      )}
    </SafeAreaView>
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
