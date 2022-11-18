import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, TouchableOpacity, View, FlatList, Image, Modal, TextInput} from 'react-native'
import styles from '../Styles'
import { Formik } from 'formik';
import ModalDropdown from 'react-native-modal-dropdown';
import IconA5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, onSnapshot, addDoc, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import * as SecureStore from 'expo-secure-store';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';


class Product extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.storageKey = props.storageKey;
        this.storeData = props.item.stores_carrying.sort((store1, store2) => store1.price - store2.price)
        this.state = {
            quantity: props.item.quantity,
            showModal: false,
            selectedStore: 'selectedStore' in props.item ? props.item.selectedStore : 'Select Store',
            price: 'price' in props.item ? props.item.price : '- - -',
            prevPrice: '',
            cheapestPrice: 'cheapestPrice' in props.item ? props.item.cheapestPrice : '',
            onSale: false,
        };
    }

    updateQuantity = (quantity) => {
        this.setState({quantity: quantity});
        this.updateData();
    }

    setShowModal = (show) => {
        this.setState({showModal: show});
      }

    checkOnSale = (store) => {
        if(store.on_sale) {
            this.setState({onSale: true});
            this.setState({prevPrice: store.prev_price});

        } else {
            this.setState({onSale: false});
        }
    }

    selectStore = (store) => {
        this.checkOnSale(store);

        this.setState({selectedStore: store.store_name});
        this.setState({price: '$' + store.price});
        this.setShowModal(!this.state.showModal);

        if(store.store_id == this.storeData[0].store_id) {
            this.setState({cheapestPrice: 'Best Deal'});
        } else {
            this.setState({cheapestPrice: 'Fair Price'});
        }

        this.updateData();
    }

    showPrevPrice = () => {
        if(this.state.onSale) {
            return <Text style={[styles.shadow, {textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: 'gray'}]}>${this.state.prevPrice}</Text>
        }
        return null;
    }

    showDiscount = () => {
        if(this.state.onSale) {
            let discount = ((1 - (this.state.price.slice(1)/this.state.prevPrice)) * 100).toFixed(2);
            let dollars = this.state.prevPrice - this.state.price.slice(1);
            return (
                <View style={{flexDirection: 'column'}}>
                    <Text style={[styles.shadow, styles.discount, {textAlign: 'center', color: 'green'}]}>On sale!</Text>
                    <Text style={[styles.shadow, styles.discount, {textAlign: 'center', color: 'green'}]}>Save ${dollars} (-{discount}%) </Text>
                </View>
            );
        }
        return null;
        
    }

    updateData = async () => {
        var json;

        try {
            // save current state to an array
            const data = await AsyncStorage.getItem(this.storageKey);

            if(data !== null) {
                json = JSON.parse(data);

                var item = json.find(item => item.product_id === this.item.product_id);
                item.quantity = this.state.quantity;
                item.selectedStore = this.state.selectedStore;
                item.price = this.state.price;
                item.cheapestPrice = this.state.cheapestPrice;
                
                if(item.quantity < 1) {
                    const index = json.indexOf(item);
                    json.splice(index, 1);
                }
            }
            // replace previous states with updated states
            await AsyncStorage.setItem(this.storageKey, JSON.stringify(json));
            
        } catch(error) {
            console.log(error);
        }
    }

    renderStore = (store) => {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.selectStore(store.item)}
                    style={[styles.whiteBtn, styles.orangeBtn]}
                >
                    <View style={styles.storeSpacing}>
                        <View style={styles.allAroundSpacer}>
                            <Text>{store.item.store_name}</Text>
                        </View>
                        <View style={styles.allAroundSpacer}>
                            <Text>${store.item.price}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        let dealIcon;
        if(this.state.cheapestPrice == 'Best Deal') {
            dealIcon = <IconA5 name='fire-alt' size={15} style={{color: 'red'}}></IconA5>;
        } else {
            dealIcon = <View></View>
        }

        return this.state.quantity < 1 ? null : (
            <View style={[styles.productTile, ]}>
                <View style={[styles.isColumn, styles.centerItems]}>
                    <Image
                        source={{uri: this.item.image_url}}
                        style={styles.productImg}
                    />
                    <View style={[styles.isRow, styles.verticalSpacer, {flex: 1}]}>
                        <View style={[styles.whiteBtn, styles.isRow]}
                        >
                            <Text style={[styles.shadow, styles.boldMediumWhite, styles.customQtyBtn]}>Qty: </Text>
                            <ModalDropdown
                                options={['0 (Delete)', '1', '2', '3', '4', '5']}
                                animated={true}
                                defaultValue={String(this.state.quantity)}
                                textStyle={[styles.shadow, styles.interactable, {fontSize: 15, marginRight: 10}]}
                                dropdownStyle={styles.dropDownMenu}
                                dropdownTextStyle={[styles.boldMediumBlack, {fontSize: 12}]}
                                showsVerticalScrollIndicator={false}
                                onSelect={(value) => this.updateQuantity(value)}
                            >
                            </ModalDropdown>
                        </View>

                        <View style={styles.whiteBtn}>
                            <TouchableOpacity
                            >
                                <Ionicons
                                    name='trash-outline' 
                                    size={20}
                                    style={[styles.shadow, styles.horizontalSpacer, {color: 'gray',}]}
                                    onPress={() => this.updateQuantity(0)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                
                <View style={[styles.isColumn, styles.centerItems, {marginRight: 5}]}>
                    <View>
                        <View style={[styles.centerItems, {flex: 5}, {flexDirection: 'column', justifyContent: 'space-evenly'}]}>
                            <Text style={[styles.productName, styles.shadow]}>{this.item.product_name}</Text>
                            <View style={[styles.isRow, styles.centerItems, styles.dealsView, 
                                        {backgroundColor: this.state.cheapestPrice == 'Best Deal' ? 'orange' : '', width: 120}]}>
                                {dealIcon}
                                <Text style={[styles.boldMediumWhite, styles.horizontalSpacer]}>{this.state.cheapestPrice}</Text>
                                {dealIcon}
                            </View>
                            <View styles={{flex: 1}}>
                                {this.showDiscount()}
                            </View>
                        </View>


                        <View style={[styles.isRow, styles.centerItems, styles.verticalSpacer,]}>
                            <TouchableOpacity
                                style={styles.whiteBtn}
                                onPress={() => this.setShowModal(!this.state.showModal)}
                            >
                                <Text style={[styles.shadow, styles.interactable]}>{this.state.selectedStore}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={true}
                                style={[styles.whiteBtn, styles.isRow]}
                            >
                                <Text style={[styles.shadow, styles.horizontalSpacer]}>{this.state.price}</Text>
                                {this.showPrevPrice()}

                            </TouchableOpacity>

                        </View>
                    </View>

                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.showModal}
                        onRequestClose={() => this.setShowModal(!this.state.showModal)}
                    >
                        <TouchableOpacity 
                            onPress={() => this.setShowModal(!this.state.showModal)}
                            activeOpacity={0}
                            style={[styles.centerItems, ]}
                        >
                            <View>
                                <View
                                    style={[styles.orangeBtn, styles.storeModalTitle]}
                                >
                                    <Text style={[styles.shadow, styles.boldMediumWhite]}
                                    >Select a store:</Text>
                                </View>
                                <FlatList
                                    data={this.storeData}
                                    renderItem={this.renderStore}
                                    keyExtractor={store => store.store_id}
                                    style={[styles.whiteBtn, styles.selectStoreList]}
                                >
                                </FlatList>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </View>
        );
    }
}

