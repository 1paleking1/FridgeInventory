// boilerplate
import React, { Component } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function ManageFridgeModal(props) {

    const [fridgeUsers, setFridgeUsers] = useState([]);


    const [adminEmail, setAdminEmail] = useState("");

    const loadFridgeUsers = async () => {

        docRef = doc(db, "fridges", props.fridgeID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setFridgeUsers(docSnap.data().users);
        } else {
            console.log("No such document!");

        }
    }

    const currentUserIsAdmin = () => {
        return adminEmail == auth.currentUser.email;
    }

    const loadAdmin = async () => {
        docRef = doc(db, "fridges", props.fridgeID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setAdminEmail(docSnap.data().admin);
        } else {
            console.log("No such document!");
        }
    }

    const deleteMemberInDatabase = async (emailToDelete, uidToDelete) => {

        // remove from fridge users array
        docRef = doc(db, "fridges", props.fridgeID);
        await updateDoc(docRef, {
            users: fridgeUsers.filter(user => user != emailToDelete)
        });

        // revert fridge_id in user document to their uid ad reactive their fridge
        docRef = doc(db, "users", uidToDelete);
        await updateDoc(docRef, {
            fridge_id: uidToDelete
        });

        // reactivate fridge
        docRef = doc(db, "fridges", uidToDelete);
        await updateDoc(docRef, {
            is_active: true
        });

    }

    const getUIDFromEmail = async (email) => {
    
        // email is a field in the user document

        const colRef = collection(db, "users");

        const q = query(colRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        const doc = querySnapshot.docs[0];

        return doc.id;


    }

    const handleMemberDelete = async (email) => {

        if (currentUserIsAdmin() ^ email == auth.currentUser.email) {

            // if (auth.currentUser.email == email) {
            //     alert("You can't delete yourself");
            //     return;
            // }
            
            uid = await getUIDFromEmail(email);

            await console.log("check this:")
            await console.log(uid);

            deleteMemberInDatabase(email, uid);

            // remove from local state
            setFridgeUsers(fridgeUsers.filter(user => user != email));
            
        } else if (currentUserIsAdmin() && email == auth.currentUser.email) {
            alert("You can't delete yourself as you are the admin");
        } else {
            alert(`Only the admin (${adminEmail}) can delete other users`);
        }
    }

    useEffect(() => {
        loadFridgeUsers();
        loadAdmin();

    }, [props.manageModalVisible]);
    

    return (
        <View>
            <Modal visible={props.manageModalVisible} animationType="fade">
                <View style={styles.container}>

                    <TouchableOpacity style={styles.button} onPress={() => props.setManageModalVisible(false)}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={fridgeUsers}
                        style={styles.UsersScroll}
                        renderItem={({ item }) => (
                            <View style={styles.TableRow}>
                                <Text style={styles.text} >{item}</Text>
                                <Ionicons name="trash" size={24} color="black" onPress={() => handleMemberDelete(item)} />
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
