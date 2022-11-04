
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform, Text, View, StyleSheet, FlatList } from 'react-native';

import * as Location from 'expo-location';

const UpdateSelectStoreScreen = ({navigation}) => {
  //public gmaps api key and variables
  let api_key = 'AIzaSyApOw3rA0vexD0o73xlDZN8OoxIFgefUdY'
  let radius = '25000' //radius in m
  let type = 'electronic_store' //https://developers.google.com/maps/documentation/places/web-service/supported_types

  //expo location module
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  //google maps places api
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  //get expo location details
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false)
    })();
  }, []);

  let lat;
  let long;
  if (errorMsg) {
    console.log(error)
  } else if (location) {
    lat = location['coords']['latitude']
    long = location['coords']['longitude']
  }

  //gmaps places api call
  //useEffect(() => {
  //  fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}${long}&radius=${radius}&type=${type}&keyword=computer&key=${api_key}`)
  //    .then((response) => response.json())
  //    .then((json) => setData(json))
  //    .catch((error) => console.error(error))
  //    .finally(() => setLoading(false));
  //}, []);

  return (

    <View style={styles.container}>
      {isLoading ? <Text>Getting Location</Text> : 
      ( <View >
          <Text> {lat} {long}</Text>
        </View>
      )}
    </View>
  );
}

export default UpdateSelectStoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 