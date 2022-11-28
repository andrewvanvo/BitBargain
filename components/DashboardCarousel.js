import React, { useCallback, useState, useEffect } from "react";
import {SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, ImageBackground, Dimensions} from 'react-native'



export const HorizontalCarousel = ({w, h, data}) => {
    const [active, setActive] = useState(0);
    const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        setActive(viewableItems[0].index)
    }, []);

    const renderItem = ({ item }) => (
        <ImageBackground imageStyle={{ width: w, height: h, borderRadius: 20, opacity: 0.5}}source={{uri: item.imageURL}}>
            <View style={{width: w, height: h, justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{fontSize: 70, color: 'white'}}>{item.number}</Text>
                <Text style={{fontSize: 30, color: 'white'}}>{item.postType}</Text>
            </View>
        </ImageBackground>    

        
    )
    const items = [0,1,2]
    
    return (
        <SafeAreaView style={{ width: w, height: h, borderRadius: 20, }}>
                <View>

                <FlatList
                data={data}
                horizontal={true}
                keyExtractor={item =>  item.id}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                snapToAlignment={'start'}
                decelerationRate={"fast"}
                snapToInterval={w}
                onViewableItemsChanged={_onViewableItemsChanged}
                >
                </FlatList>
            
                <View style={{flexDirection: 'row', justifyContent: 'center' }}>
                    {items.map((i) => {
                        if (i === active) {
                            return <View  key={i.toString()} style={styles.active}></View>
                        }
                        else{
                            return <View key={i.toString()} style={styles.indicator}></View>
                        }
                    })}
                </View>

                </View>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    indicator: {
        borderRadius: 100, 
        backgroundColor: '#E0E0E0', 
        height: 5, 
        width: 5, 
        margin: 5
    },
    active: {
        borderRadius: 100, 
        backgroundColor: 'orange', 
        height: 5, 
        width: 5, 
        margin: 5
    }
  });
  