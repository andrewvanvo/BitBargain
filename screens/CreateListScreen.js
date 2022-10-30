import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { array } from 'yup';
import { collection, query, where, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';


// MOCK DATA: different type of products under a specific category 
// we add 'quantity' here, so later we can adjust them in the 'CurrentList' screen (e.g., if user want to buy 1 of this, or 3, etc.)
// we might be able to implement 'quantity' somewhere upstream, but tentatively, it looks ok under products
// const CPU_DATA = [
//     {id: 0, name: 'AMD Ryzen 5 5600X'}, 
//     {id: 1, name: 'AMD Ryzen 9 5900X'}, 
//     {id: 2, name: 'AMD Ryzen 5 3600'}, 
//     {id: 3, name: 'AMD Ryzen 9 5950X'}, 
//     {id: 4, name: 'AMD Ryzen 7 5800X'}, 
//     {id: 5, name: 'Intel Core i7-12700K'}, 
//     {id: 6, name: 'Intel Core i9-12900K'}, 
//     {id: 7, name: 'AMD Ryzen 5 5600G'},];
  
// const GPU_DATA = [
//     {id: 8, name: 'ASUS TUF Gaming GeForce RTX 3070 Ti'}, 
//     {id: 9, name: 'GIGABYTE GeForce RTX 3050'}, 
//     {id: 10, name: 'GIGABYTE GAMING OC Radeon RX 6500 XT'}, 
//     {id: 11, name: 'MSI Mech Radeon RX 6500 XT'}, 
//     {id: 12, name: 'ASRock OC Formula Radeon RX 6900 XT'}, 
//     {id: 13, name: 'GIGABYTE Radeon RX 6700 XT'}, 
//     {id: 14, name: 'EVGA GeForce RTX 3080 FTW3'}, 
//     {id: 15, name: 'EVGA GeForce RTX 3080 Ti FTW3'},];
  
// const PRODUCT_DATA = [
//     {id: 0, name: CPU_DATA}, {id: 1, name: GPU_DATA}, {id: 2, name: []}, {id: 3, name: []}, 
//     {id: 4, name: []}, {id: 5, name: []}, {id: 6, name: []}, {id: 7, name: []},
// ]


// User's added items. Can be used for later screens.
const currShoppingList = new Set();

// Component for different product categories in the horizontal flatlist
// https://reactnative.dev/docs/flatlist -- see the selectable example
const Category = ( props ) => {
    return (
        <TouchableOpacity
        style={[styles.categoryButton, {backgroundColor: props.item.id === props.state ? 'lightcoral' : 'orange'}]}
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
                style={[styles.productTile, {backgroundColor: currShoppingList.has(this.item) ? 'orange' : 'white'}]}
                onPress={this.toggleProduct}
            >   
                <Image
                    source={{uri: this.item.image_url}}
                    style={styles.productImg}
                />
                <Text style={styles.productInfo}>{this.item.product_name}</Text>
            </TouchableOpacity>
        );
    }
}

const CreateListScreen = ({navigation}) => {
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [canContinue, setCanContinue] = useState(false);

    const [categories, setCategories] = useState([]);
    const [wholeList, setWholeList] = useState([        // the initial states here looks kind of ugly, but functional
        {id: 0, name: [], category: 'CPU'},             // I could probably abstrate it more later on 
        {id: 1, name: [], category: 'GPU'}, 
        {id: 2, name: [], category: 'Motherboard'}, 
        {id: 3, name: [], category: 'PSU'}, 
        {id: 4, name: [], category: 'PC Cooling'}, 
        {id: 5, name: [], category: 'Memory'}, 
        {id: 6, name: [], category: 'Storage'}, 
        {id: 7, name: [], category: 'Monitor'},
    ]
);

    // dynamically update data for the product flatlist
    useEffect(() => {
        const productRef = collection(db, 'products');
        const unsubscribe = onSnapshot(productRef, (productSnap) => {
            var product_data_experimental = [
                {id: 0, name: [], category: 'CPU'}, 
                {id: 1, name: [], category: 'GPU'}, 
                {id: 2, name: [], category: 'Motherboard'}, 
                {id: 3, name: [], category: 'PSU'}, 
                {id: 4, name: [], category: 'PC Cooling'}, 
                {id: 5, name: [], category: 'Memory'}, 
                {id: 6, name: [], category: 'Storage'}, 
                {id: 7, name: [], category: 'Monitor'},
            ]
    
            productSnap.forEach((doc) => {
            var object = doc.data();
            const rightCategory = product_data_experimental.find(item => item.category === object['categories']['type']);
            
            if(rightCategory){
                rightCategory.name.push(object);
            }
            }); 
            setWholeList(product_data_experimental)
        })
        return () => unsubscribe;
    }, []);

    // dynamically update data for the category flatlist 
    useEffect(() => {
        const categoryRef = collection(db, 'categories');
        const unsubscribe = onSnapshot(categoryRef, (categorySnap) => {
            const categories = [];
            categorySnap.forEach((doc) => {
                categories.push(doc.data());
            });
            setCategories(categories);
        });
        return () => unsubscribe();
    }, []);

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
        var cartItems = [];

        // get shopping cart items
        try {
            const data = await AsyncStorage.getItem('@storage_Key');
            if(data !== null) {
                var jsonObject = JSON.parse(data);
                jsonObject.forEach(function(item){
                    cartItems.push(item);
                });
            }
        } catch(error) {
            console.log(error);
        }

        // add new items to shopping cart
        try {
            currShoppingList.forEach(async function(product) {
                const found = cartItems.find(x => x.product_id === product.product_id);
                if(found == undefined){
                    product.quantity = 1;
                    cartItems.push(product);
                }
            });

            await AsyncStorage.setItem('@storage_Key', JSON.stringify(cartItems));
        } catch (error) {
            console.log(error);
        }
        
        navigation.navigate('CurrentList');
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.categoryContainer}>
                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={item => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={styles.productContainer}>
                <FlatList
                    data={wholeList[selectedCategory]['name']}
                    renderItem={renderProduct}
                    keyExtractor={item => item.product_id}
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
    continueButton: {
        borderRadius: 10,
        width: '30%',
        padding: 10,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImg: {
        width: 150,
        height: 150,
    },
    productInfo: {
        flexWrap: 'wrap',
        flex: 1,
        textAlign: 'center'
    },
});