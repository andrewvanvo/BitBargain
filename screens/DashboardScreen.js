import React, { useState, useEffect, useContext } from "react";
import { Text, Button, StyleSheet, View, TouchableOpacity } from "react-native";
import { auth, db, } from "../firebase/";

import {
  getAdditionalUserInfo,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDoc, doc, orderBy, where, limit, query, startAt, onSnapshot, getDocs, QuerySnapshot, startAfter } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { DashboardHeader } from "../components/DashboardHeader";
import * as SecureStore from 'expo-secure-store';
import { DashboardFeed } from "../components/DashboardFeed";
import Icon from "react-native-vector-icons/Ionicons";
import { UserContext } from '../contexts/UserContext';

const DashboardScreen = ({navigation}) => {
  // const [user, setUser] = useState({ fname: "Unknown", rank: "Unknown" });
  // const [userObj, setUserObj] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [lastDocument, setLastDocument] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const {user, loading, setUser, userObj} = useContext(UserContext)
  const [userProfile, setUserProfile] = useState('test');
  const [userData, setUserData] = useState('test');

  useEffect(() => {
    if(!loading){
      const key = 'uid';
      const storeUser = async(key, value) => {
        await SecureStore.setItemAsync(key, value)
      }
      setUserProfile(user)
      setUserData(userObj)
      storeUser(key, userObj['uid'])
    }
  }, [loading, user]);
 
  const getData = async () => {
    try {
      
      var d = new Date();
      d.setDate(d.getDate() - 1)
      const dayRange = Timestamp.fromDate(d)

      const first = query(collection(db, 'system_activity'), where('postCreated', '>', dayRange ), orderBy('postCreated') ); //orderBy('postCreated)
      const unsubscribe = onSnapshot(first, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push(doc.data())
        })
      setDataSource(posts.reverse())
      })
      return unsubscribe;

      
    }
    catch (error) {
      console.log(error);
    }
  };
 
  useEffect(() => {
    getData();
  }, [])
  
  
  return (
    <View style={styles.mainContainer}>
      {/* <Text> {user['lname']} </Text> */}
      {/* <Text> {user.fname}</Text> */}
      <DashboardHeader user={userProfile} userObj={userData} setUser={setUser} />
      <DashboardFeed user={userProfile} dataSource={dataSource} refresh={refresh} onRefresh={getData} />    
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: "column",
  },
});
