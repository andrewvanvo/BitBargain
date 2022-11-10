import { StatusBar } from "expo-status-bar";
import {React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, } from "firebase/storage";
import { auth, db, } from "../firebase/";
import { collection, getDoc, updateDoc, doc, orderBy, where, limit, query, startAt, onSnapshot, getDocs, QuerySnapshot, startAfter, setDoc } from "firebase/firestore";
import 'react-native-get-random-values';
import {v4 as uuidv4 } from 'uuid';

export const DashboardHeader = ({ user, userObj, setUser }) => {

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4,3],
    })

    handleImagePicked(result)

  };
  
  const handleImagePicked = async (result) => {
    try {
      setUploading(true)
      
      if (!result.cancelled){
        const uploadUrl = await uploadImageAsync(result.uri)

      }
    }
    catch (e) {
      console.log(e);
      alert("Upload failed...");
    }
    finally {
      setUploading(false)

    }
  };

  const uploadImageAsync = async (uri) => {
    const filename = 'profile/' + userObj.uid;
    const storage = getStorage();
    const storageRef = ref(storage, filename)
    const response = await fetch(uri);
    const blob = await response.blob();
    const uploadTask =  await uploadBytes(storageRef, blob).then(()=>{
      getDownloadURL(storageRef).then((url) => {
        submitImage(url)
      })
    })
  }

  const submitImage = async (url) => {
    await updateDoc(doc(db, 'users', userObj.uid),{
      profileImage: url
    })
    setUser({...user, profileImage: url})
  }


  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <View style={{ flex: 1, backgroundColor: "#ff8c00" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: 50,
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 16, color: "white", marginLeft: 5 }}>
              Welcome Back!
            </Text>
            <Text style={{ fontSize: 22, color: "white" }}> {user.fname} </Text>
          </View>
          <View style={{overflow: 'hidden', width: 40, height: 40, borderRadius: 20, marginRight: 15}}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{uri: user.profileImage}}
                resizeMode="cover"
                style={{
                  width: 40,
                  height: 40,
                }}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.headerContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
                source={require("../assets/sample_images/rank-unranked-img.png")}
                resizeMode="cover"
                style={{
                  width: 150,
                  height: 150,
                }}
              ></Image>
        </View>
        <View style={{ flex: 1, fontSize: 20, marginTop: 10, justifyContent:'center'}}>
          <Text style={{color: 'white'}}>Current Rank: {user.rank} </Text>
          <Text style={{color: 'white'}}>Upvotes: 200</Text>
          <Text style={{color: 'white'}}>Number of Submissions: 20 </Text>
          <Text style={{color: 'white'}}>Progress till next Rank: 20</Text>
        </View>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //https://reactnative.dev/docs/colors for named color palette

  headerContainer: {
    flex: 2,
    flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "flex-start",
    backgroundColor: "steelblue",
    // marginTop:
    // paddingHorizontal: `5%`,
  },
  infoContainerTextBox: {
    backgroundColor: "white",
    flexDirection: "column",
  },
});
