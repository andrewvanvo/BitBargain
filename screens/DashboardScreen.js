import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import { auth, db } from "../firebase/";
import {
  getAdditionalUserInfo,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDoc, doc, orderBy, where, limit, query, startAt, onSnapshot, getDocs, QuerySnapshot, startAfter } from "firebase/firestore";

import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardFeed } from "../components/DashboardFeed";

const DashboardScreen = ({navigation}) => {
  const [user, setUser] = useState({ fname: "Unknown", rank: "Unknown" });
  const [dataSource, setDataSource] = useState([]);
  const [lastDocument, setLastDocument] = useState(null);
  const [refresh, setRefresh] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const getUser = async () => {
          const userCollection = doc(db, "Users", uid);
          const userSnapshot = await getDoc(userCollection);
          setUser(userSnapshot.data());
        };
        getUser();
      } else {
        setUser({});
      }
    });
    return unsubscribe;
  }, []);


  const getData = async () => {
    try {
      const first = query(collection(db, 'system_activity'), orderBy('key'), limit(3));
      const documentSnapshots = await getDocs(first)
      let documentData = documentSnapshots.docs.map(document => document.data());
      setLastDocument(documentSnapshots.docs[documentSnapshots.docs.length-1])
      setDataSource(documentData.reverse())
    }
    catch (error) {
      console.log(error);
    }
  };
 

  const getMore = async () => {
    try {
      if (lastDocument != null) {
        console.log('Trying to retrieve more data!')
        const next = query(collection(db, 'system_activity'), orderBy('key'), startAfter(lastDocument), limit(3))
        const documentSnapshots = await getDocs(next)
        let documentData = documentSnapshots.docs.map(document => document.data());
        setLastDocument(documentSnapshots.docs[documentSnapshots.docs.length-1])
        setDataSource([...documentData.reverse(), ...dataSource, ])
        console.log('Success!')

      }
      else{
        console.log('There is no more data!')
      }
    }
    catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getData();
  }, [])
  
  return (
    <View style={styles.mainContainer}>
      <DashboardHeader user={user} />
      <DashboardFeed dataSource={dataSource} refresh={refresh} onRefresh={getMore} />
      
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
