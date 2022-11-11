import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity, FlatList,} from "react-native";
import { auth, db } from "../firebase/";
import {
  getAdditionalUserInfo,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDoc, doc, where, query } from "firebase/firestore";

import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const DATA = [
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    store_name: 'Best Buy'
  },
  {
    id: "2",
    store_name: "Microcenter"
  },
]


const StoreCard = ({store_name}) => (
  <SafeAreaView>
    <View style={styles.item}>
      <View style={{width: 100, height: 100, borderWidth: 1}}></View>
      <Text>{store_name}</Text>
    </View>
  </SafeAreaView>
  
)

const UpdateScreen = ({}) => {
  
    useEffect(() => {
         
    });

    const renderItem = ({ item }) => ( 
      <StoreCard store_name={item.store_name} />
    );

  return (
    <View style={styles.mainContainer}>
        <View style={{}}>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            >
            </FlatList>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="add" size={20} />
            </TouchableOpacity>
        </View>
        
    </View>
  
)};

export default UpdateScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "steelblue",
    
  },
  addButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'orange'
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',   
  },
});
