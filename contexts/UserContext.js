import React, {createContext, useEffect, useState} from "react";
import { auth, db, } from "../firebase/";
import {getAdditionalUserInfo, signOut, onAuthStateChanged,} from "firebase/auth";
import { collection, getDoc, doc, orderBy, where, limit, query, startAt, onSnapshot, getDocs, QuerySnapshot, startAfter } from "firebase/firestore";



export const UserContext = createContext();

const UserContextProvider = (props) => {
 const [loading, setLoading] = useState(true);
 const [userProfile, setUserProfile] = useState({"email": "", "fname": "", "": "", "numReviews": 0, "numSubmission": 0, "numUpdate": 0, "profileImage": "https://i.stack.imgur.com/l60Hf.png", "progressLevel": 0, "rank": ""});
 const [UID, setUID] = useState(null);

 useEffect( () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUID(user.uid)
          const getUser = async () => {
            const userCollection = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userCollection);
            return userSnapshot
          };
          getUser().then(response => {
              const userData = response.data()
              setUserProfile(userData)
          })
          .catch(error => {
            console.error(`Error! ${error}`)
          })

        } 
      });
      return unsubscribe
    },[loading])
 
 return(
    <UserContext.Provider value={{userProfile, setUserProfile, loading, setLoading, UID }}>
        {props.children}
    </UserContext.Provider>
 )   
}

export default UserContextProvider