import React, {createContext, useEffect, useState} from "react";
import { auth, db, } from "../firebase/";
import {getAdditionalUserInfo, signOut, onAuthStateChanged,} from "firebase/auth";
import { collection, getDoc, doc, orderBy, where, limit, query, startAt, onSnapshot, getDocs, QuerySnapshot, startAfter } from "firebase/firestore";



export const UserContext = createContext();

const UserContextProvider = (props) => {
 const [loading, setLoading] = useState(true);
 const [user, setUser] = useState();
 const [userObj, setUserObj] = useState();

 useEffect( () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          const getUser = async () => {
            const userCollection = doc(db, "users", uid);
            const userSnapshot = await getDoc(userCollection);
            setUser(userSnapshot.data());
            setUserObj(user)
            setLoading(false)
          };
          getUser();
        } else {
          setUser({});
        }
      });
      return unsubscribe
    },[loading])
 
 return(
    <UserContext.Provider value={{user, loading, setUser, userObj}}>
        {props.children}
    </UserContext.Provider>
 )   
}

export default UserContextProvider