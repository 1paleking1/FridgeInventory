import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, TouchableWithoutFeedback, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install and import Ionicons
import { collection, setDoc, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db, auth } from '../firebaseConfig';
import * as Clipboard from 'expo-clipboard';

// hooks
import useFetchFridgeID from '../hooks/useFetchFridgeID';

// components
import ManageFridgeModal from './ManageFridgeModal';  

export default function SideBarModal(props) {

    const fridgeID = useFetchFridgeID(auth.currentUser)
    const [newFridgeID, setNewFridgeID] = useState("");
    const [manageModalVisible, setManageModalVisible] = useState(false);


    const handleJoin = async() => {

        docRef = doc(db, "fridges", newFridgeID.toString());

        docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {

            // make old fridge inactive

            docRef = doc(db, "fridges", fridgeID.toString());
            await updateDoc(docRef, {
                active: false
            }); 

            // updating the user's fridge_id
            
            docRef = doc(db, "users", auth.currentUser.uid.toString());
            await updateDoc(docRef, {
                fridge_id: newFridgeID.toString()
            });


             // updating the new fridge's user list
            docRef = doc(db, "fridges", newFridgeID.toString());
            updateDoc(docRef, {
                users: [...docSnap.data().users, auth.currentUser.email]
            });
            
            alert("Successfully joined Fridge " + newFridgeID);



        } else {
            console.log("Invalid Fridge ID");
            alert("Invalid Fridge ID");
        }
        
    }


    const copyToClipboard = () => {
        Clipboard.setString(fridgeID);
        alert("Fridge ID copied to clipboard");
    }


    const fridgeIDJSX = fridgeID ? <Text>{fridgeID}</Text> : <Text>Not in a Fridge</Text>;

    return (
        <View>
            <Modal visible={props.modalOpen} transparent={true}>
                <TouchableWithoutFeedback onPress={props.onClose}>
                    <View style={styles.ModalBackgroundOpacity}>
                        <View style={styles.ModalWindow}>

                                <View style={styles.IconContainer}>
                                    <Ionicons name="menu" size={30} color="black" style={styles.Icon} onPress={() => props.setModalOpen(false)} />
                                </View>

                                <TouchableOpacity style={styles.SignOutButton} onPress={() => props.signOut()}>
                                    <Text style={styles.SignOutText}>Sign Out</Text>
                                </TouchableOpacity>

                                <Text style={styles.UserInfoText}>Logged in as:</Text>
                                <Text style={styles.UserInfoText}>{props.email}{"\n"}</Text>

                                <Text style={styles.UserInfoText}>Fridge ID:</Text>
                                <Text style={styles.UserInfoText} onPress={copyToClipboard} >{fridgeIDJSX}{"\n"}</Text>

                                <TouchableOpacity style={styles.JoinButton} onPress={() => setManageModalVisible(true)}>
                                    <Text style={styles.JoinButtonText}>Manage Fridge</Text>
                                </TouchableOpacity>

                                <Text style={styles.NewIDlabelText}>Join a Different Fridge: </Text>

                                <TextInput
                                style={styles.IDInput}
                                placeholder="Enter Fridge ID to Join"
                                onChangeText={text => setNewFridgeID(text)}
                                />

                                <TouchableOpacity style={styles.JoinButton} onPress={handleJoin}>
                                    <Text style={styles.JoinButtonText}>Join</Text>
                                </TouchableOpacity>

                                <ManageFridgeModal
                                manageModalVisible={manageModalVisible}
                                setManageModalVisible={setManageModalVisible}
                                />

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    ModalWindow: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '80%',
        backgroundColor: '#ffffff',
        paddingHorizontal: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },

    ModalBackgroundOpacity: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

    JoinButton: {
        backgroundColor: "#66b0ed",
        borderWidth: 2,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 20,
        marginTop: 10,
    },

    JoinButtonText: {
        fontSize: 24,
        color: "#ffffff",
        textAlign: 'center',
    },

    SignOutText: {
        fontSize: 24,
        color: "red",
        marginBottom: 50,
    },

    IDInput: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10
    },

    
    IconContainer: {
        width: '100%',
        alignItems: 'left',
        paddingLeft: 15,
        marginBottom: 30,
        paddingTop: 20,
    },

    Icon: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    UserInfoText: {
        fontSize: 18,
        textAlign: 'center',
    },

    NewIDlabelText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },

});