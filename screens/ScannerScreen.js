import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';


export default function ScannerScreen({route}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation()

  const store_id = route.params.store_id;
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    //CHANGE TO REDIRECT TO NON-TESTING PAGE
    navigation.navigate('AddProduct', {barcodeData: data, store_id: store_id});
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
    //modify for error handling if access permission not granted. Ask again?
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: 24, color: 'white'}}>SCAN BARCODE</Text>
      </View>
      <View style ={styles.viewBox}>
          <BarCodeScanner
            style = {styles.scanner}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
      </View>
      {scanned && <Button title={'Tap to Scan Again'} color='white' onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 50,
      justifyContent: 'top',
      backgroundColor: 'steelblue'
    },

    header:{
      alighItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'darkorange',
      marginTop: 50,
      paddingBottom: 25,
      backgroundColor: 'steelblue'
    },
    scanner: {
      height: 400,
      width: 400,
    },
    viewBox:{
      alignItems:'center',
      justifyContent: 'center',
      overflow: 'hidden',
      height: 300,
      width: 300,
      borderRadius: 30,
    }
});