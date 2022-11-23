import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, TextInput, ScrollView } from 'react-native'
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase';


const UpdateItemPriceScreen = ({route, navigation}) => {

    const [Product_price, setProduct_price] = useState("");


    const store_id = route.params.store_id;
    const store_address = route.params.store_address;
    const product_id = route.params.product_id;
    const image_url = route.params.image_url;
    const product_name = route.params.product_name;
    const price = route.params.price;
    const store_name = route.params.store_name;

    const updatePrice = async () => {
        // const productRef = updateDoc(doc(db, 'products', product_id), {
        // });
        const productRef = doc(db, 'products', product_id);
        const result = await getDoc(productRef);
        const prev_price = (result.data().stores_carrying[store_id].prev_price);
        var on_sale = false
        if (price < prev_price) {
            on_sale = true
        }
        const price_ref = 'stores_carrying.'+ store_id.toString() +'.price'
        const on_sale_ref = 'stores_carrying.'+ store_id.toString() +'.on_sale'
        await updateDoc(productRef, {
            [price_ref] : Number(Product_price),
            [on_sale_ref]: on_sale
        }
        );
        navigation.goBack();
    }

    return (
        <View style={styles.mainContainer}>
            <View>
                <Text style={{fontSize:20, marginTop: 10}}>
                    {store_name} at {store_address}
                </Text>
            </View>
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: image_url}}
                    style={styles.productImg}
                />
            </View>
            <ScrollView style={{flex: 1}} keyboardShouldPersistTaps= "never">
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
                    keyboardType='numeric'
                    style={styles.inputField}
                    onChangeText={(pPrice) => setProduct_price(pPrice)}
                    maxLength={10}
                />
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={()=>{updatePrice()}}>
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