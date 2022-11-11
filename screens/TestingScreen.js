import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Pressable, Button, Alert} from 'react-native'
import { useNavigation } from '@react-navigation/native';

import { doc, getDoc, getDocs, updateDoc, update, collection, where, query, arrayUnion, collectionGroup } from "firebase/firestore";
import { db } from '../firebase';
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';
import { debugErrorMap } from 'firebase/auth';


const TestingScreen = ({navigation}) => {

    const navigateToScan = ()=>{
        navigation.navigate('Scanning');
    };


    const updateProductPrice = async () => {

        let targetProductId = '831EcSKFAbMgUv2DRMI0';
        let targetStoreId = 'zZSlKfTLBQMxKrsMac7R';

        const productRef = collection(db, 'products', targetProductId, 'stores_carrying');
        const querySnapshot = await getDocs(productRef);
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
        });



        // // can a single field, e.g. product_name
        // let targetProductId = '831EcSKFAbMgUv2DRMI0';
        // let targetStoreId = 'zZSlKfTLBQMxKrsMac7R';

        // const docSnap = await getDoc(doc(db, 'products', targetProductId));
        // const storesCarrying = await docSnap.stores_carrying;
        // const found = storesCarrying.find(store => store.store_id == targetStoreId);
        // console.log(storesCarrying);
        // const docSnap2 = await updateDoc(doc(db, 'products', targetProductId), {product_name : 'Intel Core i9-13900K--testing'});

        // // add a store/price to a product
        // let targetProductId = '831EcSKFAbMgUv2DRMI0';
        // let targetStoreId = 'zZSlKfTLBQMxKrsMac7R';

        // const productRef = doc(db, 'products', targetProductId);

        // await updateDoc(productRef, {stores_carrying: arrayUnion(
        //     {
        //         on_sale: true,
        //         prev_price: 1000,
        //         price: 500,
        //         store_id: 'zZSlKfTLBQMxKrsMac7R'
        //     }
        // )});


        // const productRef = collection(db, 'products', targetProductId, 'stores_carrying');
        // const querySnapshot = await getDocs(productRef);
        // querySnapshot.forEach((doc) => {
        //   console.log(doc.data());
        // });

        // const targetProductId = '831EcSKFAbMgUv2DRMI0';                              // replace the constant with the actual productId (aka. Document ID) that's being updated
        // const targetStoreId = 'Dpr0frv7ioovMXyH9oda';                                // replace the constant with the actual storeId (aka. Document ID) that's being updated

        // const productRef = doc(db, 'products', targetProductId);
        // const storeRef = doc(productRef, 'stores_carrying', targetStoreId);
        // await updateDoc(storeRef, {
        //     price: 10                                                                // replace '3' with the new price
        // });

    }

    const resetAsyncStorage = () => {
        AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => alert('success'));
    }
    
    return (
        <View style ={styles.buttonContainer}>
            <Button style ={styles.button} title = "SCAN" onPress={() => updateProductPrice()}></Button> 
            <Button style ={styles.button} title = "RESET ASYNCSTORAGE" onPress={() => resetAsyncStorage()}></Button> 
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
