import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import { Formik } from 'formik';

// import is tentative (I just used one of my existing firebase to play around with; 
// import might change depending how the fb config is going be setup)
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';


const LoginScreen = () => {
    // initial values for the input fields
    const loginValues = {
        email: '',
        password: '',
    }

    // sign user into firebase if email/pw are authorized
    const handleSignIn = (values) => {
        signInWithEmailAndPassword(auth, values.email, values.password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('User has logged in: ', user.email);
        })
        .catch(error => {
            console.log('Login had an error!');
        })
    }
    return (
        <View style={styles.formikContainer}>
            <Formik
                initialValues={loginValues}
                onSubmit={(credentials) => {
                    console.log('User trying to login: ', credentials.email, credentials.password);
                    handleSignIn(credentials);
                }}
            >
                {(formikProps) => (
                    <View>
                        <View style={styles.inputContainer}>
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
                                style={styles.inputField}    
                            />
                        </View >
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={formikProps.handleSubmit}
                            >
                                <Text>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                // onPress={} // eventually will navigate to a 'Register' screen
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

});