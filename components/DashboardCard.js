import React, { useState, useEffect } from "react";

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
import { Timestamp } from "firebase/firestore";

  export const Card = (props) => {
    const [time, setTime] = useState('');


    const convertTimestamp = (timestamp) => {
      const ms = Date.now() - timestamp.toDate();
      const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
      const min = Math.floor((ms / 1000 / 60) % 60)
      const sec = Math.floor((ms / 1000) % 60)
      
      // console.log(hours, min, sec)
      if (hours != 0){
        setTime(hours + 'h')
      }
      else if (min != 0) {
        setTime(min + 'm')
      }
      else {
        setTime(sec + 's')
      }


      
      
    }

    useEffect(() => {
      convertTimestamp(props.item.postCreated)
    })
    
    return (
    <View style={styles.item}>
        <View style={{width: 50, height: 50, overflow: 'hidden', borderWidth: 2, borderColor: 'black', borderRadius: 25}}>
          <Image
          source={{uri: props.item.imageURL}}
          resizeMode="cover"
          style={{
            width: 50,
            height: 50,
            }}>
          </Image>
        </View>

        <View style={{flexDirection: "column", marginLeft: 15,}}>
          <View style={{ flexDirection: "row", alignItems: 'flex-start'}}>
            <Text style={styles.title}>{props.item.username}</Text>
            <Text style={{fontSize: 12, marginTop: 3}}> posted a {props.item.postType}! - {time} </Text> 
            {/* {props.item.postCreated} */}
          </View>
          <View style={{flexDirection: 'row',  width: 250}}>
            <Text style={{flex: 1, flexWrap: 'wrap', marginBottom: 5, fontSize: 11, marginTop: 5}}>
              {props.item.postDescription} 
              {/* 30 word count? */}
              {/* orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus */}
             </Text>
          </View>
          {/* <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={()=>{pushCommentScreen()}}>
              <Icon name="chatbubble-outline" size={15} style={styles.icons}/>
            </TouchableOpacity>
          </View> */}

        </View>  
    </View>
  )  
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
    elevation: 8
  },
  title: {
    fontSize: 15,      
  },
});