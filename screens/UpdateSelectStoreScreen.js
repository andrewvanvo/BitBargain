
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform, Text, View, StyleSheet, FlatList, Button } from 'react-native';

import * as Location from 'expo-location';

const UpdateSelectStoreScreen = ({navigation}) => {
  //public gmaps api key and variables
  let api_key = 'AIzaSyApOw3rA0vexD0o73xlDZN8OoxIFgefUdY'
  let radius = '15000' //radius in m
  let type = 'electronic_store' //https://developers.google.com/maps/documentation/places/web-service/supported_types


  const [location, setLocation] = useState(null);
  const [data, setData] = useState([]);

  useEffect(()=>{
    let runHook = true
    const fetchLocation = async ()=>{
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      let location = await Location.getCurrentPositionAsync({});
      if(runHook){
        setLocation(location);
      }
    }
    fetchLocation()
    return () => runHook = false
  }, [])

  let lat = '44.5666670'
  let long = '-123.2833330'
  if (location){
    lat = location['coords']['latitude']
    long = location['coords']['longitude']
  }
  
  //gmaps api
  useEffect(() => {
    async function fetchGoogle(){
      await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&type=${type}&keyword=computer&key=${api_key}`)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
    }
    fetchGoogle();
    //console.log(data)
    data['results'].forEach(element => {
      console.log(element.name)
    });

    }, [location]);
  
  return (

    <View style={styles.container}>
      
      <View >
        <Text> {lat} </Text>
        <Text></Text>
      </View>
      
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