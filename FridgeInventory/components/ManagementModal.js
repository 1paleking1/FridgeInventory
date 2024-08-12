import React, { Component } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

// hooks
import useFetchAdmin from '../hooks/useFetchAdmin';

export default function ManageFridgeModal(props) {

    const [displayData, setDisplayData] = useState([]);

    const splitOnLastSpace = (str) => {
        return str.split(" ").slice(0, -1).join(" ")
    }

    const sortData = (data) => {

        // sort data based on the food_group which is splitOnLastSpace and then the last part
        // of the string

        data.sort((product_name, food_group) => {
        
            

            
        
        });



    }

    useEffect(() => {
        console.log(props.data);
        setDisplayData(sortData(props.data));
        console.log("display data:")
        console.log(displayData);

    }, [])

    return (
        <View>
            <Modal visible={props.manageModalVisible} animationType="fade">
                <View style={styles.container}>

                    <TouchableOpacity style={styles.button} onPress={() => props.setManageModalVisible(false)}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={displayData}
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