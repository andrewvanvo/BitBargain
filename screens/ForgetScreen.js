import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Alert } from 'react-native'
import { Formik } from 'formik';

import { auth } from '../firebase';
import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';



const ForgetPass = ({ navigation}) => {
    const loginValues = {
        email: '',
       
    }
    
    const forgotPass = (values) => {
        sendPasswordResetEmail(auth, values.email)
        .then(()=>{
            console.log('Password reset email sent!')
        })
        .catch((error) => {
            console.log('Reset Password had an error!')
        })
    }
    return (
        <View style={styles.formikContainer}>
            <Formik
                initialValues={loginValues}
                onSubmit={(credentials, actions) => {
                    console.log('User trying to request new password: ', credentials.email);
                    forgotPass(credentials);
                    actions.resetForm();
                    navigation.navigate('Login')
                }}
            >
                {(formikProps) => (
                    <View>
                        <View>
                            <Text>
                                Forgot Password?
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='Email ID'
                                value={formikProps.values.email}
                                onChangeText={formikProps.handleChange('email')}
                                style={styles.inputField}                             
                            />
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('Login')} // eventually will submit user's data for acc creation
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={formikProps.handleSubmit}
                            >
                                <Text>Send Email</Text>
                            </TouchableOpacity>
                            
                        </View>
                        
                            
                    </View>
                )}
            </Formik>
        </View>
    );
}

export default ForgetPass

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
