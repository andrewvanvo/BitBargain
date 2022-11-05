import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Modal, TextInput} from 'react-native'
import { Formik } from 'formik';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, query, where, getDocs, setDoc, doc, onSnapshot, addDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

import * as SecureStore from 'expo-secure-store';



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
            cheapestPrice: 'cheapestPrice' in props.item ? props.item.cheapestPrice : '',
        };
    }

    updateQuantity = (quantity) => {
        this.setState({quantity: quantity});
        this.updateData();
    }

    setShowModal = (show) => {
        this.setState({showModal: show});
      }

    selectStore = (store) => {
        this.setState({selectedStore: store.store_name});
        this.setState({price: '$'+store.price});
        this.setShowModal(!this.state.showModal);

        if(store.store_id == this.storeData[0].store_id) {
            this.setState({cheapestPrice: 'Cheapest!'});
        } else {
            this.setState({cheapestPrice: 'Not cheapest'});
        }

        this.updateData();
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
                    style={{ backgroundColor: 'orange', borderRadius: 5, margin: 5, padding: 10}}
                >
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}}>
                        <View style={{margin: 5}}>
                            <Text>{store.item.store_name}</Text>
                        </View>
                        <View style={{margin: 5}}>
                            <Text>${store.item.price}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        // when user sets quantity below 0, that indicates to remove from the shopping list
        // will probably implement an alert/modal for this in the future.
        return this.state.quantity < 1 ? null : (
            <View style={[styles.productTile, ]}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: ''}}>
                    <Image
                        source={{uri: this.item.image_url}}
                        style={styles.productImg}
                    />
                    <View style={{flex: 1, flexDirection: 'row', marginVertical: 10,}}>
                        <View style={{flexDirection: 'row', borderRadius: 5, backgroundColor: 'white', padding: 5, 
                                        marginRight: 5, borderWidth: 1,  borderColor: 'orange', elevation: 2}}
                        >
                            <Text style={{fontSize: 15, fontWeight: 'bold', marginRight: 5, marginLeft: 10}}>Qty: </Text>
                            <ModalDropdown
                                options={['0 (Delete)', '1', '2', '3', '4', '5']}
                                animated={true}
                                defaultValue={String(this.state.quantity)}
                                style={{borderRadius: 5, backgroundColor: 'white',}}
                                textStyle={{fontSize: 15, fontWeight: 'bold', borderBottomWidth: 1, borderColor: 'blue', color: 'blue', marginRight: 10}}
                                dropdownStyle={{width: 60, borderColor: 'orange', borderWidth: 1}}
                                dropdownTextStyle={{textAlign: 'center'}}
                                showsVerticalScrollIndicator={false}
                                onSelect={(value) => this.updateQuantity(value)}
                            >
                            </ModalDropdown>
                        </View>

                        <View style={{borderRadius: 5, backgroundColor: 'white', padding: 5, 
                                        borderWidth: 1,  borderColor: 'gray', marginHorizontal: 5}}>
                            <TouchableOpacity
                            >
                                <Icon
                                    name='trash-outline' 
                                    size={20}
                                    style={{color: 'gray', marginHorizontal: 5}}
                                    onPress={() => this.updateQuantity(0)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                
                <View style={[styles.otherStuff, {backgroundColor: ''}]}>
                    <View>
                        <View style={[styles.productNameContainer, {backgroundColor: ''}]}>
                            <Text style={styles.productName}>{this.item.product_name}</Text>
                        </View>

                        <View>
                            <Text>{this.state.cheapestPrice}</Text>
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginVertical: 10, backgroundColor: ''}}>
                            <TouchableOpacity
                                style={{borderRadius: 5, backgroundColor: 'white', padding: 5, 
                                marginTop: 0, borderWidth: 1.5,  borderColor: 'orange', marginHorizontal: 5}}
                                onPress={() => this.setShowModal(!this.state.showModal)}
                            >
                                <Text>{this.state.selectedStore}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{borderRadius: 5, backgroundColor: 'white', padding: 5, borderColor: 'orange', borderWidth: 1.5, marginHorizontal: 5}}
                            >
                                <Text>{this.state.price}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.showModal}
                        onRequestClose={() => this.setShowModal(!this.state.showModal)}
                    >
                        <View style={styles.modalCenter}>

                            {/* <View style={{height: 50, flexGrow: 0, backgroundColor: 'white'}}> */}
                                <FlatList
                                    data={this.storeData}
                                    renderItem={this.renderStore}
                                    keyExtractor={store => store.store_id}
                                    style={{flexGrow: 0, backgroundColor: 'white', borderRadius: 5, padding: 10}}
                                >
                                </FlatList>

                        </View>
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
    // https://react-native-async-storage.github.io/async-storage/docs/usage/
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
                    // console.log('no key exists')
                }
            } catch(error) {
                console.log(error);
            }
        }
        getUserID();
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
            <View style={styles.checkoutButton}>
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
                <View style={styles.modalCenter}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Save new list as: </Text>
                        
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
                                        style={styles.inputField}
                                    />
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity
                                            style={[styles.button, styles.cancelBtn]}
                                            onPress={() => setShowModal(!showModal)}
                                        >
                                            <Text>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.button, styles.submitBtn]}
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
                style={{margin: 5}}
                onPress={() => setShowModal(true)}
            >
                <Text style={styles.textStyle}>Save for later</Text>
            </TouchableOpacity>
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
        width: '100%',
        height: 250,
        padding: 0,
        marginVertical: 8,
        borderColor: 'lightgray',
        borderWidth: 1,
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
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'notoserif',
        textShadowColor: 'black',
        textShadowRadius: 2, 
        
    },
    buttonContainer:{
        flexDirection: 'row',  
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: 'orange',
        width: '80%'

    },
    checkoutButton: {
        borderRadius: 10,
        width: '30%',
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange'
    },
    productImg: {
        width: 180,
        height: 180,
        marginTop:5 ,
        flex: 5,
    },
    otherStuff: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Save named list, modal
    modalCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        
      },
      modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'orange',
        borderWidth: 2,
        padding: 30,
        alignItems: 'center',
      },
      button: {
        borderRadius: 5,
        padding: 10,
        margin: 5,
      },
      cancelBtn: {
        backgroundColor: 'lightgray',
      },
      submitBtn: {
        backgroundColor: 'orange',
      },
      textStyle: {
        color: 'blue',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      modalText: {
        textAlign: 'center'
      },
      inputField: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'orange',
        borderWidth: 1,
        marginVertical: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
      },
});