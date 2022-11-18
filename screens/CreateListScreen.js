import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, TouchableOpacity, View, FlatList, Image, ImageBackground, Modal, TextInput, } from 'react-native'
import Stars from 'react-native-stars';
import styles from '../Styles'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconA5 from 'react-native-vector-icons/Fontisto';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, getDocs, doc, setDoc, updateDoc, increment, where, query } from "firebase/firestore";
import { db } from '../firebase';
import * as SecureStore from 'expo-secure-store';

// User's added items. Can be used for later screens.
const currShoppingList = new Set();

// Component for different product categories in the horizontal flatlist
const Category = ( props ) => {
    return (
        <TouchableOpacity
        style={[styles.centerItems, styles.categoryButton, {backgroundColor: props.item.id === props.state ? 'orange' : '#202020', }]}
        onPress={() => props.setState(props.item.id)}
        activeOpacity={1}
        >
        <Text style={[styles.shadow, styles.lightText, props.item.id === props.state ? styles.darkText : styles.lightText]}>{props.item.name}</Text>
        </TouchableOpacity>
    );
};

class ExistingReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
            disliked: false,
        }
    }

    likeProduct = async (review) => {
        const reviewId = review.review_id;
        const productRef = doc(db, 'reviews', reviewId);
        let value = -1;


        if(this.state.liked === false) {
            value = 1;
        }

        if(this.state.disliked !== true) {
            await updateDoc(productRef, {
                likes: increment(value)
            });
            this.setState({ liked: !this.state.liked })
        }
    }

    dislikeProduct = async (review) => {
        const reviewId = review.review_id;
        const productRef = doc(db, 'reviews', reviewId);
        let value = 1;

        if(this.state.disliked === true) {
            value = -1;
        }

        if(this.state.liked !== true) {
            await updateDoc(productRef, {
                dislikes: increment(value)
            });
            this.setState({ disliked: !this.state.disliked })
        }
    }

    render() {
        let stars = [];
        let rounding = Math.floor(this.props.item.rating);
        let date = this.props.item.date.toDate();

        let year = date.getFullYear()
        let month = date.getMonth() + 1;
        let day = date.getDate();
            
        for(let i=0; i < rounding; i++) {
            stars.push(
                <IconA5 name='star' size={13} style={{color: 'gold',}} key={this.props.item.product_id+i}></IconA5>
            );
        }

        if(this.props.item.rating - rounding > 0) {
            stars.push(
                <IconA5 name='star-half' size={13} style={{color: 'gold'}} key={this.props.item.product_id+rounding}></IconA5>
            );
        }

        return (
            <View style={[styles.isColumn, styles.windowsWidth, {padding: 20, backgroundColor: '',}]}>

                <View style={[styles.isRow, styles.verticalSpacer, {flex: 1, justifyContent: 'space-between'}]}>
                    <View style={[styles.isRow,]}>
                        {stars}
                        <Text style={[styles.horizontalSpacer, styles.boldMediumBlack,]}>{this.props.item.title}</Text>
                    </View>
                    <View>
                        <Text style={[styles.shadow, ]}>{month}/{day}/{year}</Text>
                    </View>
                </View>
                <View style={[styles.centerItems, {flex: 9}]}>
                    <Text>{this.props.item.content}</Text>
                </View>
                <View style={[styles.isRow, styles.horizontalSpacer, {justifyContent: 'flex-end'}]}>
                    <TouchableOpacity style={styles.isRow} onPress={() => this.likeProduct(this.props.item)}>
                        <Text style={[styles.shadow, {color: this.state.liked ? 'blue' : 'black'}]}>{this.props.item.likes}</Text>
                        <Ionicons name={'heart'} size={20} style={{color: this.state.liked ? 'red' : 'lightgray'}}></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.isRow, styles.horizontalSpacer]} onPress={() => this.dislikeProduct(this.props.item)}>
                        <Text style={[styles.shadow, {color: this.state.disliked ? 'blue' : 'black'}]}>{this.props.item.dislikes}</Text>
                        <Ionicons name={'heart-dislike'} size={20} style={{color: this.state.disliked ? 'red' : 'lightgray'}}></Ionicons>
                    </TouchableOpacity>
                </View>
            </View>
          );
    }
}

