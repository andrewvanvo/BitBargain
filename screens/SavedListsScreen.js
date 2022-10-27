import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Pressable, Button, Alert} from 'react-native'
import { useNavigation } from '@react-navigation/native';

import { collection, query, where, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase';

const currShoppingList = new Set();
class List extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
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
        
        try {
            var test = this.item.userID
            //this.item.productArray.forEach(async function (product){
            //    cartItems.push(product)
            //});
            //await AsyncStorage.setItem('@storage_Key', JSON.stringify(cartItems));
            console.log(test)
            //console.log(cartItems);
        } catch (error){
            console.log(error);
        }
        
        //navigation.navigate('CurrentList');
    };
}

const SavedListsScreen = ({navigation}) => {
    const [savedLists, setSavedLists] = useState([]);
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

    const renderList = ({ item }) => {
        return (
            <List  
                item={item}
            />
        );
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.listContainer}>
                <FlatList
                    data={savedLists}
                    renderItem={renderList}
                    keyExtractor={item => item.listName} //listname must be unique, ensure it is when saving list

                />
            </View>
        </View>
    );
}
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