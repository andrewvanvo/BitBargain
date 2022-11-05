import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';


const UpdatePriceOnlyScreen = ({navigation}) => {
    return (

        <View>
            <Text>Update Price Only Placeholder</Text>
        </View>
    );
}

export default UpdatePriceOnlyScreen;

const styles = StyleSheet.create({
   
}); 