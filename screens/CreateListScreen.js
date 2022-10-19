import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { array } from 'yup';


// MOCK DATA: some 'categories' of products that we might have. Used to render the horizontal scroll tab (horizontal flatlist)
const CATEGORY_DATA = [
    {id: 0, name: 'CPUs'}, {id: 1, name: 'GPUs'}, {id: 2, name: 'Motherboards'}, {id: 3, name: 'PSUs'}, 
    {id: 4, name: 'PC Cooling'}, {id: 5, name: 'Memory'}, {id: 6, name: 'Storage'}, {id: 7, name: 'Monitors'},];

// MOCK DATA: different type of products under a specific category 
const CPU_DATA = [
    {id: 0, name: 'AMD Ryzen 5 5600X', quantity: 0}, 
    {id: 1, name: 'AMD Ryzen 9 5900X', quantity: 0}, 
    {id: 2, name: 'AMD Ryzen 5 3600', quantity: 0}, 
    {id: 3, name: 'AMD Ryzen 9 5950X', quantity: 0}, 
    {id: 4, name: 'AMD Ryzen 7 5800X', quantity: 0}, 
    {id: 5, name: 'Intel Core i7-12700K', quantity: 0}, 
    {id: 6, name: 'Intel Core i9-12900K', quantity: 0}, 
    {id: 7, name: 'AMD Ryzen 5 5600G', quantity: 0},];
  
const GPU_DATA = [
    {id: 8, name: 'ASUS TUF Gaming GeForce RTX 3070 Ti', quantity: 0}, 
    {id: 9, name: 'GIGABYTE GeForce RTX 3050', quantity: 0}, 
    {id: 10, name: 'GIGABYTE GAMING OC Radeon RX 6500 XT', quantity: 0}, 
    {id: 11, name: 'MSI Mech Radeon RX 6500 XT', quantity: 0}, 
    {id: 12, name: 'ASRock OC Formula Radeon RX 6900 XT', quantity: 0}, 
    {id: 13, name: 'GIGABYTE Radeon RX 6700 XT', quantity: 0}, 
    {id: 14, name: 'EVGA GeForce RTX 3080 FTW3', quantity: 0}, 
    {id: 15, name: 'EVGA GeForce RTX 3080 Ti FTW3', quantity: 0},];
  
// MOCK DATA: list of data of data to render the vertical flatlist
const PRODUCT_DATA = [
    {id: 0, name: CPU_DATA}, {id: 1, name: GPU_DATA}, {id: 2, name: {}}, {id: 3, name: {}}, 
    {id: 4, name: {}}, {id: 5, name: {}}, {id: 6, name: {}}, {id: 7, name: {}},
]

// User's added items. Can be used for later screens.
const currShoppingList = new Set();

// Component for different product categories in the horizontal flatlist
// https://reactnative.dev/docs/flatlist -- see the selectable example
const Category = ( props ) => {
    return (
        <TouchableOpacity
        style={[styles.categoryButton, {backgroundColor: props.item.id === props.state ? 'green' : 'orange'}]}
        onPress={() => props.setState(props.item.id)}
        >
        <Text>{props.item.name}</Text>
        </TouchableOpacity>
    );
};

// Component for list of products in the vertical flatlist
// https://reactjs.org/docs/react-component.html#constructor
class Product extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.itemName = props.item.name;
        this.state = {
            selected: false,
        };
    }
    // update whether the product has been selected by the user
    toggleProduct = () => {
        if(!currShoppingList.has(this.item)) {
            currShoppingList.add(this.item);
            this.setState({ selected: true });
        } else {
            currShoppingList.delete(this.item);
            this.setState({ selected: false });
        }
    }
    render() {
        return (
            <TouchableOpacity
                style={[styles.productTile, {backgroundColor: currShoppingList.has(this.item) ? 'gray' : 'white'}]}
                onPress={this.toggleProduct}
            >
                <Text>{this.itemName}</Text>
            </TouchableOpacity>
        );
    }
}

const CreateListScreen = ({navigation}) => {
    const [selectedCategory, setSelectedCategory] = useState(0);

    const renderCategory = ({ item }) => {
        return (
            <Category 
                item={item}
                state={selectedCategory}
                setState={setSelectedCategory}
            />
        );
    };

    const renderProduct = ({ item }) => {    
        return (
            <Product item={item}/>
        );
    };

    const navigateToCurrentList = async () => {
        var hasData = false;
        try {
            const data = await AsyncStorage.getItem('@storage_Key');
            if(data !== null) {
                // console.log('Navigating next screen w/o async storage.');
                // console.log(currShoppingList.size);
                if(JSON.parse(data).length === currShoppingList.size){
                    hasData = true;
                }
                navigation.navigate('CurrentList');
            }
            
        } catch(error) {
            console.log(error);
        }
        if(!hasData){
            try {
                const newList = [];
                currShoppingList.forEach(product => newList.push(product));
                const jsonList = JSON.stringify(newList);
    
                await AsyncStorage.setItem('@storage_Key', jsonList);
                // console.log('Navigating next screen WITH async storage.');
                navigation.navigate('CurrentList');
            } catch (error) {
                console.log(error);
            }
        }

    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.categoryContainer}>
                <FlatList
                    data={CATEGORY_DATA}
                    renderItem={renderCategory}
                    keyExtractor={item => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={styles.productContainer}>
                <FlatList
                    data={PRODUCT_DATA[selectedCategory]['name']}
                    renderItem={renderProduct}
                    keyExtractor={item => item.id}
                />
            </View>
            <View style={styles.continueButton}>
                <TouchableOpacity
                    onPress={() => navigateToCurrentList()}               // navigate to the 'CurrentListScreen' with user's shopping list
                >
                    <Text>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default CreateListScreen

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
    categoryButton: {
        width: 120,
        backgroundColor: 'orange',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
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
        padding: 80,
        marginVertical: 8,
        marginHorizontal: 16,
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 10,
    },
    continueButton: {
        borderRadius: 10,
        width: '30%',
        padding: 10,
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange'
    }
});