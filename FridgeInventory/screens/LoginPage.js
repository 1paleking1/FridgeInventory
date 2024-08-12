import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import FlashMessage, { showMessage } from "react-native-flash-message";

// firebase imports
import { db, auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, deleteDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// hooks
import { usePushNotifications } from '../hooks/usePushNotifications';

// utility functions
import { dangerMessage, successMessage, infoMessage, getErrorFlashMessage } from '../functions/utility_functions';


export default function ScanPage({ navigation, route }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { expoPushToken, notification } = usePushNotifications();
    const flashRef = useRef()

    const addDeviceToUser = async(uid, push_token) => {
    
        try {

            const docRef = doc(db, "users", uid.toString());
            
            // add to list if it's not already in it
            const docSnap = await getDoc(docRef);
            const devices = docSnap.data().devices;


            if (!devices.includes(push_token)) {
                await updateDoc(docRef, {
                    devices: arrayUnion(push_token)
                });
            }
           
        } catch(e) {

            console.error("Error adding document: ", e);

        }
    
    }

    const Login = async () => {

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                alert(`A verification email has been sent to ${email}. Please verify your email before logging in.`);
                auth.signOut();
                return;
            }
        
            // Promise.all([
            //     addDeviceToUser(user.uid, expoPushToken.data),
            // ]);

            // refresh user
            // user.reload();

            await addDeviceToUser(user.uid, expoPushToken.data);



        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
    
            console.log(errorCode);
    
            getErrorFlashMessage(errorCode, flashRef);

        }
    }

    return (
        <View style={styles.container}>

            <FlashMessage position="top" ref={flashRef} />
            
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
        
            <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUpPage', { push_token: expoPushToken.data })}>
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
        width: "80%",
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
        width: "100%",
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

