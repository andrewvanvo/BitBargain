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
  import Icon from "react-native-vector-icons/Ionicons";
  import { useNavigation } from "@react-navigation/native";

  export const Card = ({ item, pushCommentScreen }) => (
    <View style={styles.item}>
        <View style={{width: 50, height: 50, overflow: 'hidden', borderWidth: 2, borderRadius: 25}}>
          <Image
          source={{uri: item.imageURL}}
          resizeMode="cover"
          style={{
            width: 50,
            height: 50,
            }}>
          </Image>
        </View>

        <View style={{flexDirection: "column", marginLeft: 15,}}>
          <View style={{ flexDirection: "row", alignItems: 'flex-start'}}>
            <Text style={styles.title}>{item.username}</Text>
            <Text style={{fontSize: 12, marginTop: 3}}> posted a {item.postType}! - {item.postCreated}</Text>
          </View>
          <View style={{flexDirection: 'row', height: 70, width: 250}}>
            <Text style={{flex: 1, flexWrap: 'wrap', fontSize: 11, marginTop: 5}}>
              {item.postDescription} 
              {/* 30 word count? */}
              orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus
             </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={()=>{pushCommentScreen.pushCommentScreen}}>
              <Icon name="chatbubble-outline" size={15} style={styles.icons}/>
            </TouchableOpacity>
          </View>

        </View>  
    </View>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    height: 130,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  title: {
    fontSize: 15,      
  },
});