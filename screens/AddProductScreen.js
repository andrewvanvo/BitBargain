import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from 'react-native';
import Tags from "react-native-tags";
import Checkbox from 'expo-checkbox';
import { collection } from "firebase/firestore";

// import is tentative (I just used one of my existing firebase to play around with; 
// import might change depending how the fb config is going be setup)
import { app, auth, db } from '../firebase';
import {  doc, addDoc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, } from "firebase/storage";

const AddProductScreen = ( {route, navigation} ) => {

    const [tags, settags] = useState("");
    const [Product_name, setProduct_name] = useState("");
    const [Product_price, setProduct_price] = useState("");
    const [Brand, setBrand] = useState("");
    const [Type, setType] = useState("");
    const [Store, setStore] = useState("");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [isSelected, setSelection] = useState(false);

    // const store_id = route.params.store_id;
    const store_id = "AC6Y6Rb7dSrscb2FBhPO";

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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4,3],
        });
    
        handleImagePicked(result);
      };
      
    const handleImagePicked = async (result) => {
        try {
            setUploading(true);
            if (!result.cancelled){
                setImage(result);
            }
        }
        catch (e) {
            console.log(e);
            alert("Upload failed...");
        }
        finally {
            setUploading(false);
        }
    };

    const uploadImageAsync = async (uri) => {
        const filename = 'productPic/' + Product_name + store_id.toString();
        const storage = getStorage(app, "gs://final-capstone-db.appspot.com/");
        const storageRef = ref(storage, filename)
        const response = await fetch(uri);
        const blob = await response.blob();
        const uploadTask =  await uploadBytes(storageRef, blob)
            .then( async ()=>{
                return await getDownloadURL(storageRef)
                .then((url) => {
                    console.log(url);
                    return url;
                })
                .catch((error) => {
                    console.log(error)
                })
        })
        return uploadTask
    }
    
    // with the user's email/pw input, if valid, will submit to firebase auth to make an account.
    const handleAddProduct = async () => {

        // for the function below it requires the following parameters:
        // (auth: Auth, email: string, password: string)
        // for fname and lname, I think we can add those to the actual db later?
        try {
            const uploadUrl = await uploadImageAsync(image.uri);
            const productRef = collection(db, "products");
            
            const data = {
                image_url: uploadUrl,
                categories: {
                    brand: Brand,
                    type: Type
                },
                product_name: Product_name,
                // tags: values.tags,
                tag: tags,
                stores_carrying: { [store_id]: {
                    on_sale: isSelected,
                    prev_price: Product_price,
                    price: Product_price,
                }}
        }
            const res = await addDoc(productRef, data);
            await updateDoc(res, {product_id: res.id});
            navigation.goBack();
        } catch (error) {
            console.log('Add product has an error!', error)
            return error.code;
        }
    };
    

    return (
        <View style={styles.mainContainer}>
            <View>                        
                <Text style={{fontSize:16}}>Add a new product to {Store}</Text>

                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    <View style={styles.imageContainer}>
                        {image !== null ? (
                        <Image style={styles.image} source={{ uri: image.uri}} />
                        ) : (<Text style={styles.noImageText}> Pick A Image</Text>)}
                    </View>
                </TouchableOpacity>
                
                <View style={styles.textContainer}>
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
                    <View style={styles.checkboxContainer} >
                        <Checkbox 
                            value={isSelected}
                            onValueChange={(newValue) => setSelection(newValue)}
                            style={styles.checkbox}
                        />
                        <Text style={{fontSize: 16}}> On sale ?</Text>
                    </View>
                    
                    <View>
                        <Tags
                            initialText=""
                            textInputProps={{
                                placeholder: "Add Tags Here..."
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
                        <Text>Add</Text>
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
    textContainer: {
        flex: 1.5
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
    imageContainer: {
        flex: 1,
        paddingBottom: 10
    },
    checkboxContainer: {
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    checkbox: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        color: 'black'
    },
    image: {
        aspectRatio: 1.2, 
        resizeMode: 'contain',
        margin: 10,
        borderColor: 'orange',
        borderWidth: 2,
        borderRadius: 10,
    },
    noImageText:{
        textAlign: 'center',
        marginTop: 50,
        fontSize: 20,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
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