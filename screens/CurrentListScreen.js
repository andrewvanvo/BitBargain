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

                var item = json.find(item => item.id === this.item.id);
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
            <View
                style={[styles.productTile, {backgroundColor: 'white'}]}
            >
                <Text style={{flex: 1, fontSize: 24, textAlign: 'center'}}>{this.itemName}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={this.removeProduct}
                        style={{flex: 1, backgroundColor: 'pink', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}
                    >
                        <Text style={{fontSize: 24}}>-</Text>
                    </TouchableOpacity>
                    <Text style={{flex: 1, fontSize: 24, textAlign: 'center'}}>{this.state.quantity}</Text>
                    <TouchableOpacity
                        onPress={this.addProduct}
                        style={{flex: 1, backgroundColor: 'lightgreen', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}
                    >
                        <Text style={{fontSize: 24}}>+</Text>
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
                    // console.log('CurrentList screen: importing data: ', json);
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
        width: '95%',
        padding: 30,
        marginVertical: 8,
        marginHorizontal: 16,
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 10,
    },
    buttonContainer:{
        margin: 30,
        flexDirection: 'row',  
        justifyContent: 'center', alignItems: 'center'      
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