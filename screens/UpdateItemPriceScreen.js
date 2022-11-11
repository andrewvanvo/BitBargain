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
        <View style={styles.mainContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: image_url}}
                    style={styles.productImg}
                />
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.title}>    Product: </Text>
                <View style={styles.productTile}>
                    <Text>{product_name}</Text>
                </View>
                <Text style={styles.title}>    Old Price: </Text>
                <View style={styles.productTile}>
                    <Text>USD ${price}</Text>
                </View>
                <Text style={styles.title}>    New Price:</Text>
                <TextInput 
                    placeholder='New Price'
                    style={styles.inputField}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={()=>{navigation.goBack()}}>
                    <Text>Update</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default UpdateItemPriceScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    title: {
        fontWeight: 'bold',
        color: 'orange',
        fontSize: 16,
    },
    imageContainer: {
        flex: 1,
        marginTop: 10
    },
    productTile: {
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
    productImg: {
        flex: 1,
        aspectRatio: 1.2, 
        resizeMode: 'contain',
        margin: 10,
        borderColor: 'orange',
        borderWidth: 2,
        borderRadius: 10,
    },
    productInfo: {
        flex: 1,
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    inputField: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        textAlign: 'center',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    buttonContainer: {
        flex: 0.5,
        width: '70%',
        marginTop: 5,
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
    }
});