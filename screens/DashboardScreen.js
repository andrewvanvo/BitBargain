import React, {useState, useEffect, Component} from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Alert, Image, FlastList} from 'react-native'
import { auth, db } from '../firebase/';
import { getAdditionalUserInfo, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, doc, where, query } from'firebase/firestore';


const DashboardScreen = ({navigation}) => {
    
    const [user, setUser] = useState({fname: 'Unknown', rank: 'Unknown'});
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if(user) {
                const uid = user.uid
                const getUser = async () => {
                    const userCollection = doc(db, 'Users', uid )
                    const userSnapshot = await getDoc(userCollection);
                    setUser(userSnapshot.data());
                    console.log('useEffect success');
                };
                getUser();
            }
            else {
                setUser({})
            }
        })
        // when leaving the Login screen to Dashboard, the listener will stop
        return unsubscribe;
    }, [])

    return (
        <View style={styles.mainContainer}>
                
            <View style={styles.header}>
                
            </View>

            <View style={styles.userInfoContainer}>
                <View style = {styles.infoContainerTextBox}>
                    <Text>Dashboard</Text>
                    <Text style={styles.username}>Good Afternoon, {user.fname} </Text>
                    <Text>Rank: {user.rank} </Text>
                </View>
                <View style = {styles.infoContainerImgBox}>
                    <Image 
                        source={require('../assets/profile-pic-sample.png')} //swap out uri for when ranking images are available
                        style={styles.profileImage} />
                </View>  
            </View>
        
            {/* LIVE FEED CONTAINER*/}
            <View style={styles.liveFeedContainer}>
                <Text style={{color: 'blue'}}>Live Feed Container</Text>
            </View>

        </View>
    );
}

export default DashboardScreen

const styles = StyleSheet.create({
    //https://reactnative.dev/docs/colors for named color palette

    //TOP LEVEL CONTAINER
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        // padding: 20,
    },

    //PROFILE CONTAINER
    userInfoContainer: {
        flex: 1, 
        flexDirection: 'row',
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30
    },
    infoContainerImgBox:{
        flex: 1,
        width: 70,
        height: 70,
        alignItems: 'center'
    },
    infoContainerTextBox:{
        flex:2,
    },
    profileImage: {
        flex: 1,
        width: 70,
        height: 70,
        borderRadius: 50,
        resizeMode: 'contain'
    },

    //LIVEFEED CONTAINER//
    liveFeedContainer: {
        flex: 2, 
        backgroundColor: "cornflowerblue",
        justifyContent: 'center',
        alignItems: 'center',
    },

    //NAVIGATION CONTAINER
    buttonContainer: {
        flex: 3, 
        backgroundColor: "white",
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        borderRadius: 10,
        width: '30%',
        padding: 10,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'orange',
        marginTop: 20,
    },


});
