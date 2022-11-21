import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Modal, TextInput} from 'react-native'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';




class Product extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.storageKey = props.storageKey;
        this.state = {
            quantity: 1,
        };
    }
    addProduct = () => {
        this.setState({quantity: this.state.quantity + 1});
        this.updateData();
    }
    removeProduct = () => {
        this.setState({quantity: this.state.quantity - 1});
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
                item.quantity = 1;
                
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

const NamedListScreen = ({ route, navigation }) => {
    // product list from async storage (e.g., products the user selected from previous screen)
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { storageKey } = route.params;
    
    const renderProduct = ({ item }) => {
        return (
        <Product 
            item={item}
            storageKey={storageKey}
            data={data}
            setData={setData}
        />
        );
    };

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
                                //
                                // A function that'll send the named list to DB
                                // console.log(data);
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
        </View>
    );
}

export default NamedListScreen

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