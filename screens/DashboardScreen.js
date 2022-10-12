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
            <View style={styles.buttonContainer}>
                <Text>YOYO! THIS WILL BE OUR DASHBOARD!</Text>
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
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    buttonContainer: {
        width: '70%',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        borderRadius: 10,
        width: '45%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
        marginTop: 20,
    },


});
