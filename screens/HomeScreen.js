import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Location from 'expo-location';

import RouteSuggestions from '../components/RouteSuggestions';

export default function HomeScreen() {
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);

  // First fetch current location
  useEffect(() => {
    setLoadingCurrentLocation(true);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
          description: "Current Location",
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        });
      console.log("Current Location: ", currentLocation);
    })();
    setLoadingCurrentLocation(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Homescreen</Text>
      {loadingCurrentLocation ? (
        <Text>Loading Current Location</Text>
      ) : currentLocation ? (
        <RouteSuggestions
          currentLocation={currentLocation}
        />
      ) : (
        <Text>An Error Has Occurred</Text>
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
