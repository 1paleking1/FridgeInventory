import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";

// firebase imports
import { db, auth } from "../firebaseConfig";
import { sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, deleteDoc, doc, getDoc } from "firebase/firestore"; 


export default function SignUpPage({ navigation, route }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    

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
                shoppingList: [],
            });

        } catch (e) {
            console.error("Error adding document: ", e);
        }

    };


    const SignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                // sendEmailVerification(user)
                //     .then(() => {
                //         alert("Verification email sent to " + email);
                        
                //     })
                //     .catch((error) => {
                //         alert("Error sending verification email");
                //     });

                addUserToDatabase(user.uid, email);

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === 'auth/weak-password') {
                    alert('The password is too weak.');
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

                <TouchableOpacity style={styles.loginButton} onPress={SignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

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

