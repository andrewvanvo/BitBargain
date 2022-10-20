import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { array } from 'yup';


// MOCK DATA: some 'categories' of products that we might have. Used to render the horizontal scroll tab (horizontal flatlist)
const CATEGORY_DATA = [
    {id: 0, name: 'CPUs'}, {id: 1, name: 'GPUs'}, {id: 2, name: 'Motherboards'}, {id: 3, name: 'PSUs'}, 
    {id: 4, name: 'PC Cooling'}, {id: 5, name: 'Memory'}, {id: 6, name: 'Storage'}, {id: 7, name: 'Monitors'},];

// MOCK DATA: different type of products under a specific category 
// we add 'quantity' here, so later we can adjust them in the 'CurrentList' screen (e.g., if user want to buy 1 of this, or 3, etc.)
// we might be able to implement 'quantity' somewhere upstream, but tentatively, it looks ok under products
const CPU_DATA = [
    {id: 0, name: 'AMD Ryzen 5 5600X'}, 
    {id: 1, name: 'AMD Ryzen 9 5900X'}, 
    {id: 2, name: 'AMD Ryzen 5 3600'}, 
    {id: 3, name: 'AMD Ryzen 9 5950X'}, 
    {id: 4, name: 'AMD Ryzen 7 5800X'}, 
    {id: 5, name: 'Intel Core i7-12700K'}, 
    {id: 6, name: 'Intel Core i9-12900K'}, 
    {id: 7, name: 'AMD Ryzen 5 5600G'},];
  
const GPU_DATA = [
    {id: 8, name: 'ASUS TUF Gaming GeForce RTX 3070 Ti'}, 
    {id: 9, name: 'GIGABYTE GeForce RTX 3050'}, 
    {id: 10, name: 'GIGABYTE GAMING OC Radeon RX 6500 XT'}, 
    {id: 11, name: 'MSI Mech Radeon RX 6500 XT'}, 
    {id: 12, name: 'ASRock OC Formula Radeon RX 6900 XT'}, 
    {id: 13, name: 'GIGABYTE Radeon RX 6700 XT'}, 
    {id: 14, name: 'EVGA GeForce RTX 3080 FTW3'}, 
    {id: 15, name: 'EVGA GeForce RTX 3080 Ti FTW3'},];
  
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
        this.continue = props.continue
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
    // allow user to continue to 'CurrentList' screen, only when > 1 product is selected.
    componentDidUpdate() {
        if(currShoppingList.size > 0) {
            this.continue(true);
        } else {
            this.continue(false);
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
    const [canContinue, setCanContinue] = useState(false); 


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
            <Product 
                item={item}
                continue={setCanContinue}
            />
        );
    };

    const navigateToCurrentList = async () => {
        var hasData = true;

        // check if states exist in async storage
        try {
            const data = await AsyncStorage.getItem('@storage_Key');
            if(JSON.parse(data).length === 0){
                hasData = false;
            }
        } catch(error) {
            console.log(error);
        }
        // no state(s) exist, create states
        if(!hasData){
            try {
                console.log('Create initial states....!');
                const newList = [];
                // currShoppingList.forEach(product => newList.push(product));
                currShoppingList.forEach(function(product) {
                    product.quantity = 0;
                    console.log(product);
                    newList.push(product);
                });

                const jsonList = JSON.stringify(newList);

                await AsyncStorage.setItem('@storage_Key', jsonList);
                navigation.navigate('CurrentList');
            } catch (error) {
                console.log(error);
            }
        }

        // notes:
        // push whenever is selected, if and only if async doesn't already include the product

        navigation.navigate('CurrentList');

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
            <View style={[styles.continueButton, {backgroundColor: canContinue ? 'orange' : 'lightgray'}]}>
                <TouchableOpacity
                    onPress={() => navigateToCurrentList()}               // navigate to the 'CurrentListScreen' with user's shopping list
                    disabled={canContinue ? false : true}
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
    }
});