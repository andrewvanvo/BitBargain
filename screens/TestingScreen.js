import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Pressable, Button, Alert} from 'react-native'
import { useNavigation } from '@react-navigation/native';

import { doc, getDoc, getDocs, updateDoc, update, collection, where, query, arrayUnion, collectionGroup, snapshotEqual } from "firebase/firestore";
import { db } from '../firebase';
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';
import { debugErrorMap } from 'firebase/auth';
import { async } from '@firebase/util';


const TestingScreen = ({navigation}) => {

    const navigateToScan = ()=>{
        navigation.navigate('Scanning');
    };


    // Should be helpful for Yuhe
    const updateProductPrice = async () => {
        const targetProductId = '831EcSKFAbMgUv2DRMI0';                              // replace the constant with the actual productId (aka. Document ID) that's being updated
        const targetStoreId = 'Dpr0frv7ioovMXyH9oda';                                // replace the constant with the actual storeId (aka. Document ID) that's being updated

        const productRef = doc(db, 'products', targetProductId);
        const storeRef = doc(productRef, 'stores_carrying', targetStoreId);
        await updateDoc(storeRef, {
            price: 10                                                                // replace '3' with the new price
        });
    }

    // Should be helpful for Andrew
    const findStoreProducts = async () => {
        const targetStoreId = '3lbIEzHPUBz5PRH2dX0W';                               // replace the constant with the actual storeId (aka. store's Document ID)

        await getDocs(collection(db, 'products'))                                   // get the 'products' collection
        .then((productSnap) => {
            let promises = [];
            productSnap.forEach((document) => {                                     // go thru all products, and check if the subcollection has the store (by store_id)
                var targetProductId = document.data().product_id;
                var productRef = doc(db, 'products', targetProductId);
                promises.push(
                    getDoc(doc(productRef, 'stores_carrying', targetStoreId))       // search for the store
                    .then((storeSnap) => {
                        if(storeSnap.exists()) {
                            return targetProductId;
                        } else {
                            return null;
                        }
                    })
                );
            });
            return Promise.all(promises);

        })
        .then((results) => {
            const storeProducts = results.filter(productID => productID != null)    // show only the products (product IDs)

            console.log(storeProducts);
            return storeProducts
        });
    }

    const getProducts = async () => {
        return await findStoreProducts();
    }


    const resetAsyncStorage = () => {
        AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => alert('success'));
    }
    
    return (
        <View style ={styles.buttonContainer}>
            <Button style ={styles.button} title = "SCAN" onPress={() => navigateToScan()}></Button>
            <Button style ={styles.button} title = "UPDATE PRICE" onPress={() => updateProductPrice()}></Button> 
            <Button style ={styles.button} title = "RESET ASYNCSTORAGE" onPress={() => resetAsyncStorage()}></Button> 
            <Button style ={styles.button} title = "GET PRODUCTS" onPress={() => findStoreProducts()}></Button> 
        </View>
        
    );
};

export default TestingScreen;

const styles = StyleSheet.create({
    
    buttonContainer: {
        width: '70%',
        marginTop: 15,
        flexDirection: 'column',
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
