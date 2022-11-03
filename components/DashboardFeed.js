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


// const DATA = [
//   {
//     id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//     username: "Ethan Lopez",
//     postCreated: '1h',
//     postType: "submission",
//     imageURL: "https://entertainment.time.com/wp-content/uploads/sites/3/2013/05/spiderman-1.jpg?w=720&h=480&crop=1",
//     postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. ",
//     key: '1'
//   },
//   {
//     id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
//     username: "Liz Anya",
//     postCreated: '3h',
//     postType: "comment",
//     imageURL: "https://i.imgur.com/5l28nXp.jpeg",
//     postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
//     key: '2'
//   },
//   {
//     id: "58694a0f-3da1-471f-bd96-145571e29d72",
//     username: "Jon Snow",
//     postCreated: '5h',
//     postType: "comment",
//     imageURL: "https://upload.wikimedia.org/wikipedia/en/3/30/Jon_Snow_Season_8.png",
//     postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
//     key: '3'
//   },
//   {
//     id: "58694a0f-3da1-471f-bd96-145571e29d73",
//     username: "Arya Stark",
//     postCreated: '5h',
//     postType: "submission",
//     imageURL: "https://static.wikia.nocookie.net/gameofthrones/images/b/be/AryaShipIronThrone.PNG/revision/latest?cb=20190520174300",
//     postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
//     key: '4'
//   },
// ];

const Item = ({ username, imageURL, type, postCreated, postDescription }) => (
    <View style={styles.item}>
        <View style={{width: 50, height: 50, overflow: 'hidden', borderWidth: 2, borderRadius: 25}}>
          <Image
          source={{uri: imageURL}}
          resizeMode="cover"
          style={{
            width: 50,
            height: 50,
            }}>
          </Image>
        </View>
        <View style={{flexDirection: "column", marginLeft: 15,}}>
          <View style={{ flexDirection: "row", alignItems: 'flex-start'}}>
            <Text style={styles.title}>{username}</Text>
            <Text style={{fontSize: 12, marginTop: 3}}> posted a {type}! - {postCreated}</Text>
          </View>
          <View style={{flexDirection: 'row', width: 250}}>
            <Text style={{flex: 1, flexWrap: 'wrap', fontSize: 11, marginTop: 5}}>
              {postDescription}
            </Text>
          </View>
        </View>  
    </View>
);

export const DashboardFeed = ({DATA, refresh, onRefresh}) => {
  
  const renderItem = ({ item }) => ( 
    <Item username={item.username} imageURL={item.imageURL} type={item.postType} postCreated={item.postCreated} postDescription={item.postDescription} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
        
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={onRefresh}
        refreshing={refresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1.2,
      backgroundColor: 'steelblue',

    },
    item: {
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 15,
      height: 120,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 15,
    },
    title: {
      fontSize: 15,      
    },
  });
