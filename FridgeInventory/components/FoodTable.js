import { StyleSheet, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Table, Row, Rows } from 'react-native-table-component';

// firebase imports
import { db } from '../firebaseConfig.js';
import { collection, getDocs } from "firebase/firestore"; 


export default function FoodTable(props) {

    let table_head = ['Product Name', 'Date Scanned'];
    const [table_data_state, setTableData] = useState([]);   
    
    const loadData = (food_group) => {

        let table_data = [];
        const querySnapshot = getDocs(collection(db, "fridges", props.fridge_id, "inventory", food_group, "items"));
        querySnapshot.then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                table_data.push([doc.data().name, doc.data().date_scanned]);
            });

            setTableData(table_data);
        });

    }

    useEffect(() => {
        
        if (props.fridge_id != null) {
            loadData(props.food_group);
        }

    }, [props.fridge_id, props.food_group]);

    return (
        <View style={styles.container}>
                        
            <ScrollView>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={table_head} style={styles.head} textStyle={styles.text}/>
                    <Rows data={table_data_state} textStyle={styles.text} style={styles.row} />
                </Table>
            </ScrollView>

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

    row: {
        backgroundColor: '#fcde8b'
    },

    text: {
        margin: 5,
        fontSize: 20
    },


});
