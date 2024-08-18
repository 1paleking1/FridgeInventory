import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import FlashMessage from "react-native-flash-message";

// firebase imports
import { db, auth } from "../firebaseConfig";
import { sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

// components
import EmailPwdInputs from "../components/EmailPwdInputs";

// utility functions
import { dangerMessage, infoMessage, getErrorFlashMessage } from '../functions/utility_functions';


export default function SignUpPage({ route }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const flashRef = useRef()

    const addUserToDatabase = async(uid, email) => {
        
        try {

            docRef = doc(db, "users", uid.toString());

            await setDoc(docRef, {
                email: email,
                fridge_id: uid.toString(),
                devices: [route.params.push_token], 
            });

            docRef = doc(db, "fridges", uid.toString());
            
            await setDoc(docRef, {
                users: [email],
                admin: email,
                is_active: true,
                shoppingList: []
            });

        } catch (e) {
            console.error("Error adding document: ", e);
        }

    };

    const sendEmailAndInform = async() => {
           
        await sendEmailVerification(auth.currentUser);

        setEmailSent(true);

        infoMessage("Please verify your email before logging in", flashRef);
    
    }


    const SignUp = () => {

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                addUserToDatabase(user.uid, email);

                sendEmailAndInform();

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                getErrorFlashMessage(errorCode, flashRef);
                
            });
    };


    const resendVerificationEmail = async() => {
        
        try {

            await sendEmailVerification(auth.currentUser);
            infoMessage("Email Resent. Please verify your email before logging in", flashRef);

        } catch (e) {
            if (e.code === 'auth/too-many-requests') {
                dangerMessage("Too many requests. Resend attempts should be around 40s apart.", flashRef);
            }
        }
    
    }

    return (
        <View style={styles.container}>

            <FlashMessage position="top" ref={flashRef} />

            <View style={styles.formBox}>
            
                <EmailPwdInputs setEmail={setEmail} setPassword={setPassword} />

                <TouchableOpacity style={styles.loginButton} onPress={SignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                {emailSent ?

                    <TouchableOpacity onPress={resendVerificationEmail}>
                        <Text style={styles.resendText}>Resend Verification Email</Text>
                    </TouchableOpacity>
                
                : <Text>{"\n"}</Text>}


            </View>

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
        shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.9,
        shadowRadius: 6,
        elevation: 10,
    },

    signUpButton: {
        backgroundColor: "#66b0ed",
        color: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
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

    resendText: {
        color: "blue",
        textDecorationLine: "underline",
        textDecorationColor: "blue",
        textAlign: "center",
        fontSize: 15,
        marginTop: 20,
    }

});

