import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import { Formik } from 'formik';


const LoginScreen = () => {
    // initial values the input fields will
    const loginValues = {
        email: '',
        password: '',
    }
    return (
        <View style={styles.formikContainer}>
            <Formik
                initialValues={loginValues}
                onSubmit={(credentials) => {
                    console.log('User trying to login: ', credentials.email, credentials.password);
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