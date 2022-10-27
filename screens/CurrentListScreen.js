import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image} from 'react-native'
import { useNavigation } from '@react-navigation/native';


class Product extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.state = {
            quantity: props.item.quantity,
        };
    }
    addProduct = () => {
        this.setState({quantity: this.state.quantity + 1});
    }
    removeProduct = () => {
        this.setState({quantity: this.state.quantity - 1});
        
    }

    // when states are changed, make an update to async storage
    componentDidUpdate() {
        this.updateData();
      }

    updateData = async () => {
        var json;

        try {
            // save current state to an array
            const data = await AsyncStorage.getItem('@storage_Key');

            if(data !== null) {
                json = JSON.parse(data);

                var item = json.find(item => item.product_id === this.item.product_id);
                item.quantity = this.state.quantity;
                
                if(item.quantity < 1) {
                    const index = json.indexOf(item);
                    json.splice(index, 1);
                }
            }
            // replace previous states with updated states
            await AsyncStorage.setItem('@storage_Key', JSON.stringify(json));
            
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        // when user sets quantity below 0, that indicates to remove from the shopping list
        // will probably implement an alert/modal for this in the future.
        return this.state.quantity < 1 ? null : (
            <View style={[styles.productTile]}>
                <Image
                    source={{uri: this.item.image_url}}
                    style={styles.productImg}
                />
                <View style={styles.otherStuff}>
                    <View style={styles.productNameContainer}>
                        <Text style={styles.productName}>{this.item.product_name}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={this.removeProduct}
                            style={styles.adjustBtns}
                        >
                            <Text>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.productQuantity}>{this.state.quantity}</Text>
                        <TouchableOpacity
                            onPress={this.addProduct}
                            style={styles.adjustBtns}
                        >
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const CurrentListScreen = ({ navigation }) => {
    // product list from async storage (e.g., products the user selected from previous screen)
    const [data, setData] = useState([]);


    const renderProduct = ({ item }) => {
        return (
        <Product item={item}/>
        );
    };
    
    // https://react-native-async-storage.github.io/async-storage/docs/usage/
    // update product list (data), whenever it is ready from async storage
    useEffect(() => {
        const getData = async () => {
            try {
                const data = await AsyncStorage.getItem('@storage_Key')
                if(data !== null) {
                    var json = JSON.parse(data);
                    setData(json);
                }
            } catch(error) {
                console.log(error);
            }
        }
        getData();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.productContainer}>
                <FlatList
                    data={data}
                    renderItem={renderProduct}
                    keyExtractor={item => item.product_id}
                />
            </View>
            <View style={styles.selectStoreButton}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SelectStore')}  
                >
                    <Text>Select Store</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default CurrentListScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    productContainer: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    productTile: {
        width: 350,
        height: 200,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    adjustBtns: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 5,
    },
    productNameContainer: {
        flex: 5,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    productName: {
        flexWrap: 'wrap',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    buttonContainer:{
        flexDirection: 'row',  
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'orange',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        width: '80%'

    },
    selectStoreButton: {
        borderRadius: 10,
        width: '30%',
        padding: 10,
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange'
    },
    productImg: {
        width: 150,
        height: 150,
        flex: 1
    },
    otherStuff: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },

    productQuantity: {
        fontSize: 12,
        flex: 1, 
        textAlign: 'center'
    }
});