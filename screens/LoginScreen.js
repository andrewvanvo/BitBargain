
import React, { useEffect } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Alert, Image } from 'react-native'
import { Formik } from 'formik';
import * as Yup from 'yup';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import is tentative (I just used one of my existing firebase to play around with; 
// import might change depending how the fb config is going be setup)
import { auth } from '../firebase';
import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

import Icon from "react-native-vector-icons/Ionicons";
import logo from '../assets/BitBargain-logo.png';


const LoginScreen = ({ navigation}) => {
    // initial values for the input fields
    const loginValues = {
        email: '',
        password: '',
    }

    // the validation schema that Formik form will valid with
    const signInSchema = Yup.object().shape({
        email: Yup.string()
        .email('Invalid E-mail')
        .required('Required'),
        password: Yup.string()
        .required('Required'),
    });

    // sign user into firebase if email/pw are authorized
    const handleSignIn = (values) => {
        signInWithEmailAndPassword(auth, values.email, values.password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('User has logged in: ', user.email);
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect( () => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if(user) {
                navigation.navigate('Home')
            }
        })
        // when leaving the Login screen to Dashboard, the listener will stop
        return unsubscribe;
    }, [])

    const resetErrors = (formikProps) => {
        formikProps.setErrors({});
    }

    const navigateToRegister = (formikProps) => {
        // when we navigate away from LoginScreen, also reset any errors
        resetErrors(formikProps);
        navigation.navigate('Register');

    }
    
    return (
        <View style={styles.formikContainer}>
            <View style={{}}>
                <Image source={logo} style={{width:  300, height: 200}}></Image>
            </View>
            <Formik
                initialValues={loginValues}
                validationSchema={signInSchema}     // add the Yup schema we defined above
                validateOnChange={false}            // have Formik validate ONLY after submission, not during change
                validateOnBlur={false}
                onSubmit={(credentials, actions) => {
                    console.log('User trying to login: ', credentials.email, credentials.password);
                    handleSignIn(credentials);
                    actions.resetForm();
                }}
            >
                {(formikProps) => (
                    <View>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconInput}>
                                <Icon name="mail-outline" size={20} style={styles.icons}/>
                                <TextInput
                                    placeholder='E-mail...'
                                    value={formikProps.values.email}
                                    onChangeText={formikProps.handleChange('email')}
                                    style={styles.inputField}
                                    // onFocus={() => resetErrors(formikProps)}   // should the errors go away after focusing the fields again??                       
                                />
                            </View>
                            <Text style={styles.errorMsg}>{formikProps.errors.email}</Text>
                            <View style={styles.iconInput}>
                                <Icon name="lock-closed-outline" size={20} style={styles.icons}/>
                                <TextInput
                                    placeholder='Password...'
                                    value={formikProps.values.password}
                                    onChangeText={formikProps.handleChange('password')}
                                    secureTextEntry={true}
                                    style={styles.inputField}   
                                    // onFocus={() => resetErrors(formikProps)}   
                                />
                            </View>
                            <Text style={styles.errorMsg}>{formikProps.errors.password}</Text>  
                        </View >
                        <View style={styles.forgetContainer}>
                            <TouchableOpacity style={styles.forgetButton}>
                                <Text 
                                style={{
                                    fontSize: 12,
                                    color: 'blue'
                                }}
                                onPress={()=>navigation.navigate('ForgetPass')} // Requires Email Input to be filled, and sends instructions to recipients email
                                >Forgot your password?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={formikProps.handleSubmit}
                            >
                                <Text>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigateToRegister(formikProps)}
                            >
                                <Text>Register</Text>
                            </TouchableOpacity>
                            
                        </View>
                        
                            
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default LoginScreen

const styles = StyleSheet.create({
    formikContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    iconInput: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    inputField: {
        marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    icons: {
        marginLeft: 15,
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
    forgetButton:{
        backgroundColor: 'transparent',
    },
    errorMsg: {
        color: 'red',
        fontWeight: 'bold',
    },
});