// Component for list of products in the vertical flatlist
class Product extends React.Component {
    constructor(props) {
        super(props);
        this.continue = props.continue
        this.item = props.item;
        this.state = {
            selected: false,
            showModal: false,
            showReviews: false,
            reviews: 'reviews' in props.item ? props.item.reviews : [],
            liked: false,
            disliked: false,
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

    likeProduct = async (review) => {
        const reviewId = review.review_id;
        const productRef = doc(db, 'reviews', reviewId);
        let value = -1;


        if(this.state.liked === false) {
            value = 1;
        }

        if(this.state.disliked !== true) {
            await updateDoc(productRef, {
                likes: increment(value)
            });
            this.setState({ liked: !this.state.liked })
        }
    }

    dislikeProduct = async (review) => {
        const reviewId = review.review_id;
        const productRef = doc(db, 'reviews', reviewId);
        let value = 1;


        if(this.state.disliked === false) {
            value = -1;
        }

        if(this.state.liked !== true) {
            await updateDoc(productRef, {
                dislikes: increment(value)
            });
            this.setState({ disliked: !this.state.disliked })
        }
    }

    renderReviews = ({ item }) => {
        return (
            <ExistingReview item={item}></ExistingReview>
          );
    }

    // experimental, this function probably not necessary, remove in future
    getReviews = () => {
        if(this.state.reviews == undefined || this.state.reviews.length == 0) {
            return null;
        }
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.setState({showReviews: !this.state.showReviews})}
                >
                    <Text style={[styles.shadow, styles.productInfo, {color: 'mediumblue', fontSize: 14}]}>({this.state.reviews.length})</Text>
                </TouchableOpacity>
                <Modal
                    animationType='fade'
                    transparent={false}
                    visible={this.state.showReviews}
                >
                    <View style={styles.centerItems}>
                        <View style={[styles.centerItems, {width: '100%'}]}>
                            <FlatList
                                data={this.state.reviews}
                                renderItem={this.renderReviews}
                                keyExtractor={(item) => item.review_id}
                                vertical={true}
                                showsHorizontalScrollIndicator={false}
                            />
                            <TouchableOpacity
                                style={[styles.whiteBtn, styles.grayBtn,]}
                                onPress={() => this.setState({showReviews: !this.state.showReviews})}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                
                </Modal>
            </View>
        );
    }

    assignReviews = async () => {
        let reviews = [];
        const reviewsQuery = query(collection(db, 'reviews'), where('product_id', '==', this.item.product_id));
        const unsubscribe = onSnapshot(reviewsQuery, (querySnapshot) => {
            const reviews = [];
            querySnapshot.forEach((doc) => {
                if(doc.data().product_id === this.item.product_id){
                    reviews.push(doc.data());
                }
            });
            this.setState({reviews: reviews});
        });
    }

    getRatings = () => {
        var totalRating = 0;
        if(this.state.reviews == undefined) {
            return null;
        }

        this.state.reviews.forEach(review => {
            totalRating += review.rating;
        });

        if(totalRating > 0) {
            let stars = [];
            let averageRating = totalRating / this.state.reviews.length;
            let rounding = Math.floor(averageRating);
            
            for(let i=0; i < rounding; i++) {
                stars.push(
                    <IconA5 name='star' size={13} style={{color: 'gold',}} key={this.item.product_id+i}></IconA5>
                );
            }

            if(5 % averageRating > 0) {
                stars.push(
                    <IconA5 name='star-half' size={13} style={{color: 'gold'}} key={this.item.product_id+rounding}></IconA5>
                );
            }
            return stars;
        }
    }

    getItemStocks = () => {
        let stockStatus;
        let statusColor;

        if(this.item.stores_carrying.length > 0) {
            stockStatus = 'In Stock.';
            statusColor = 'green';
        } else {
            stockStatus = 'Out of Stock.';
            statusColor = 'red';
        }
        return <Text style={[styles.shadow, styles.productInfo, {color: statusColor}]}>{stockStatus}</Text>
    }

    writeReview = () => {
        // return <Review userID={this.props.userID} productID={this.item.product_id}></Review>
        // navigation.navigate('CurrentList', {storageKey: '@storage_Key1', userId: userID});
        this.props.navigation.navigate('Review', {userID: this.props.userID, productID: this.item.product_id});
    }

    // allow user to continue to 'CurrentList' screen, only when > 1 product is selected.
    async componentDidUpdate() {
        if(currShoppingList.size > 0) {
            this.continue(true);
        } else {
            this.continue(false);
        }
    }

