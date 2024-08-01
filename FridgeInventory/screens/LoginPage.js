import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";

// firebase imports
import { db, auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";



export default function ScanPage({ navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const SignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                
                // ..
            });
    };

    const Login = () => {

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                // navigation.navigate("HomePage");

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(errorCode)

                if (errorCode === 'auth/invalid-credential') {
                    alert('The email or password is incorrect.');
                } else if (errorCode === 'auth/too-many-requests') {
                    alert('Too many requests. Please try again later.');
                }

            });
        
    };

    return (
        <View style={styles.container}>


            <View style={styles.formBox}>
            
                <Text style={styles.labelText}>Email</Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text)}
                />
                <Text style={styles.labelText}>Password</Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />

                <TouchableOpacity style={styles.loginButton} onPress={Login}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUpPage')}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#eda366",
        alignItems: "center",
        justifyContent: "center",
    },

    formBox: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
    },

    pickerInput: {
        fontSize: 20,
    },

    pickerOptions: {
        fontSize: 15,
    },

    nameInput: {
        fontSize: 20,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        width: 250,
        padding: 10,
    },

    loginButton: {
        backgroundColor: "#66b0ed",
        color: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 20,
        marginTop: 40,
    },

    signUpButton: {
        backgroundColor: "#66b0ed",
        color: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 56,
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 20,
        marginTop: 60,
    },

    labelText: {
        fontSize: 25,
        color: "#000000",
        marginBottom: 10,
    },

    buttonText: {
        fontSize: 25,
        color: "#ffffff",
        marginVertical: 5,
    },

});

