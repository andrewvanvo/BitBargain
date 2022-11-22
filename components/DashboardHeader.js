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
  Platform,
  ImageBackground,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, } from "firebase/storage";
import { auth, db, } from "../firebase/";
import { collection, getDoc, updateDoc, doc, orderBy, where, limit, query, startAt, onSnapshot, getDocs, QuerySnapshot, startAfter, setDoc } from "firebase/firestore";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { HorizontalCarousel } from "./DashboardCarousel";

const DATA = [ //TODO 
  { 
    id: '1',
    number: 2,
  },
  {
    id: '2',
    number: 4
  },
  {
    id: '3',
    number: 20
  }
]

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
            <Text style={{ fontSize: 22, color: "white" }}> {user['fname']} </Text>
          </View>
          <View style={{overflow: 'hidden', width: 40, height: 40, borderRadius: 20, marginRight: 15}}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{uri: user['profileImage']}}
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
          <AnimatedCircularProgress
            size={150} 
            width={15}
            fill={70}
            tintColor="orange"
            onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="#3d5875">
              {
                (fill) => (
                  // <Image
                  //       source={require("../assets/Untitled.png")}
                  //       resizeMode="cover"
                  //       style={{
                  //         height: 100, 
                  //         width: 100}}
                  // ></Image>
                  <Text style={{color: 'white'}}>
                    Rank: {user['rank']}
                  </Text>
                )
              }
          </AnimatedCircularProgress>
        </View>
        <View style={{ 
          flex: 1, 
          margin: 10, 
          // backgroundColor: 'white',
          padding: 5,
          justifyContent: 'center', alignItems: 'center'
          
          }}>
          {/* <Text style={{fontSize: 80}}>22</Text>
          <Text style={{fontSize: 20}}>Submissions</Text> */}
          
          <HorizontalCarousel w={200} h={200} data={DATA}></HorizontalCarousel>

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
