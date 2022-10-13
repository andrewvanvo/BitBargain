import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Alert } from 'react-native'
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
            <View style={styles.userInfoContainer}>
                <Text style={{color: 'blue'}}>User Profile Info Container.  Ignore the colors for now!</Text>
            </View>

            <View style={styles.liveFeedContainer}>
                <Text style={{color: 'blue'}}>Live Feed Container Ignore the colors for now!</Text>
            </View>

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
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 20,
    },
    userInfoContainer: {
        flex: 1, 
        backgroundColor: "darkorange",
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveFeedContainer: {
        flex: 2, 
        backgroundColor: "cornflowerblue",
        justifyContent: 'center',
        alignItems: 'center',
    },
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
