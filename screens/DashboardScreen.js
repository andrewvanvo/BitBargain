import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { auth, db } from "../firebase/";
import {
  getAdditionalUserInfo,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDoc, doc, where, query } from "firebase/firestore";


import { DashboardHeader } from '../components/DashboardHeader'
import { DashboardFeed } from "../components/DashboardFeed";

const DashboardScreen = ({}) => {
  const [user, setUser] = useState({ fname: "Unknown", rank: "Unknown" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const getUser = async () => {
          const userCollection = doc(db, "Users", uid);
          const userSnapshot = await getDoc(userCollection);
          setUser(userSnapshot.data());
          console.log("useEffect success");
        };
        getUser();
      } else {
        setUser({});
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.mainContainer}>
        <DashboardHeader user={user} />
        <DashboardFeed />
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
