import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Alert, Image } from 'react-native'
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';



const DashboardScreen = ({ navigation}) => {

    const handleSignOut = () => {
        signOut(auth)
        .then( () => {
            console.log(auth.currentUser);
            navigation.navigate('Login');
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <View style={styles.mainContainer}>

            {/* USER PROFILE CONTAINER */}
            <View style={styles.userInfoContainer}>
                <View style = {styles.infoContainerImgBox}>
                    <Image 
                        source={require('../assets/BitBargain-logo.png')} //swap out uri for when ranking images are available
                        style={styles.profileImage} />
                </View>  
                <View style = {styles.infoContainerTextBox}>
                    <Text style={{color: 'blue'}}>User Profile Info Container</Text>
                </View>
            </View>
            
            {/* LIVE FEED CONTAINER*/}
            <View style={styles.liveFeedContainer}>
                <Text style={{color: 'blue'}}>Live Feed Container</Text>
            </View>

            {/* NAVIGATION CONTAINER*/}
            <View style={styles.buttonContainer}>
                <Text style={{color: 'orange'}}>YOYO! THIS WILL BE OUR DASHBOARD!</Text>
                <TouchableOpacity
                    style={styles.button}
                    // onPress={}               // will navigate somewhere, eventually
                >
                    <Text>Create List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    // onPress={}               // will navigate somewhere, eventually
                >
                    <Text>Update Item</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    // onPress={}               // will navigate somewhere, eventually
                >
                    <Text>Saved Lists</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignOut}
                >
                    <Text>Sign Out</Text>
                </TouchableOpacity>
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
        padding: 20,
    },

    //PROFILE CONTAINER
    userInfoContainer: {
        flex: 1, 
        flexDirection: 'row',
        backgroundColor: "darkorange",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoContainerImgBox:{
        flex: 1,
    },
    infoContainerTextBox:{
        flex:3,
    },
    profileImage: {
        flex: 1,
        width: 50,
        height: 50,
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
        backgroundColor: "blue",
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
