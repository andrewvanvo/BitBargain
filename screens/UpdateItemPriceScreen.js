import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, TextInput} from 'react-native'
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';


const UpdateItemPriceScreen = ({route, navigation}) => {

    const store_id = route.params.store_id;
    const product_id = route.params.product_id;
    const image_url = route.params.image_url;
    const product_name = route.params.product_name;
    const price = route.params.price;

    const updatePrice = () => {
        // const productRef = updateDoc(doc(db, 'products', product_id), {
        // });
    }

    return (
        <View>
            <Image
                source={{uri: image_url}}
            />
            <View style={{margin: 50, padding: 3, borderRadius: 5}}>
                <Text>{store_id}</Text>
                <Text>{product_id}</Text>
                <Text>Product: {product_name}</Text>
                <Text>Old Price: {price}</Text>
            </View>
            <TextInput 
                placeholder='New Price'
            />
        </View>
    );
}

export default UpdateItemPriceScreen