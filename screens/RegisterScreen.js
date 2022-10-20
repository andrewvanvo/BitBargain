import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import { Formik } from 'formik';
import * as Yup from 'yup';

// import is tentative (I just used one of my existing firebase to play around with; 
// import might change depending how the fb config is going be setup)
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword  } from 'firebase/auth';
import { setDoc, doc, } from 'firebase/firestore';


const RegisterScreen = ( {navigation} ) => {
    const loginValues = {
        fname: '',
        lname: '',
        email: '',
        password: '',
    }

    const signUpSchema = Yup.object().shape({
        fname: Yup.string()
        .min(1, 'First name must be at least 1 character.')
        .max(20, 'First name must be at most 20 characters.')
        .required('Required'),
        lname: Yup.string()
        .min(1, 'Last name must be at least 1 character.')
        .max(20, 'Last name must be at most 20 characters.')
        .required('Required'),
        email: Yup.string()
        .email('Invalid E-mail')
        .required('Required')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use another e-mail domain.'),
        password: Yup.string()
        .min(6, 'Password must be at least 6 characters')       // I think for testing purpose maybe just a simple
        .max(12, 'Password must be less than 13 characters')    // pw for now?
        .required('Required'),
    });

    // with the user's email/pw input, if valid, will submit to firebase auth to make an account.
    const handleUserRegisteration = async (values) => {

        // for the function below it requires the following parameters:
        // (auth: Auth, email: string, password: string)
        // for fname and lname, I think we can add those to the actual db later?
        try {
            const {userCredential} = 
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            await setDoc(doc(db, 'Users', auth.currentUser.uid), {
            fname: values.fname,
            lname: values.lname,
            email: values.email,
            rank: 'Bronze'
        })
        console.log('New user created: ', values.email, values.password)
        } catch (error) {
            console.log('Registration has an error!', error.code)
        }
    };
    return (
        <View style={styles.formikContainer}>
            <Formik
                initialValues={loginValues}
                validationSchema={signUpSchema}
                validateOnChange={false}
                validateOnBlur={false}
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
                            <Text style={styles.errorMsg}>{formikProps.errors.fname}</Text>
                            <TextInput
                                placeholder='Last Name...'
                                value={formikProps.values.lname}
                                onChangeText={formikProps.handleChange('lname')}
                                style={styles.inputField}
                            />
                            <Text style={styles.errorMsg}>{formikProps.errors.lname}</Text>
                            <TextInput
                                placeholder='E-mail...'
                                value={formikProps.values.email}
                                onChangeText={formikProps.handleChange('email')}
                                style={styles.inputField}                             
                            />
                            <Text style={styles.errorMsg}>{formikProps.errors.email}</Text>
                            <TextInput
                                placeholder='Password...'
                                value={formikProps.values.password}
                                onChangeText={formikProps.handleChange('password')}
                                secureTextEntry={true}
                                style={styles.inputField}    
                            />
                            <Text style={styles.errorMsg}>{formikProps.errors.password}</Text>
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
    },
    errorMsg: {
        color: 'red',
        fontWeight: 'bold',
    },
});