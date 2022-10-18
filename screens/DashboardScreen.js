import React, {useState, useEffect, Component} from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Alert, Image, FlastList} from 'react-native'

import { auth, db } from '../firebase/';
import { getAdditionalUserInfo, signOut } from 'firebase/auth';
import { collection, getDoc, doc, where, query } from'firebase/firestore';


import { NavigationContainer } from '@react-navigation/native';
import CreateListScreen from './CreateListScreen';

class DashboardScreen extends Component {
    state = {
        user: {
            name: ""
        }
    }
    constructor(props) {
        super(props);
        this.getUser();
    }
    

    getUser = async() => {
    const userCollection =  doc(db, 'Users', 'TNCb90XxqBmkaRDvGMKE');
    const userSnapshot = await getDoc(userCollection);
    console.log(userSnapshot.data().fname)
    this.setState({user: {name: userSnapshot.data().fname + userSnapshot.data().lname}})
    }


    render() {
        return (
            <View style={styles.mainContainer}>

            {/* USER PROFILE CONTAINER */}
            <View style={styles.userInfoContainer}>
                
                <View style = {styles.infoContainerTextBox}>
                    <Text>Dashboard</Text>
                    <Text style={styles.username}>Good Afternoon, Tobey </Text>
                    <Text>Rank: Gold </Text>
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
}
// const DashboardScreen = ({navigation}) => {


//     getUser = async() => {
//         const userDocument = await firestore.collection('Users').doc('TNCb90XxqBmkaRDvGMKE').get()
//         console.log(userDocument)
//     }

//     const handleSignOut = () => {
//         signOut(auth)
//         .then( () => {
//             console.log(auth.currentUser);
//             navigation.navigate('Login');
//         })
//         .catch(error => {
//             console.log(error);
//         });
//     }

//     return (
//         <View style={styles.mainContainer}>

//             {/* USER PROFILE CONTAINER */}
//             <View style={styles.userInfoContainer}>
//                 <View style = {styles.infoContainerImgBox}>
//                     <Image 
//                         source={require('../assets/BitBargain-logo.png')} //swap out uri for when ranking images are available
//                         style={styles.profileImage} />
//                 </View>  
//                 <View style = {styles.infoContainerTextBox}>
//                     <Text style={{color: 'blue'}}>User Profile Info Container</Text>
//                 </View>
//             </View>
            
//             {/* LIVE FEED CONTAINER*/}
//             <View style={styles.liveFeedContainer}>
//                 <Text style={{color: 'blue'}}>Live Feed Container</Text>
//             </View>

//             {/* NAVIGATION CONTAINER*/}
//             <View style={styles.buttonContainer}>
//                 <Text style={{color: 'orange'}}>YOYO! THIS WILL BE OUR DASHBOARD!</Text>
//                 <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => navigation.navigate('CreateList')}               // will navigate somewhere, eventually
//                 >
//                     <Text>Create List</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.button}
//                     // onPress={}               // will navigate somewhere, eventually
//                 >
//                     <Text>Update Item</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.button}
//                     // onPress={}               // will navigate somewhere, eventually
//                 >
//                     <Text>Saved Lists</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.button}
//                     onPress={handleSignOut}
//                 >
//                     <Text>Sign Out</Text>
//                 </TouchableOpacity>
//             </View>

//         </View>
//     );
// }

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
        backgroundColor: "darkorange",
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
