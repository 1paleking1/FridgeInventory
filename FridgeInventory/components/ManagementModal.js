import React, { Component } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

// hooks
import useFetchAdmin from '../hooks/useFetchAdmin';

export default function ManageFridgeModal(props) {

    const [data, setData] = useState([]);

    const loadData = async (docRef) => {
    
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setData(docSnap.data().users);
        } else {
            console.log("No such document!");

        }

    }

    useEffect(() => {

        loadData(props.dataDocRef);

    }, [props.manageModalVisible]);

    return (
        <View>
            <Modal visible={props.manageModalVisible} animationType="fade">
                <View style={styles.container}>

                    <TouchableOpacity style={styles.button} onPress={() => props.setManageModalVisible(false)}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={data}
                        style={styles.UsersScroll}
                        renderItem={({ item }) => (
                            <View style={styles.TableRow}>
                                <Text style={styles.text} >{item}</Text>
                                <Ionicons name="trash" size={24} color="black" onPress={() => props.handleMemberDelete(item)} />
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
        width: "80%",
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