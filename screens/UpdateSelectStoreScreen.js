
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform, Text, View, StyleSheet, FlatList, Button, Pressable } from 'react-native';

import * as Location from 'expo-location';


class List extends React.Component {
  constructor(props) {
      super(props);
      this.item = props.item;
      this.navigation = props.navigation; //nav prop accesible from parent screen
      //this.dbProducts = props.savedProducts //product collection snapshot passed down
  }
  render() {
      //console.log(this.item)
      return (
          <Pressable style={styles.listTile}
            onPress={()=>this.navigateToUpdatePrice(this.item)}
          >
              <Text style={styles.storeName}>{this.item.name}</Text>
              <Text style={styles.storeAddress}>{this.item.vicinity}</Text>
          </Pressable>
      );
  }

  //on press
  navigateToUpdatePrice = async(item)=>{
    try {
       console.log(this.item)
        
      //await AsyncStorage.setItem('@storage_Key');
        
    } catch (error){
      console.log(error);
    }
    this.navigation.navigate('ViewStoreItems')
  };
}


const UpdateSelectStoreScreen = ({navigation}) => {
  //public gmaps api key and variables
  let api_key = 'AIzaSyApOw3rA0vexD0o73xlDZN8OoxIFgefUdY'
  let radius = '50000' //radius in m
  let type = 'electronic_store' //https://developers.google.com/maps/documentation/places/web-service/supported_types

  const storeList = ['Micro Center', 'Walmart', 'Target', "Gamestop", 'The Source',
   'Memory Express', 'Canada Computers & Electronics', 'Best Buy', 'Staples', 'Computer Elite']

   //initial placeholder location on load
  let lat = '44.5666670'
  let long = '-123.2833330'

  const [location, setLocation] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true)
  const [isFilter, setFilter] = useState([])

  useEffect(()=>{
    //let runHook = true
    const fetchLocation = async ()=>{
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      let location = await Location.getCurrentPositionAsync({});
      //if(runHook){
        setLocation(location);
      //}
    }
    fetchLocation()
    //return () => runHook = false
  }, [])

  //location data populated from api
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
    //if(data !== []){
      setLoading(false)
    //}
  }, [location]);
  
  //useEffect(()=>{
  //  var filteredList = []
  //  const filterList = () =>{
  //    if(data.length !== 0){
  //      const sliced = data['results'].slice(0,9)
  //      sliced.forEach((element)=>{
  //        if(storeList.includes(element.name)){
  //          filteredList.push(element)
  //          //console.log(element)
  //        }
  //      }) 
  //    }
  //  }
  //  if (data !== []){
  //    filterList()
  //    setFilter(filteredList)
  //    console.log('setFilter')
  //  }  
  //}, [data])
  

  const renderList = ({ item }) => {
    return (
        
        <List 
            item={item}
            navigation = {navigation} //pull navigation prop from parent screen and pass as prop
            //dbProducts ={savedProducts}
        />
    );
  };
  return (

    <View style={styles.mainContainer}>

        {isLoading? 
          <View style={styles.textContainer}>
            <Text>LOADING</Text>
          </View>
          :
          <View style={styles.listContainer}>
            <FlatList
                data={data['results']}
                //data ={isFilter}
                //extraData = {savedProducts}
                renderItem={renderList}
                //keyExtractor={item => item.list_name} //listname must be unique, ensure it is when saving li
            />
          </View>
          }
      </View>
  );
}

export default UpdateSelectStoreScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContainer: {
    backgroundColor: 'orange',
    flex: 1,
    
  },
  listTile: {

      backgroundColor: 'white',
      width: 350,
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch'
  },
  textContainer:{
    backgroundColor: 'orange',
    flex: 1,
  },
  storeName:{
    textAlign: 'left'
  },

  storeAddress:{
    textAlign: 'right'
  }
}); 