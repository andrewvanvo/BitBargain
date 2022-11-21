import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Pressable, Button, Alert} from 'react-native'
import { useNavigation } from '@react-navigation/native';

import { collection, query, where, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';
import { debugErrorMap } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

import Scanner from './ScannerScreen';


class List extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.navigation = props.navigation; //nav prop accesible from parent screen
        this.dbProducts = props.savedProducts //product collection snapshot passed down
    }
    render() {
        return (
            <Pressable style={styles.listTile} 
            onPress={()=>this.navigateToNamedList(this.item)}>   
                <Text>{this.item.list_name}</Text>
            </Pressable>
        );
    }

    navigateToNamedList = async(item)=>{
        var cartItems = [];
        try {
            //iterate over SavedLists productArray to get product id, then compare product id against dbProducts to see if match, if so, push onto cart
            this.item.product_array.forEach((product) =>{
                //productList.push(product)
                // console.log(product)
                this.props.dbProducts.forEach((dbproduct)=>{
                    //CAN CHANGE WHEN DB STRUC CHANGES: USING PRODUCT DOC ID TO CHECK AGAINST
                    // console.log(dbproduct)
                    if (product == dbproduct['product_id']){
                        cartItems.push(dbproduct)
                    }
                })
            })
            //console.log(this.props.dbProducts)
            // console.log(cartItems)

            await AsyncStorage.setItem('@named_list', JSON.stringify(cartItems));
            //console.log(test)
            //console.log(cartItems);
        } catch (error){
            console.log(error);
        }
        this.navigation.navigate('NamedList', {storageKey: '@named_list'});
    };
}
const SavedListsScreen = ({navigation}) => {
    const [savedLists, setSavedLists] = useState([]);
    const [savedProducts, setSavedProducts] = useState([]);
    const [result, setResult] = useState([])
    let key = 'uid'

    //getting UID
    useEffect(()=>{
        const getValue = async ()=> {
            let result = await SecureStore.getItemAsync(key)
            if (result){
                setResult(result)
            }
        }
        getValue()
    }, [])

    useEffect(() => {
        const productsRef = collection(db, 'products'); //name of collection
        const unsubscribe = onSnapshot(productsRef, (productsSnap) => {
            const savedProducts= []
            productsSnap.forEach((doc) => {
                savedProducts.push(doc.data());
            });
            setSavedProducts(savedProducts);
            //console.log(savedProducts)
        })
        return () => unsubscribe;
    }, []);
    
    //dynamically update list of saved lists
    useEffect(() => {
        const listsRef = collection(db, 'saved_lists'); //name of collection
        const unsubscribe = onSnapshot(listsRef, (listsSnap) => {
            const savedLists= []
            listsSnap.forEach((doc) => {
                if (doc.data()['user_id'] == result){
                    savedLists.push(doc.data());
                }
            });
            setSavedLists(savedLists);
            // console.log(savedLists);
        })
        return () => unsubscribe;
    }, [result]);

    //useEffect(() => {
    //    const productsRef = collection(db, 'products'); //name of collection
    //    const unsubscribe = onSnapshot(productsRef, (productsSnap) => {
    //        const savedProducts= []
    //        productsSnap.forEach((doc) => {
    //            savedProducts.push(doc.data());
    //        });
    //        setSavedProducts(savedProducts);
    //        //console.log(savedProducts)
    //    })
    //    return () => unsubscribe;
    //}, []);


    const renderList = ({ item }) => {
        return (
            
            <List 
                item={item}
                navigation = {navigation} //pull navigation prop from parent screen and pass as prop
                dbProducts ={savedProducts}
            />
        );
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <Text style={{fontSize: 24, color: 'white'}}>SELECT A SAVED LIST</Text>
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    data={savedLists}
                    extraData = {savedProducts}
                    renderItem={renderList}
                    keyExtractor={item => item.list_name} //listname must be unique, ensure it is when saving list
                />
            </View>
        </View>
    );
};

export default SavedListsScreen;

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'steelblue'
    },
  
    header:{
      alighItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'steelblue',
      marginTop: 50,
      paddingBottom: 25
    },  
  
    listContainer: {
      backgroundColor: 'steelblue',
      flex: 1,
      
    },
    listTile: {
  
        backgroundColor: 'white',
        width: 350,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 2,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        borderColor: 'white'
    },
    textContainer:{
      backgroundColor: 'orange',
      flex: 1,
    },
    storeName:{
      textAlign: 'left'
    },
  
    storeAddress:{
      textAlign: 'right'
    }
  }); 