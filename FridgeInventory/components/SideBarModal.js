import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, TouchableWithoutFeedback, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install and import Ionicons
import { collection, setDoc, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from '../firebaseConfig';
import * as Clipboard from 'expo-clipboard';
import FlashMessage, { showMessage } from "react-native-flash-message";

// hooks
import useFetchFridgeID from '../hooks/useFetchFridgeID';

// components
import ManageFridgeModal from './ManageFridgeModal';  

export default function SideBarModal(props) {

    const fridgeID = useFetchFridgeID(auth.currentUser)
    const [newFridgeID, setNewFridgeID] = useState("");
    const [manageModalVisible, setManageModalVisible] = useState(false);

    const dangerMessage = (message) => {

        showMessage({
            message: message,
            type: "danger",
            icon: "auto",
            duration: 2000
        });
    }

    const successMessage = (message) => {

        showMessage({
            message: message,
            type: "success",
            icon: "auto",
            duration: 2000
        });
    }

    const handleJoin = async() => {

        if (newFridgeID == "") {
            // alert("Please enter a Fridge ID");
            dangerMessage("Please enter a Fridge ID");

            return;
        }

        // make sure it's not the same fridge
        if (newFridgeID == fridgeID) {
            // alert("You are already in this fridge");

            dangerMessage("You are already in this fridge");
            return;
        }

        docRef = doc(db, "fridges", newFridgeID.toString());

        docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {

            // make old fridge inactive

            docRef = doc(db, "fridges", fridgeID.toString());
            await updateDoc(docRef, {
                is_active: false
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
            
            // alert("Successfully joined Fridge " + newFridgeID);

            successMessage("Successfully joined Fridge " + newFridgeID);



        } else {
            console.log("Invalid Fridge ID");
            
            dangerMessage("Invalid Fridge ID");
        }
        
    }


    const copyToClipboard = async() => {
        await Clipboard.setStringAsync(fridgeID);
        // await alert("Fridge ID Copied to Clipboard");
        showMessage({
            message: "Fridge ID Copied to Clipboard",
            type: "success",
            icon: "auto",
            duration: 1000
        });
    }


    const fridgeIDJSX = fridgeID ? <Text>{fridgeID}</Text> : <Text>Not in a Fridge</Text>;

    return (
        <View>


            <Modal visible={props.modalOpen} transparent={true} animationType="fade">

                <FlashMessage position="top" />

                <View style={styles.ModalBackgroundOpacity}>
                    <View style={styles.ModalWindow}>

                            <View style={styles.IconContainer}>
                                <Ionicons name="menu" size={40} color="black" style={styles.Icon} onPress={() => props.setModalOpen(false)} />
                            </View>

                            <View style={styles.modalSection}>
                                <TouchableOpacity style={styles.SignOutButton} onPress={() => props.signOut()}>
                                    <Text style={styles.SignOutText}>Sign Out</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalSection}>
                                <Text style={styles.UserInfoText}>Logged in as:</Text>
                                <Text style={styles.UserInfoText}>{props.email}{"\n"}</Text>
                            </View>

                            <View style={styles.modalSection}>
                                <Text style={styles.UserInfoText}>Fridge ID:</Text>
                                <View style={styles.row}>
                                    <Text style={styles.UserInfoText}>{fridgeIDJSX}{"\n"}</Text>
                                    <Ionicons name="copy-outline" size={24} color="black" onPress={copyToClipboard} />
                                </View>
                            </View>

                            <View style={styles.modalSection}>
                                <Text style={styles.NewIDlabelText}>Join a Different Fridge: </Text>
                                <TextInput
                                style={styles.IDInput}
                                placeholder="Enter Fridge ID to Join"
                                onChangeText={text => setNewFridgeID(text)}
                                />
                                <TouchableOpacity style={styles.JoinButton} onPress={handleJoin}>
                                    <Text style={styles.JoinButtonText}>Join</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalSection}>
                                <TouchableOpacity style={styles.JoinButton} onPress={() => setManageModalVisible(true)}>
                                    <Text style={styles.JoinButtonText}>Manage Fridge</Text>
                                </TouchableOpacity>
                            </View>

                            <ManageFridgeModal
                            manageModalVisible={manageModalVisible}
                            setManageModalVisible={setManageModalVisible}
                            fridgeID={fridgeID}
                            />

                    </View>
                </View>
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
        // borderTopRightRadius: 20,
        // borderBottomRightRadius: 20,
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
    },

    IDInput: {
        height: 40,
        width: 250,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10
    },

    modalSection: {
        marginBottom: 30,
        alignItems: 'center',
        
    },
    
    IconContainer: {
        width: '100%',
        alignItems: 'left',
        paddingLeft: 15,
        marginBottom: 30,
        paddingTop: 10,
    },

    Icon: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    UserInfoText: {
        fontSize: 18,
        textAlign: 'center',
        // marginHorizontal: 10,
    },

    NewIDlabelText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },

    row: {
        flexDirection: 'row',
        marginHorizontal: 50,
        alignItems: 'center',
    },

});