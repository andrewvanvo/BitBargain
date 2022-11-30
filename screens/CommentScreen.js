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
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Formik } from "formik";
import * as Yup from "yup";
import { auth, db } from "../firebase/";
import { collection, getDoc, doc, orderBy, where, limit, query, startAt, onSnapshot, getDocs, QuerySnapshot, startAfter, setDoc, Timestamp } from "firebase/firestore";

const CommentScreen = ({ route, navigation }) => {
  const { item, user } = route.params;

  const navigateBack = () => {
    navigation.navigate("Home");
  };

  const submitData = async (values) => {
    const newCommentRef = doc(collection(db, 'system_activity'))
    
    await setDoc(newCommentRef, {
      id: newCommentRef.id,
      imageURL: user.profileImage,
      postDescription: values.postDescription,
      postCreated: Timestamp.now(),
      postType: 'comment',
      username: user.fname + ' ' + user.lname
    })
  }
  
  return (
    <Formik
      initialValues={{
        // id:'',
        imageURL: user.imageURL,
        // key: "",
        // postCreated: "",
        postDescription: "",
        // postType: "comment",
        // username: user.fname + ' ' + user.lname,
      }} /* ID = UID */
      onSubmit={(values) => {
                    // need to set certain attributes specifically (type, user, etc)
        submitData(values);
        navigation.navigate('Home')
        console.log('comment submitted')
        
        
        // need to find a way to get post created date
      }}
    >
      {(props) => (
        <View
          style={{
            backgroundColor: "steelblue",
            flex: 1,
            flexDirection: "column",
            paddingTop: 40,
          }}
        >
          <View
            style={{
              marginLeft: 8,
              marginRight: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigateBack();
              }}
            >
              <Text style={{ fontSize: 15, color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{}}>
              <Text
                style={{ fontSize: 15, color: "white" }}
                onPress={props.handleSubmit}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
         
          <View style={{ marginLeft: 5 }}>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  overflow: "hidden",
                  borderWidth: 2,
                  borderRadius: 25,
                  borderColor: "white",
                }}
              >
                <Image
                  source={{ uri: user['profileImage'] }}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 40,
                  }}
                ></Image>
              </View>
              <TextInput
                style={{ flex: 1, marginLeft: 5, color: "white" }}
                autoFocus={true}
                placeholderTextColor="white"
                placeholder="Post your comment!"
                underlineColorAndroid="transparent"
                multiline={true}
                maxLength={180}
                onChangeText={props.handleChange('postDescription')}
                value={props.values.postDescription}
              ></TextInput>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    height: 130,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
  },
});
