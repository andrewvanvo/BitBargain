import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import { Formik } from 'formik';

// import is tentative (I just used one of my existing firebase to play around with; 
// import might change depending how the fb config is going be setup)
import { auth } from '../firebase';
import { createUserWithEmailAndPassword  } from 'firebase/auth';


const RegisterScreen = ( {navigation} ) => {
    const loginValues = {
        fname: '',
        lname: '',
        email: '',
        password: '',
    }

    // with the user's email/pw input, if valid, will submit to firebase auth to make an account.
    const handleUserRegisteration = (values) => {
        createUserWithEmailAndPassword(auth, values.fname, values.lname, values.email, values.password)
        .then( (userCredential) => {
            console.log('New user created: ', values.fname, values.lname, values.email, values.password);
        })
        .catch(error => {
            console.log('Registeration has an error!');

        });
    }
    
    return (
        <View style={styles.formikContainer}>
            <Formik
                initialValues={loginValues}
                onSubmit={(credentials, actions) => {
                    console.log('User trying to make a new acc: ');
                    handleUserRegisteration(credentials);
                    actions.resetForm();
                }}
            >
                {(formikProps) => (
                    <View>
                        <Text>THIS IS THE REGISTER SCREEN</Text>
                        
                        <Text>Create New Account</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='First Name...'
                                value={formikProps.values.fname}
                                onChangeText={formikProps.handleChange('fname')}
                                style={styles.inputField}
                            />
                            <TextInput
                                placeholder='Last Name...'
                                value={formikProps.values.lname}
                                onChangeText={formikProps.handleChange('lname')}
                                style={styles.inputField}
                            />
                            <TextInput
                                placeholder='E-mail...'
                                value={formikProps.values.email}
                                onChangeText={formikProps.handleChange('email')}
                                style={styles.inputField}                             
                            />
                            <TextInput
                                placeholder='Password...'
                                value={formikProps.values.password}
                                onChangeText={formikProps.handleChange('password')}
                                secureTextEntry={true}
                                style={styles.inputField}    
                            />
                        </View >
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => navigation.goBack()}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.submitButton]}
                                onPress={formikProps.handleSubmit} // eventually will navigate to a 'Register' screen
                            >
                                <Text>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default RegisterScreen

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
    },
    cancelButton: {
        backgroundColor: 'lightgray',
    },
    submitButton: {
        backgroundColor: 'orange',
    }

});