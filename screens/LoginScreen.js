import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import { Formik } from 'formik';


const LoginScreen = () => {
    return (
        <View style={styles.formikContainer}>
            <Formik >
                {() => (
                    <View>
                        <View>
                            <TextInput
                                placeholder='E-mail...'                                
                            />
                            <TextInput
                                placeholder='Password...'
                            />
                        </View>
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
    button: {
        backgroundColor: 'orange',
        borderRadius: 10,
    }
});