const CurrentListScreen = ({ route, navigation }) => {
    // product list from async storage (e.g., products the user selected from previous screen)
    const [data, setData] = useState([]);
    const [userID, setUserID] = useState (null);
    const [showModal, setShowModal] = useState(false);
    const {storageKey} = route.params;
    const [allStores, setAllStores] = useState([]);

    // get all existing stores from db
    useEffect(() => {
        const storeRef = collection(db, 'stores');
        const unsubscribe = onSnapshot(storeRef, (storeSnap) => {
            const stores = [];
            storeSnap.forEach((doc) => {
              stores.push(doc.data());
            });
            setAllStores(stores);
            // console.log(stores);
        });
        return () => unsubscribe();
      }, []);

    const findStores = (product) => {
        product.stores_carrying.forEach(store => {
            allStores.forEach(storeAll => {
                if(store.store_id === storeAll.store_id) {
                    store.store_name = storeAll.store_name;
                }
            });
        })
        return product;
    }
   
    const renderProduct = ({ item }) => {
        return (
        <Product 
            item={findStores(item)}
            storageKey={storageKey}
            data={data}
            setData={setData}
            stores={allStores}
        />
        );
    };


    //Form Submission to DB fn
    const submitToDatabase = (fieldValue) =>{
        var passingData = {data}
        var passingUser = {userID}
        //console.log(passingUser)
        var formattedProdId = []
        passingData['data'].forEach((product) => {
            formattedProdId.push(product['product_id']);
        });
        //console.log(formattedProdId)
        
        const docRef = addDoc(collection(db,'saved_lists'),{
            list_name: fieldValue['listName'],
            product_array: formattedProdId,
            user_id: passingUser['userID']
         
        })
    }
    // update product list (data), whenever it is ready from async storage
    useEffect(() => {
        const getData = async () => {
            try {
                const data = await AsyncStorage.getItem(storageKey)
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

    useEffect(() => {
        //uses expo securestore uid saved from DashBoard Screen during auth change
        const getUserID = async () => {
            try {
                const result = await SecureStore.getItemAsync('uid');
                if (result) {
                    //console.log(' uid retrieved')
                    setUserID(result)
                    
                } else {

                    console.log('no key exists')
                }
            } catch(error) {
                console.log(error);
            }
        }
        getUserID();
    }, []);

    return (
        <View style={[styles.centerItems, {marginTop: 40}]}>
            <View style={[styles.centerItems, styles.productContainer]}>
                <FlatList
                    data={data}
                    renderItem={renderProduct}
                    keyExtractor={item => item.product_id}
                />
            </View>
            <View style={[styles.whiteBtn, styles.orangeBtn, styles.centerItems, styles.checkoutButton,]}>
                <TouchableOpacity
                    // onPress={}      // can navigate to 'checkout' if we want to.
                >
                    <Text>Checkout</Text>
                </TouchableOpacity>
            </View>

            {/*reference: https://reactnative.dev/docs/modal */}
            <Modal
                animationType='fade'
                transparent={true}              // we can set this to 'false', and it'll seem like a new screen
                visible={showModal}
                onRequestClose={() => {
                    setShowModal(!showModal);
                }}
            >
                <View style={styles.centerItems}>
                    <View style={[styles.whiteBtn, styles.mediumPadding]}>
                        <Text style={styles.boldMediumBlack}>Save new list as: </Text>
                        
                        <Formik
                            initialValues={{listName: ''}}
                            onSubmit={(fieldValue, actions) => {
                                // A function that'll send the named list to DB
                                submitToDatabase(fieldValue)
                                setShowModal(!showModal)
                                actions.resetForm();
                            }}
                        >
                            {(formikProps) => (
                                <View>
                                    <TextInput
                                        placeholder='Enter a name...'
                                        value={formikProps.values.listName}
                                        onChangeText={formikProps.handleChange('listName')}
                                        style={[styles.whiteBtn, styles.verticalSpacer]}
                                    />
                                    <View style={styles.isRow}>
                                        <TouchableOpacity
                                            style={[styles.whiteBtn, styles.grayBtn,]}
                                            onPress={() => setShowModal(!showModal)}
                                        >
                                            <Text>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.whiteBtn, styles.orangeBtn,]}
                                            onPress={formikProps.handleSubmit}
                                        >
                                            <Text>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                        </Formik>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                style={styles.allAroundSpacer}
                onPress={() => setShowModal(true)}
            >
                <View style={styles.isRow}>
                    <Ionicons name='bookmark' size={20} style={{color: 'blue'}}></Ionicons>
                    <Text style={[styles.boldMediumWhite, styles.interactable]}>Save for later</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default CurrentListScreen