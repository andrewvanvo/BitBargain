import React, { useState, useEffect } from "react";
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

import { DashboardFeed } from "../components/DashboardFeed";

import Icon from "react-native-vector-icons/Ionicons";

const DashboardScreen = ({navigation}) => {
  const [user, setUser] = useState({ fname: "Unknown", rank: "Unknown" });
  const [userObj, setUserObj] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [lastDocument, setLastDocument] = useState(null);
  const [refresh, setRefresh] = useState(false);
  


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
      // setLastDocument(documentSnapshots.docs[documentSnapshots.docs.length-1])
      setDataSource(posts.reverse())
      })
      return unsubscribe;
      // const documentSnapshots = await getDocs(first)
      // let documentData = documentSnapshots.docs.map(document => document.data());

      
    }
    catch (error) {
      console.log(error);
    }
  };
  // const getMore = async () => {
  //   try {
  //     if (lastDocument != null) {
  //       console.log('Trying to retrieve more data!')
  //       const next = query(collection(db, 'system_activity'), startAfter(lastDocument), limit(3)) //orderBy('postCreated)
  //       const documentSnapshots = await getDocs(next)
  //       let documentData = documentSnapshots.docs.map(document => document.data());
  //       setLastDocument(documentSnapshots.docs[documentSnapshots.docs.length-1])
  //       setDataSource([...documentData.reverse(), ...dataSource, ])
  //       console.log('Success!')

  //     }
  //     else{
  //       console.log('There is no more data!')
  //     }
  //   }
  //   catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        var key = 'uid';
        const getUser = async () => {
          const userCollection = doc(db, "users", uid);
          const userSnapshot = await getDoc(userCollection);
          setUser(userSnapshot.data());
          setUserObj(user)

        };
        //key/value
        const storeUser = async (key, value)=>{
          await SecureStore.setItemAsync(key, value)
        }

        getUser();

      } else {
        setUser({});
      }
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    getData();
  }, [])
  
  
  return (
    <View style={styles.mainContainer}>
      <DashboardHeader user={user} userObj={userObj} setUser={setUser}/>
      <DashboardFeed user={user} dataSource={dataSource} refresh={refresh} onRefresh={getData} />    
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  //https://reactnative.dev/docs/colors for named color palette

  //TOP LEVEL CONTAINER
  mainContainer: {
    flex: 1,
    flexDirection: "column",
  },
});
