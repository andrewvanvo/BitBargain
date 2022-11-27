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



export const DashboardHeader = ({ user, UID, setUser }) => {

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false)
  const [rank, setRank] = useState('Bronze')
  const [fill, setFill] = useState(0)
  
  const DATA = [ 
  { 
    id: '1',
    number: user['numSubmission'],
    postType: 'Submissions',
    imageURL: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/graphics-cards/geforce-ada-4090-web-og-1200x630@2x.jpg'
  },
  {
    id: '2',
    number: user['numUpdate'],
    postType: 'Updates',
    imageURL: 'https://www.trustedreviews.com/wp-content/uploads/sites/54/2021/03/Intel-Rocker-Lake-2-e1615908186584.jpg'
  },
  {
    id: '3',
    number: user['numReview'],
    postType: 'Reviews',
    imageURL: 'https://www.pcworld.com/wp-content/uploads/2022/02/pc-cases-cooling-versus.jpg?quality=50&strip=all'
  }
]

useEffect(()=>{
  checkRank(user['progressLevel'])
}, [user])

  const checkRank = (progressLevel) => {
    if (progressLevel >= 0 && progressLevel <= 200){
      setRank('Bronze')
      setFill(progressLevel/200 * 100)
      
    }
    else if (progressLevel >= 201 && progressLevel <= 400){
      setRank('Silver')
      setFill((progressLevel -200)/200 * 100)

    }
    else if (progressLevel >= 401 && progressLevel <= 800){
      setRank('Gold')
      setFill((progressLevel - 400)/400 * 100)

    }
    else if (progressLevel >= 801 && progressLevel <= 1200){
      setRank('Platinum')
      setFill((progressLevel - 800)/400 * 100)
    }
    else if (progressLevel >= 1201 && progressLevel <= 1600){
      setRank('Diamond')
      setFill((progressLevel - 1200)/400 * 100)
    }
    else if (progressLevel >= 1601 && progressLevel <= 2000){
      setRank('Master')
      setFill((progressLevel - 1600)/400 * 100)
    }
    else if (progressLevel >= 2001 && progressLevel <= 2400){
      setRank('Grand Master')
      setFill((progressLevel - 2000)/400 * 100)
    }
  }

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
    const filename = 'profile/' + UID;
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
    await updateDoc(doc(db, 'users', UID),{
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
            fill={fill}
            tintColor="orange"
            onAnimationComplete={() =>{

            }}
            backgroundColor="#3d5875">
              {
                (fill) => (
                  <View style={{alignItems:'center'}}>
                    <Text style={{fontSize: 11, color: 'white'}}>
                    Rank: {rank} 
                    </Text>
                    <Text style={{fontSize: 11, color: 'white'}}>
                      EXP: {user['progressLevel']}
                    </Text>
                  </View>
                  
                )
              }
          </AnimatedCircularProgress>
        </View>
        <View style={{ 
          flex: 1, 
          margin: 10, 
          padding: 5,
          justifyContent: 'center', alignItems: 'center'
          
          }}>
  
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
