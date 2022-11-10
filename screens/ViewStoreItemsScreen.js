import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image} from 'react-native'
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
    }

    render() {
        return (
            <TouchableOpacity
            style={[styles.productTile, {backgroundColor: 'white'}]}
            onPress={()=>{this.props.navigation.navigate('UpdatePrice', {
                "store_id": this.item.store_id, 
                "product_id": this.item.product_id,
                "image_url": this.item.image_url,
                "product_name": this.item.product_name,
                "price": this.item.store_price
            })}}
            >
                <View style={styles.productImg}>
                    <Image
                        source={{uri: this.item.image_url}}
                        style={styles.productImg}
                    />
                </View>
                
                <View style={{flex: 1}}>
                    <Text style={styles.productInfo}>{this.item.product_name}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
                        <Text >USD ${this.item.store_price}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const ViewStoreItemsScreen = ({navigation}) => {

    const [data, setData] = useState([]);

    const renderProduct = ({ item }) => {
        return (
        <Product
            item={item}
            navigation={navigation}
        />
        );
    };

    useEffect(() => {
        const productRef = collection(db, 'products');
        const unsubscribe = onSnapshot(productRef, (productSnap) => {
            var storeList = [];
            productSnap.forEach((doc) => {
                var object = doc.data();
                object.stores_carrying.forEach((eachStore) => {
                    // The 112233 can be replaced by the store id passed in
                    if (eachStore.store_id === 112233) {
                        storeList.push({
                            "image_url": object.image_url,
                            "product_id": object.product_id,
                            "product_name": object.product_name,
                            "store_price": eachStore.price,
                            "store_id": eachStore.store_id
                        })
                    }
                })
            });
            setData(storeList);
            
        })
        return () => unsubscribe;
    }, []);

    return (
        <View style={styles.mainContainer}>
            <View >
                <FlatList
                    data={data}
                    renderItem={renderProduct}
                />
            </View>
        </View>
    );
}

export default ViewStoreItemsScreen


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    title: {
        fontWeight: 'bold',
        color: 'blue',

    },
    productContainer: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    productTile: {
        // backgroundColor: 'green',
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
        aspectRatio: 1.5, 
        resizeMode: 'contain',
        margin: 5,
    },
    productInfo: {
        flex: 1,
        flexWrap: 'wrap',
        textAlign: 'center',
    },
});