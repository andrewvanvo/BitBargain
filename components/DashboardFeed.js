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
  StatusBar 
} from "react-native";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    username: "Ethan Lopez",
    postCreated: '4h',
    postType: "submission",
    postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. ",
    key: '1'
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    username: "Liz Anya",
    postCreated: '3h',
    postType: "comment",
    postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    key: '2'
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    username: "Jon Snow",
    postCreated: '2h',
    postType: "comment",
    postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    key: '3'
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d73",
    username: "Arya Stark",
    postCreated: '5h',
    postType: "submission",
    postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    key: '4'
  },
];

const Item = ({ username, type, postCreated, postDescription }) => (
    <View style={styles.item}>
        <View style={{width: 50, height: 50, borderWidth: 1, borderRadius: 25}}></View>
        <View style={{flexDirection: "column", marginLeft: 15,}}>
          <View style={{ flexDirection: "row", alignItems: 'flex-start'}}>
            <Text style={styles.title}>{username}</Text>
            <Text style={{fontSize: 12, marginTop: 3}}> posted a {type}! - {postCreated}</Text>
          </View>
          <View>
            <Text style={{fontSize: 10}}>
              {postDescription}
            </Text>
          </View>
        </View>  
    </View>
);

export const DashboardFeed = () => {
    
  const renderItem = ({ item }) => ( 
    <Item username={item.username} type={item.postType} postCreated={item.postCreated} postDescription={item.postDescription} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1.2,
      backgroundColor: '#6495ed',

    },
    item: {
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 20,
      height: 120,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 15
    },
    title: {
      fontSize: 15,      
    },
  });
