import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { auth, db } from "../firebase/";
import {
  getAdditionalUserInfo,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDoc, doc, where, query } from "firebase/firestore";


const UpdateScreen = ({}) => {

    const [search, setSearch] = useState('');

    useEffect(() => {
         
    });

  return (
    <View style={styles.mainContainer}>
        <View>
            
        </View>
        
    </View>
  
)};

export default UpdateScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "steelblue",
  },
});
