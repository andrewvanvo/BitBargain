import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import Tags from "react-native-tags";
import { collection } from "firebase/firestore";

// import is tentative (I just used one of my existing firebase to play around with; 
// import might change depending how the fb config is going be setup)
import { auth, db } from '../firebase';
import {  doc, addDoc, getDoc } from 'firebase/firestore';


const AddProductScreen = ( {navigation} ) => {


    const [tags, settags] = useState("");
    const [Product_name, setProduct_name] = useState("");
    const [Product_price, setProduct_price] = useState("");
    const [Brand, setBrand] = useState("");
    const [Type, setType] = useState("");
    const [Store, setStore] = useState("");

    const store_id = 'AC6Y6Rb7dSrscb2FBhPO';

    useEffect(()=>{
        const fetchData = async () => {
            const storeRef = doc(db, 'stores', store_id);
            const store = await getDoc(storeRef);
            if (!store.exists) {
                console.log('No such document!');
              } else {
                setStore(store.data().store_name + " at " + store.data().store_address);
              }
        }
        fetchData().catch(console.error);
    })
    // with the user's email/pw input, if valid, will submit to firebase auth to make an account.
    const handleAddProduct = async () => {

        // for the function below it requires the following parameters:
        // (auth: Auth, email: string, password: string)
        // for fname and lname, I think we can add those to the actual db later?
        try {
            const productRef = collection(db, "products");
            const data = {
                image_url: 'https://png.pngitem.com/pimgs/s/274-2748514_profile-icon-material-design-hd-png-download.png',
                // categories: values.categories,
                categories: {
                    brand: Brand,
                    type: Type
                },
                product_name: Product_name,
                product_id: productRef.id,
                // tags: values.tags,
                tag: tags,
                stores_carrying: { [store_id]: {
                    on_sale: true,
                    prev_price: Product_price,
                    price: Product_price,
                }}
        }
        // setDoc(doc(db, 'users', auth.currentUser.uid)   
            await addDoc(productRef, data)
            navigation.goBack();
        } catch (error) {
            console.log('Add product has an error!', error)
            return error.code;
        }
    };
    

    return (
        <View style={styles.mainContainer}>
            <View>                        
                <Text>Add a new product to {Store}</Text>
                <View>
                    <TextInput
                        placeholder='Brand...'
                        onChangeText={(brand) => setBrand(brand)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder='Type...'
                        onChangeText={(type) => setType(type)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder='Product Name...'
                        onChangeText={(pName) => setProduct_name(pName)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder='Prodcut Price...'
                        keyboardType='numeric'
                        onChangeText={(pPrice) => setProduct_price(pPrice)}
                        style={styles.inputField}                           
                    />
                    <View>
                        <Tags
                            initialText=""
                            textInputProps={{
                                placeholder: "Tags..."
                            }}
                            initialTags={[]}
                            onChangeTags={tags => settags(tags)}
                            containerStyle={styles.container}
                            inputStyle={styles.input}            
                            renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                            <TouchableOpacity key={`${tag}-${index}`} onPress={onPress} style={styles.tag}>
                                <Text style={styles.textTag}>{tag}</Text>
                            </TouchableOpacity>
                            )}
                        />
                    </View>
                    
                </View >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                        onPress={()=>{handleAddProduct()}}
                    >
                        <Text>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

export default AddProductScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    container: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start',
    },
    tag: {
        backgroundColor: '#2A5353',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    textTag: {
        textTransform: 'uppercase',
        color: '#EBEBEB',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#FFFFFF',
        color: '#606060',
        fontWeight: 'bold',
    },
    title: {
        fontWeight: 'bold',
        color: 'orange',
        fontSize: 16,
    },
    imageContainer: {
        flex: 1,
        marginTop: 10
    },
    productTile: {
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
    productImg: {
        flex: 1,
        aspectRatio: 1.2, 
        resizeMode: 'contain',
        margin: 10,
        borderColor: 'orange',
        borderWidth: 2,
        borderRadius: 10,
    },
    productInfo: {
        flex: 1,
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    inputField: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        textAlign: 'center',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    buttonContainer: {
        flex: 0.5,
        width: '70%',
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        borderRadius: 10,
        width: '45%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange'
    }
});