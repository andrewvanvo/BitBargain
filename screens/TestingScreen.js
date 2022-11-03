import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Pressable, Button, Alert} from 'react-native'
import { useNavigation } from '@react-navigation/native';

import { collection, query, where, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';
import { debugErrorMap } from 'firebase/auth';


const TestingScreen = ({navigation}) => {

    const navigateToScan = ()=>{
        navigation.navigate('Scanning');
    };
    
    return (
        <View style ={styles.buttonContainer}>
            <Button style ={styles.button} title = "SCAN" onPress={() => navigateToScan()}></Button> 
        </View>
    );
};

export default TestingScreen;

const styles = StyleSheet.create({
    
    buttonContainer: {
        width: '70%',
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        borderRadius: 10,
        width: '45%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange'
    },
});
