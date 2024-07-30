// boilerplate
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

// firebase imports
import db from '../firebaseConfig.js';
import { collection, getDocs } from "firebase/firestore"; 


export default function ManualPage() {

    let table_head = ['Product Name', 'Date Scanned'];

    const [table_data_state, setTableData] = useState([]);

    const loadData = () => {
        console.log("Loading data...");
        let inventoryRef = collection(db, "inventory");
        let inventorySnapshot = getDocs(inventoryRef);

        inventorySnapshot.then((querySnapshot) => {
            let table_data = [];
            querySnapshot.forEach((doc) => {
                table_data.push([doc.data().name, doc.data().date_scanned]);
            });
            setTableData(table_data);
        });
    }

    useEffect(() => {
        loadData();
    }, []);
    
    return (
        <View style={styles.container}>
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                <Row data={table_head} style={styles.head} textStyle={styles.text}/>
                <Rows data={table_data_state} textStyle={styles.text}/>
            </Table>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#eda366",
        padding: 16,
    },

    head: {
        height: 40,
        backgroundColor: '#f1f8ff'
    },

    text: {
        margin: 5,
        fontSize: 20
    }

});