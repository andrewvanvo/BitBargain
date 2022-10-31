import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { array } from 'yup';
import { collection, query, where, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';

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
                <View style={{flex: 1}}>
                    <Text style={styles.productInfo}>{this.item.product_name}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                        {this.item.tags.map((tag, index) => {
                            return (
                                <Tags 
                                    item={this.item} 
                                    category={this.props.category} 
                                    products={this.props.products}
                                    productList={this.props.productList}
                                    tag={this.props.item.tags[index]}
                                    tags={this.props.tags}
                                    setTags={this.props.setTags}
                                    key={`${this.item.product_id}`+index}
                                    remove={false}
                                >
                                </Tags>
                            )
                        })}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

class Tags extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item
        this.remove = props.remove
        this.productCopy = props.copy;
    }

    addTags = () => {

        let newProducts = new Set();
        let currProducts = this.props.productList;

        if(!(this.props.tags.includes(this.props.tag))) {
            this.props.setTags(prevState => [...prevState, this.props.tag]);
        }

        currProducts.slice(1).forEach(category => {
            category['name'].forEach(product => {
                if(product['tags'].includes(this.props.tag)) {
                    newProducts.add(product);
                }
            })
        });

        let productArray = Array.from(newProducts);
        currProducts[0]['name'] = productArray;

        this.props.products(currProducts);
    }

    removeTags = () => {

        let newProducts = new Set();
        let currProducts = this.props.productList;

        if(this.props.tags.includes(this.props.tag)) {
            let newTags = this.props.tags.filter(tag => tag != this.props.tag);
            this.props.setTags(newTags);
        }

        if(this.props.tags.length > 1) {
            this.props.tags.forEach(tag => {
                if(tag != this.props.tag) {
                    this.props.productList.slice(1).forEach(category => {
                        category['name'].forEach(product => {
                            if(product['tags'].includes(tag)) {
                                newProducts.add(product);
                            }
                        })
                    })
                }
            });
        } else {
            this.props.productList.slice(1).forEach(category => {
                category['name'].forEach(product => newProducts.add(product));
            });
        }

        let productArray = Array.from(newProducts);
        currProducts[0]['name'] = productArray;

        this.props.products(currProducts);
    }

    render() {
        return(
            <TouchableOpacity 
                style={{backgroundColor: 'gold', margin: 2, padding: 3, borderRadius: 5, borderWidth: 1, borderColor: 'black'}}
                onPress={() => this.remove ? this.removeTags() : this.addTags()}
            >
                <Text>{this.props.tag}</Text>
            </TouchableOpacity>
        );
    }
}

const CreateListScreen = ({navigation}) => {
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [canContinue, setCanContinue] = useState(false);

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [wholeList, setWholeList] = useState([        // the initial states here looks kind of ugly, but functional
        {id: 0, name: [], category: 'All'},
        {id: 1, name: [], category: 'CPU'},             // I could probably abstrate it more later on 
        {id: 2, name: [], category: 'GPU'}, 
        {id: 3, name: [], category: 'Motherboard'}, 
        {id: 4, name: [], category: 'PSU'}, 
        {id: 5, name: [], category: 'PC Cooling'}, 
        {id: 6, name: [], category: 'Memory'}, 
        {id: 7, name: [], category: 'Storage'}, 
        {id: 8, name: [], category: 'Monitor'},
    ]
);

    // dynamically update data for the product flatlist
    useEffect(() => {
        const productRef = collection(db, 'products');
        const unsubscribe = onSnapshot(productRef, (productSnap) => {
            var product_data_experimental = [
                {id: 0, name: [], category: 'All'},
                {id: 1, name: [], category: 'CPU'}, 
                {id: 2, name: [], category: 'GPU'}, 
                {id: 3, name: [], category: 'Motherboard'}, 
                {id: 4, name: [], category: 'PSU'}, 
                {id: 5, name: [], category: 'PC Cooling'}, 
                {id: 6, name: [], category: 'Memory'}, 
                {id: 7, name: [], category: 'Storage'}, 
                {id: 8, name: [], category: 'Monitor'},
            ]
    
            productSnap.forEach((doc) => {
            var object = doc.data();
  
            const rightCategory = product_data_experimental.find(item => item.category === object['categories']['type']);

            product_data_experimental[0].name.push(object);
            
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
                category={setCategories}
                productList={wholeList}
                products={setWholeList}
                tags={tags}
                setTags={setTags}
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

    var tagContainer = [];

    if(selectedCategory == 0) {
        tagContainer.push(
            tags.map((tag, index) => {
              return (
                <Tags 
                    tag={tags[index]}
                    tags={tags}
                    setTags={setTags} 
                    key={index}
                    remove={true}
                    products={setWholeList}
                    productList={wholeList}
                >
                </Tags>
              )  
            })
        );
    }

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
            <View style={{flexDirection: 'row'}}>
                {tagContainer}
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
        flex: 1,
        width: 150,
        height: 150,
        margin: 5,
    },
    productInfo: {
        flex: 1,
        flexWrap: 'wrap',
        textAlign: 'center',
    },
});