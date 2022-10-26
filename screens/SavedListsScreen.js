import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Pressable} from 'react-native'
import { useNavigation } from '@react-navigation/native';

import { collection, query, where, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
    }
    render() {
        return (
            <Pressable
                //onPress={}
            >   
                <Text>{this.item.listName}</Text>
            </Pressable>
        );
    }
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

    const renderList = ({ item, onPress }) => {
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
                    keyExtractor={item => item.listName}
                />
            </View>
        </View>
    );
}
export default SavedListsScreen;


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    listContainer: {
        flex: 1,
    },
    
});