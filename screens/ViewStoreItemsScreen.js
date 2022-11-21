import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image} from 'react-native'
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { FloatingAction } from "react-native-floating-action";

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

const ViewStoreItemsScreen = ({route, navigation}) => {

    const [data, setData] = useState([]);
    const [store_name, setStore_name] = useState("");

    const store_id = route.params.store_id;

    const actions = [
        {
            text: "Scan to Add",
            icon: require("../assets/scan-icon.png"),
            name: "Scanning",
            position: 1
        },
        {
            text: "Enter New Product",
            icon: require("../assets/add-icon.png"),
            name: "AddProduct",
            position: 2
        }
    ];

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
                for (var eachStore in object.stores_carrying) {
                    if (eachStore === store_id) {
                        storeList.push({
                            "image_url": object.image_url,
                            "product_id": object.product_id,
                            "product_name": object.product_name,
                            "store_price": object.stores_carrying[eachStore].price,
                            "store_id": eachStore,
                        })
                        setStore_name(object.stores_carrying[eachStore].store_name);
                    }
                }
            });
            setData(storeList);
        })
        return () => unsubscribe;
    }, []);

    return (
        <View style={styles.mainContainer}>
            <View>
                <Text style={{fontSize:20, marginTop: 10}}>
                    Update Store {store_name} Products
                </Text>
            </View>
            <View >
                <FlatList
                    data={data}
                    renderItem={renderProduct}
                />
            </View>
            <View style={styles.buttonContainer}>
                <FloatingAction
                    actions={actions}
                    onPressItem={name => {
                        navigation.navigate(name, {store_id: store_id})
                    }}
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
        marginTop: 75,
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
    buttonContainer: {
        flex: 1,
        width: '110%',
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 35
    }
});