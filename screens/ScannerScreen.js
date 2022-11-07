import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
      <View style ={styles.viewBox}>
          <BarCodeScanner
            style = {styles.scanner}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
      </View>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 50,
      justifyContent: 'top',
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