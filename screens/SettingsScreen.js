import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Alert } from 'react-native'
import { Formik } from 'formik';

import { auth, db } from '../firebase/';
import { getAdditionalUserInfo, signOut } from 'firebase/auth';
import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';



const SettingsScreen = ({ navigation }) => {
  
    const handleSignOut = () => {
        signOut(auth)
        .then( () => {
            navigation.navigate('Login');
        })
        .catch(error => {
            console.log(error);
        });
    }
    
    return (
        <View style={styles.formikContainer}>
            <View style={styles.buttonContainer}>
    
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

export default SettingsScreen

const styles = StyleSheet.create({
    formikContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    inputField: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    buttonContainer: {
        width: '70%',
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        borderRadius: 10,
        width: '45%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange'
    },
    forgetContainer: {
        marginTop: 10
    },
    forgetButton:{
        backgroundColor: 'transparent',
    }

});
