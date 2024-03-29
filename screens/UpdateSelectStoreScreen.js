
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform, Text, View, StyleSheet, FlatList, Button, Pressable } from 'react-native';
import * as Location from 'expo-location';
import { collection, onSnapshot, addDoc, query, where, getDocs, setDoc, doc, Firestore, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


class List extends React.Component {
  constructor(props) {
      super(props);
      this.item = props.item;
      this.navigation = props.navigation; //nav prop accesible from parent screen
      this.dbStores = props.allStores
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
  navigateToUpdatePrice = async(item)=>{
    let storeExists = false
    try {
      const curGeometry = {'latitude':this.item['geometry']['location']['lat'], 'longitude':this.item['geometry']['location']['lng'] }
      let storeID = null
      const querySnapshot = await getDocs(collection(db, "stores"));
      querySnapshot.forEach((doc) => {
        if (curGeometry['latitude'] == doc.data()['location']['latitude']){
          if (curGeometry['longitude'] == doc.data()['location']['longitude']){
            storeExists = true
            storeID = doc.id
          }
        }
      });

      if (storeExists == false){
        const docRef = await addDoc(collection(db, "stores"), {
          location: curGeometry,
          store_address: this.item.vicinity,
          store_name : this.item.name
        })
        storeID = docRef.id
        const storeRef = doc(db, 'stores', storeID)
        updateDoc(storeRef, {
          store_id: storeID
        })

        const productSnapshot = await getDocs(collection(db, 'products'))
        productSnapshot.forEach((product)=>{
          let prodID = product.data().product_id
          const prodRef = doc(db, 'products', prodID)
          updateDoc(prodRef,{
            [`stores_carrying.${storeID}.on_sale`]: false,
            [`stores_carrying.${storeID}.prev_price`]: 0,
            [`stores_carrying.${storeID}.price`]: 0,
            [`stores_carrying.${storeID}.store_name`]: this.item.name
          })
        })      
      }

      this.navigation.navigate('ViewStoreItems', {store_id: storeID})

    } catch (error){
      console.log(error);
    }
  };
}


const UpdateSelectStoreScreen = ({navigation}) => {
  //public gmaps api key and variables
  let api_key = 'AIzaSyApOw3rA0vexD0o73xlDZN8OoxIFgefUdY'
  let radius = '50000' //radius in m
  let type = 'electronic_store' //https://developers.google.com/maps/documentation/places/web-service/supported_types

  const storeList = ['Micro Center', 'Walmart', 'Target', "Gamestop", 'The Source',
   'Memory Express', 'Canada Computers & Electronics', 'Best Buy', 'Staples', 'Computer Elite']


  const [location, setLocation] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true)
  const [allStores, setAllStores] = useState([]);
  //const [storeExists, setStoreExists] = useState(false)

  useEffect(()=>{
    let runHook = true
    const fetchLocation = async ()=>{
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      let location = await Location.getCurrentPositionAsync({});
      // let location = {coords: {"latitude": 37.3861, longitude: -122.0620}};
      if(runHook){
        setLocation(location);
      }
    }
    fetchLocation()
    return () => runHook = false
  }, [])
 
  useEffect(() => {
    async function fetchGoogle(){
      if (location){
        let lat = location['coords']['latitude']
        let long = location['coords']['longitude']
        await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&type=${type}&keyword=computer&key=${api_key}`)
        .then((response) => response.json())
        .then((json) => {
          let reducedList = {'results':[]}
          for (var i = 0; i < json['results'].length; i++){
            if (reducedList['results'].length === 10){break}
            else if (storeList.includes(json['results'][i]['name'])){
              reducedList['results'].push(json['results'][i])
            }
          }
          //console.log(reducedList)
          setData(reducedList)
        })
        .catch((error) => console.error(error))
      }
    }
    fetchGoogle();
    if(data !== []){
      setLoading(false)
    }
  }, [location]);

  useEffect(() => {
    if(data!==[]){
      const storeRef = collection(db, 'stores');
      const unsubscribe = onSnapshot(storeRef, (storeSnap) => {
        const stores = [];
        storeSnap.forEach((doc) => {
          stores.push(doc.data());
          //console.log(doc.data())
        });
        setAllStores(stores);
        });
    return () => unsubscribe();
    }  
  }, [data]);

  const renderList = ({ item }) => {
    return (
        
        <List 
            item={item}
            navigation = {navigation} //pull navigation prop from parent screen and pass as prop
            dbStores = {allStores}
            
        />
    );
  };
  return (

    <View style={styles.mainContainer}>
        <View>
          <View style ={styles.header}>
            <Text style={{fontSize: 24, color: 'white'}}>SELECT NEARBY STORE</Text>
          </View>
        </View>
        

        {isLoading? 

          <View style={styles.listContainer}>
            <Text>Loading...</Text>
          </View>
          :
          <View style={styles.listContainer}>
            <FlatList
                data={data['results']}
                renderItem={renderList}
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
    backgroundColor: 'steelblue'
  },

  header:{
    alighItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'steelblue',
    marginTop: 50,
    paddingBottom: 25
  },  

  listContainer: {
    backgroundColor: 'steelblue',
    flex: 1,
    
  },
  listTile: {

      backgroundColor: 'white',
      width: 350,
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      borderWidth: 2,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      borderColor: 'white'
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