    componentDidMount() {
        this.assignReviews();
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.productTile, {padding: 10, backgroundColor: currShoppingList.has(this.item) ? 'orange' : 'white'}]}
                onPress={this.toggleProduct}
            >   
                <ImageBackground
                    source={{uri: this.item.image_url}}
                    style={[styles.productImg, {flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}]}
                >
                    <TouchableOpacity
                        onPress={() => this.setState({showModal: !this.state.showModal})}
                    >
                        <MCIcon 
                            name='magnify' 
                            size={20} 
                            style={{color: '#202020',}}
                        >
                        </MCIcon>
                        <View>
                            <Modal
                                animationType='fade'
                                transparent={true}              // we can set this to 'false', and it'll seem like a new screen
                                visible={this.state.showModal}
                                onRequestClose={() => this.setState({showModal: !this.state.showModal})}
                            >
                                <TouchableOpacity 
                                    onPress={() => this.setState({showModal: !this.state.showModal})}
                                    activeOpacity={0}
                                    style={[styles.centerItems, ]}
                                >
                                <View style={{borderWidth: 3, borderColor: 'orange', borderRadius: 20, padding: 5, backgroundColor: 'white'}}>
                                    <Image
                                        source={{uri: this.item.image_url}}
                                        style={[styles.productImgLg]}
                                    />
                                </View>
                                </TouchableOpacity>
                            </Modal>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 50}}>
                        <Text style={[styles.shadow, styles.boldMediumBlack, styles.productName, {marginVertical: 0}]}>{this.item.product_name}</Text>
                        <View style={[styles.isRow, styles.centerItems, {flex: 0}]}>
                            {this.getRatings()}{this.getReviews()}
                        </View>
                        <TouchableOpacity
                            onPress={() => this.writeReview()}
                        >
                            <Text style={[styles.shadow, styles.interactable, styles.horizontalSpacer]}>
                                Write a review
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={[{marginVertical: 12}]}>
                        {this.getItemStocks()}
                    </View> */}
                    <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',}}>
                        {this.item.tag.map((tag, index) => {
                            return (
                                <Tags 
                                    item={this.item} 
                                    category={this.props.category} 
                                    products={this.props.products}
                                    productList={this.props.productList}
                                    tag={this.props.item.tag[index]}
                                    tags={this.props.tags}
                                    setTags={this.props.setTags}
                                    key={`${this.item.product_id}`+index}
                                    remove={false}
                                    setSelectedCategory={this.props.setSelectedCategory}
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
            category.name.forEach(product => {
                if(product.tag.includes(this.props.tag)) {
                    newProducts.add(product);
                }
            })
        });
        let productArray = Array.from(newProducts);
        currProducts[0].name = productArray;
        this.props.products(currProducts);
        this.props.setSelectedCategory(0);
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
                        category.name.forEach(product => {
                            if(product.tags.includes(tag)) {
                                newProducts.add(product);
                            }
                        })
                    })
                }
            });
        } else {
            this.props.productList.slice(1).forEach(category => {
                category.name.forEach(product => newProducts.add(product));
            });
        }
        let productArray = Array.from(newProducts);
        currProducts[0].name = productArray;
        this.props.products(currProducts);
    }

    render() {
        let closeIcon;
        if(this.remove) {
            closeIcon = <Ionicons name={'close-outline'} size={18}/>
        } else {
            closeIcon = null;
        }
        return(
            <TouchableOpacity 
                style={styles.tag}
                onPress={() => this.remove ? this.removeTags() : this.addTags()}

            >
                <Text>{this.props.tag}</Text>
                {closeIcon}
            </TouchableOpacity>
        );
    }
}

const CreateListScreen = ({navigation}) => {
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [canContinue, setCanContinue] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [userID, setUserID] = useState (null);

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
            const rightCategory = product_data_experimental.find(item => item.category === object.categories.type);
            product_data_experimental[0].name.push(object);
            
            if(rightCategory){
                rightCategory.name.push(object);
            }
            }); 
            setWholeList(product_data_experimental)
        });
        return () => unsubscribe;
    }, []);

    useEffect(() => {
        //uses expo securestore uid saved from DashBoard Screen during auth change
        const getUserID = async () => {
            try {
                const result = await SecureStore.getItemAsync('uid');
                if (result) {
                    setUserID(result)
                }
            } catch(error) {
                console.log(error);
            }
        }
        getUserID();
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
                setSelectedCategory={setSelectedCategory}
                userID={userID}
                navigation={navigation}
            />
        );
    };

    const navigateToCurrentList = async () => {
        var cartItems = [];
        // get shopping cart items
        try {
            const data = await AsyncStorage.getItem('@storage_Key1');
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
            await AsyncStorage.setItem('@storage_Key1', JSON.stringify(cartItems));
        } catch (error) {
            console.log(error);
        }
        navigation.navigate('CurrentList', {storageKey: '@storage_Key1', userId: userID});
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
        <View style={[styles.centerItems, {marginTop: 40}]}>
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
            <View style={[styles.centerItems, styles.productContainer]}>
                <FlatList
                    data={wholeList[selectedCategory].name}
                    renderItem={renderProduct}
                    keyExtractor={item => item.product_id}
                />
            </View>
            <View style={[styles.centerItems, styles.continueButton, {backgroundColor: canContinue ? 'orange' : 'lightgray'}]}>
                <TouchableOpacity
                    onPress={() => navigateToCurrentList()}
                    disabled={canContinue ? false : true}
                >
                    <Text>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default CreateListScreen