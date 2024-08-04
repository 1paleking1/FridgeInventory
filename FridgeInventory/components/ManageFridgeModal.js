// boilerplate
import React, { Component } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

// hooks
import useFetchFridgeID from '../hooks/useFetchFridgeID';

export default function ManageFridgeModal(props) {

    const fridgeID = useFetchFridgeID(auth.currentUser);
    const [fridgeUsers, setFridgeUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const loadFridgeUsers = async () => {

        await console.log("loading fridge users")

        docRef = doc(db, "fridges", fridgeID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setFridgeUsers(docSnap.data().users);
        } else {
            console.log("No such document!");
        }

    }

    const currentUserIsAdmin = async () => {
        docRef = doc(db, "fridges", fridgeID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            
            if (docSnap.data().admin == auth.currentUser.uid) {
                setIsAdmin(true);
            }

        } else {
            console.log("No such document!");
        }
    }

    const getButtonJSX = () => {
        if (isAdmin) {
            return (
                <TouchableOpacity>
                    <Text>Leave Fridge</Text>
                </TouchableOpacity>
            );
        }
    }

    const handleMemberDelete = async () => {
        
        if (isAdmin) {
            console.log("Deleting member");
        }

    }

    useEffect(() => {
        loadFridgeUsers();
        currentUserIsAdmin();
    }, [props.manageModalVisible]);
    

    return (
        <View>
            <Modal visible={props.manageModalVisible} animationType="fade">
                <View style={styles.container}>

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Leave Fridge</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => props.setManageModalVisible(false)}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>

                        <FlatList
                            data={fridgeUsers}
                            style={styles.UsersScroll}
                            renderItem={({ item }) => (
                                <View style={styles.TableRow}>
                                    <Text style={styles.text} >{item}</Text>
                                    <Ionicons name="trash" size={24} color="black" onPress={handleMemberDelete} />
                                </View>
                            )}
                        />

                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eda366",
        alignItems: "center",
        justifyContent: "top",
    },
    TableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    text: {
        fontSize: 20,
    },

    title: {
        fontSize: 30,
        margin: 20,
    },

    UsersScroll: {
        width: 300,
    },

    button: {
        backgroundColor: "#66b0ed",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 5,
        marginTop: 40,
        marginBottom: 20,
        width: 150,
        height: 50,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 20,

    },

});
