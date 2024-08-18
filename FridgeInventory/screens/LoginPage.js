import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import FlashMessage from "react-native-flash-message";

// firebase imports
import { db, auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import {  doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// hooks
import { usePushNotifications } from '../hooks/usePushNotifications';

// components
import EmailPwdInputs from "../components/EmailPwdInputs";

// utility functions
import { getErrorFlashMessage } from '../functions/utility_functions';


export default function ScanPage({ navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { expoPushToken, notification } = usePushNotifications();
    const flashRef = useRef()

    const addDeviceToUser = async(uid, push_token) => {

        if (!push_token) {
            return;
        }
    
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

            await addDeviceToUser(user.uid, expoPushToken);




        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        
            getErrorFlashMessage(errorCode, flashRef);

        }
    }

    return (
        <View style={styles.container}>

            <FlashMessage position="top" ref={flashRef} />
            
            <View style={styles.formBox}>
            

                <EmailPwdInputs setEmail={setEmail} setPassword={setPassword} />


                <TouchableOpacity style={styles.loginButton} onPress={Login}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

            </View>
        
            <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUpPage', { push_token: expoPushToken })}>
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

