import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import { Formik } from 'formik';


const LoginScreen = () => {
    return (
        <View style={styles.formikContainer}>
            <Formik >
                {() => (
                    <View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='E-mail...'
                                style={styles.inputField}                                
                            />
                            <TextInput
                                placeholder='Password...'
                                style={styles.inputField}    
                            />
                        </View >
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                            >
                                <Text>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
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