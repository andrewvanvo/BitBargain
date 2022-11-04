import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Modal, TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { async } from '@firebase/util';

class Store extends React.Component {
  constructor(props) {
    super(props);
    this.item = props.item;
    this.store_id = props.item.store_id;
    this.store_name = props.item.store_name;
    this.storeProducts = props.productInfo.storeProducts;
    this.totalPrice = props.productInfo.totalPrice;
    this.state = {
      showModal: false,
    };
  }

  setShowModal = (show) => {
    this.setState({ showModal: show});
  }

  renderProducts = (product) => {
    return (
      <View
        style={[styles.productTile]}
      >
        <View style={{flex: 1}}>
          <Text>{product.item.productName}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text>${product.item.productPrice}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style={[styles.storeTile, {backgroundColor: this.store_id === this.props.state ? 'orange' : 'white'}]}
          onPress={() => this.props.setState(this.store_id)}
        >
          <View style={[styles.spacer,]}>
            <Text style={styles.text}>{this.store_name}</Text>
          </View>
          <View style={[styles.spacer,]}>
            <Text style={styles.text}>{this.totalPrice}</Text>
          </View>
          <TouchableOpacity>
            <Icon 
              name='ellipsis-horizontal' 
              size={30}
              style={styles.icons}
              onPress={() => this.setShowModal(!this.state.showModal)}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <Modal
          animationType='fade'
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.setShowModal(!this.state.showModal)}
          >
            <View style={styles.modalCenter}>
              <View style={[styles.modalContainer, {padding: 0, height: 400}]}>
                <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 10}}>{this.store_name}</Text>
                <View style={{flex: 15, backgroundColor: 'white', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                  <FlatList
                    data={this.storeProducts}
                    renderItem={this.renderProducts}
                    keyExtractor={product => product.productId}
                  >
                  </FlatList>
                </View>
                <TouchableOpacity
                    style={{flex: 1, borderRadius: 5, backgroundColor: 'orange', padding: 5, marginVertical: 15}}
                    onPress={() => this.setShowModal(!this.state.showModal)}
                >
                    <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>

        </Modal>
      </View>
    );
  }
}

const SelectStore = ({ route, navigation }) => {

  const { storageKey } = route.params;
  const [data, setData] = useState([]);
  const [allStores, setAllStores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);


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


  // get list of selected products that were stored in AsyncStorage
  useEffect(() => {
    const getData = async () => {
        try {
            const data = await AsyncStorage.getItem(storageKey)
            if(data !== null) {
                setData(JSON.parse(data));
            }
        } catch(error) {
            console.log(error);
        }
    }
    getData();
  }, []);

  
  const assignProducts = (item) => {
    let storeID = item.store_id;
    
    let totalPrice = 0;
    let storeProducts = [];

    data.forEach(product => {
      let allStores = product.stores_carrying;
      allStores.forEach(store => {
        if(store.store_id === storeID) {
          totalPrice += (store.price * product.quantity);
          let storeProduct = {
            productId: product.product_id,
            productName: product.product_name,
            productPrice: store.price,
            productQuantity: product.quantity,
          }
          storeProducts.push(storeProduct);
        }
      });
      
    });

    if(totalPrice == 0) {
      totalPrice = 'Coming soon!';
    } else {
      totalPrice = '$'+String(totalPrice);
    }

    return {storeProducts: storeProducts, totalPrice: totalPrice};
  }

  const renderStores = ( {item} ) => {
    return (
      <Store
        item={item}
        storageKey={storageKey}
        productInfo={assignProducts(item)}
        state={selectedCategory}
        setState={setSelectedCategory}
      >
      </Store>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.flatListView}>
        <FlatList
          data={allStores}
          renderItem={renderStores}
          keyExtractor={store => store.store_id}
        >
        </FlatList>
      </View>
      <View style={styles.checkoutView}>
        <TouchableOpacity
          style={styles.checkoutBtn}
        >
          <Text>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SelectStore

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'lightcoral',
  },
  flatListView: {
    marginVertical: 80,
    flex: 7,
    // backgroundColor: 'gold',
  },
  storeTile: {
    width: 350,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutView: {
    flex: 1,
    // backgroundColor: 'green',
  },
  checkoutBtn: {
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 50,
  },
  icons: {
    color: 'blue'
  },
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'orange',
    borderWidth: 2,
    padding: 30,
    alignItems: 'center',
    height: 300,
    width: '90%'
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  productTile: {
    width: 300,
    padding: 5,
    marginVertical: 8,
    // marginHorizontal: 8,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'gold'
  },

})