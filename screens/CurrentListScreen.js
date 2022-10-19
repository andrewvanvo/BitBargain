import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native'
import { useNavigation } from '@react-navigation/native';


class Product extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.itemName = props.item.name;
        this.state = {
            quantity: props.item.quantity,
        };
    }
    addProduct = () => {
        this.setState({quantity: this.state.quantity + 1});
    }
    removeProduct = () => {
        if(this.state.quantity > 0){
            this.setState({quantity: this.state.quantity - 1});
        }
        
    }

    componentDidUpdate() {
        this.updateData();
      }

    updateData = async () => {
        var json;

            // save current quantity and save to array
        try {
            const data = await AsyncStorage.getItem('@storage_Key');
            if(data !== null) {
                json = JSON.parse(data);

                var item = json.find(item => item.id === this.item.id);
                item.quantity = this.state.quantity;
            }
            // remove outdated states from async storage
            await AsyncStorage.removeItem('@storage_Key');
            // add updated states to async storage
            await AsyncStorage.setItem('@storage_Key', JSON.stringify(json));
            
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        return (
            <View
                style={[styles.productTile, {backgroundColor: 'white'}]}
            >
                <Text>{this.itemName}</Text>
                <View>
                    <TouchableOpacity
                        onPress={this.addProduct}
                    >
                        <Text>+</Text>
                    </TouchableOpacity>
                    <Text>{this.state.quantity}</Text>
                    <TouchableOpacity
                        onPress={this.removeProduct}
                    >
                        <Text>-</Text>
                    </TouchableOpacity>
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
                    keyExtractor={item => item.id}
                />
            </View>
            <View style={styles.selectStoreButton}>
                <TouchableOpacity
                    // onPress={() => navigateToCurrentList()}  
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
    categoryContainer: {
        flex: 1,
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
        padding: 80,
        marginVertical: 8,
        marginHorizontal: 16,
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 10,
    },
    selectStoreButton: {
        borderRadius: 10,
        width: '30%',
        padding: 10,
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange'
    }
});