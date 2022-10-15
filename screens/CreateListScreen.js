import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native'
import { useNavigation } from '@react-navigation/native';


// MOCK DATA: some 'categories' of products that we might have. Used to render the horizontal scroll tab (horizontal flatlist)
const CATEGORY_DATA = [
    {id: 0, name: 'CPUs'}, {id: 1, name: 'GPUs'}, {id: 2, name: 'Motherboards'}, {id: 3, name: 'PSUs'}, 
    {id: 4, name: 'PC Cooling'}, {id: 5, name: 'Memory'}, {id: 6, name: 'Storage'}, {id: 7, name: 'Monitors'},];

// MOCK DATA: different type of products under a specific category 
  const CPU_DATA = [
    {id: 0, name: 'CPU1'}, 
    {id: 1, name: 'CPU2'}, 
    {id: 2, name: 'CPU3'}, 
    {id: 3, name: 'CPU4'}, 
    {id: 4, name: 'CPU5'}, 
    {id: 5, name: 'CPU6'}, 
    {id: 6, name: 'CPU7'}, 
    {id: 7, name: 'CPU8'},];
  
  const GPU_DATA = [
    {id: 8, name: 'GPU-1'}, 
    {id: 9, name: 'GPU-2'}, 
    {id: 10, name: 'GPU-3'}, 
    {id: 11, name: 'GPU-4'}, 
    {id: 12, name: 'GPU-5'}, 
    {id: 13, name: 'GPU-6'}, 
    {id: 14, name: 'GPU-7'}, 
    {id: 15, name: 'GPU-8'},];
  
// MOCK DATA: list of data of data to render the vertical flatlist
  const PRODUCT_DATA = [
    {id: 0, name: CPU_DATA}, {id: 1, name: GPU_DATA}, {id: 2, name: {}}, {id: 3, name: {}}, 
    {id: 4, name: {}}, {id: 5, name: {}}, {id: 6, name: {}}, {id: 7, name: {}}, 
  ]

  const CreateListScreen = ({navigation}) => {
    return (
        <View style={styles.mainContainer}>
            <Text>Hello World.</Text>
        </View>
    );
  }

  export default CreateListScreen

  const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: '',
        marginTop: 50,
      },
  });