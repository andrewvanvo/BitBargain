import { StatusBar } from "expo-status-bar";
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
} from "react-native";

export const DashboardHeader = ({ user }) => {
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
            <Image
              source={require("../assets/sample_images/profile-pic-sample.png")}
              resizeMode="cover"
              style={{
                width: 40,
                height: 40,
              }}
            ></Image>
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
