import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Pressable, Button, Alert} from 'react-native'
import { useNavigation } from '@react-navigation/native';

import { collection, query, where, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase';

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
            onPress={()=>this.navigateToCurrentList(this.item)}>   
                <Text>{this.item.listName}</Text>
            </Pressable>
        );
    }

    navigateToCurrentList = async(item)=>{
        var cartItems = [];
        var productList =[];
        try {
            this.item.productArray.forEach((product) =>{
                productList.push(product)
            })
            console.log(this.props.dbProducts)
            await AsyncStorage.setItem('@storage_Key', JSON.stringify(cartItems));
            //console.log(test)
            //console.log(cartItems);
        } catch (error){
            console.log(error);
        }
        this.navigation.navigate('CurrentList')
    };
}
const SavedListsScreen = ({navigation}) => {
    const [savedLists, setSavedLists] = useState([]);
    const [savedProducts, setSavedProducts] = useState([]);
    
    //dynamically update list of saved lists
    useEffect(() => {
        const listsRef = collection(firestore, 'SavedLists'); //name of collection
        const unsubscribe = onSnapshot(listsRef, (listsSnap) => {
            const savedLists= []
            listsSnap.forEach((doc) => {
                savedLists.push(doc.data());
            });
            setSavedLists(savedLists);
            
        })
        return () => unsubscribe;
    }, []);

    useEffect(() => {
        const productsRef = collection(firestore, 'Products'); //name of collection
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
            <View style={styles.listContainer}>
                <FlatList
                    data={savedLists}
                    extraData = {savedProducts}
                    renderItem={renderList}
                    keyExtractor={item => item.listName} //listname must be unique, ensure it is when saving list

                />
            </View>
        </View>
    );
};

export default SavedListsScreen;

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'orange',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    listContainer: {
        backgroundColor: 'orange',
        flex: 1,
        
    },
    listTile: {
        
        backgroundColor: 'white',
        width: 350,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    
});