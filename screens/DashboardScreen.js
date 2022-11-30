import { Text, Button, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect, useContext } from "react";
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
  const [dataSource, setDataSource] = useState([]);
  const [refresh, setRefresh] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);


  useEffect( () => {
    const unsubscribe = onAuthStateChanged(auth, user => {
        if(!user) {
          navigation.navigate('Login');
        } else {
          setIsLoading(false);
        }
      })
    // when leaving the Login screen to Dashboard, the listener will stop
      return unsubscribe;
    }, [])

  const {userProfile, setUserProfile, loading, setLoading, UID} = useContext(UserContext)

  useEffect(() => {
      const key = 'uid';
      const storeUser = async(key, value) => {
        await SecureStore.setItemAsync(key, value)
      }
      storeUser(key, JSON.stringify(UID))
    }, []);
 
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
  
  if(isLoading) {
    return <View style={{}}><Image source={require("../assets/BitBargain-logo.png")} resizeMode='center'></Image></View>
    // return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Loading...</Text></View>
  }

  return (
    <View style={styles.mainContainer}>
      <DashboardHeader user={userProfile} UID={UID} setUser={setUserProfile} />
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
