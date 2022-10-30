import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { collection, query, where, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';


const SelectStore = () => {

  // testing CRUD methods, structuring the db based on Andrew's design

  // CREATE - add products, based on user's input later on...
  setProducts = async () => {
    const productRef = collection(firestore, 'products');
    await setDoc(doc(productRef, 'some_document_id'), {
      categories: {type: "CPU", brand: "Intel"},
      product_id: 987165,
      product_name: 'Intel Core i7-12700K',
      stores_carrying: {112233: 550},
    });
  }


  // READ - get all products by category
  getProducts = async () => {
    const productRef = collection(db, 'products');
    const productQuery = query(productRef, where(`categories.type`, '==', 'CPU'));
    const productSnap = await getDocs(productQuery);

    productSnap.forEach((doc) => {
      var object = doc.data();
      var product_name = object['product_name'];
      console.log(product_name);
    });
  }
  
  // DELETE
  deleteProducts = async () => {
    await deleteDoc(doc(db, 'products', 'some_document_id'));
  }



  return (
    <View style={styles.mainContainer}>

      {/* <Button
        // onPress={() => deleteProducts()}
        title='Select Store'
      >
      </Button> */}
    </View>
  )
}

export default SelectStore

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})