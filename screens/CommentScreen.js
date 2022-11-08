import React from "react";
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

const CommentScreen = ({ route, navigation }) => {
  const { item, user } = route.params;

  const navigateBack = () => {
    navigation.navigate("Home");
  };

  const submitComment = () => {
    console.log("submit click");
  };

  const onSubmit = () => {
    console.log("text has been submitted");
  };
  return (
    <Formik
      initialValues={{
        // id: "",
        imageURL: user.imageURL,
        // key: "",
        // postCreated: "",
        postDescription: "",
        // postType: "",
        // username: "",
      }} /* ID = UID */
      onSubmit={(values) => {            // need to set certain attributes specifically (type, user, etc)
        console.log(values)             // need to find a way to get post created date
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
          <View style={styles.item}>
            <View
              style={{
                width: 50,
                height: 50,
                overflow: "hidden",
                borderWidth: 2,
                borderRadius: 25,
              }}
            >
              <Image
                source={{ uri: item.imageURL }}
                resizeMode="cover"
                style={{
                  width: 50,
                  height: 50,
                }}
              ></Image>
            </View>
            <View style={{ flexDirection: "column", marginLeft: 15 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text style={styles.title}>{item.username}</Text>
                <Text style={{ fontSize: 12, marginTop: 3 }}>
                  {" "}
                  posted a {item.postType}! - {item.postCreated}
                </Text>
              </View>
              <View style={{ flexDirection: "row", height: 70, width: 250 }}>
                <Text
                  style={{
                    flex: 1,
                    flexWrap: "wrap",
                    fontSize: 11,
                    marginTop: 5,
                  }}
                >
                  {/* {item.postDescription}  */}
                  {/* 30 word count? */}
                  orci sagittis eu volutpat odio facilisis mauris sit amet massa
                  vitae tortor condimentum lacinia quis vel eros donec ac odio
                  tempor orci dapibus ultrices in iaculis nunc sed augue lacus
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginLeft: 5 }}>
            <View>
              <Text style={{ fontSize: 11, color: "white", marginLeft: 5 }}>
                Replying to {item.username}
              </Text>
            </View>
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
                  source={{ uri: user.imageURL }}
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
                placeholder="Comment your reply"
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
