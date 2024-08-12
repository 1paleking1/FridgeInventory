import React, { Component } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDoc, doc, updateDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

// hooks
import useFetchAdmin from '../hooks/useFetchAdmin';

// components
import ManagementModal from './ManagementModal';

export default function ManageFridgeModal(props) {

    const [references, setReferences] = useState([]);

    const adminEmail = useFetchAdmin(props.fridgeID);

    const currentUserIsAdmin = () => {
        return adminEmail == auth.currentUser.email;
    }

    const handleMemberDelete = async (item) => {

        if (!currentUserIsAdmin()) {
            alert("Only the admin can change the fridge references")
            return;
        }

        const colRef = collection(db, "fridges", props.fridgeID, "reference");
        
        const product_name = splitOnLastSpace(item);
        const q = query(colRef, where("product_name", "==", product_name));
        const querySnapshot = await getDocs(q);
        const doc = querySnapshot.docs[0];

        // delete from database
        await deleteDoc(doc.ref);

        // delete from local state
        setReferences(references.filter(ref => ref != item));

    }

    const splitOnLastSpace = (str) => {
        return str.split(" ").slice(0, -1).join(" ")
    }

    const loadData = async () => {
        
        const colRef = collection(db, "fridges", props.fridgeID, "reference");

        // if the collection exists, get the documents
        const q = query(colRef);
        const querySnapshot = await getDocs(q);

        let display_data = [];

        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            display_data.push(`${doc.data().product_name} (${doc.data().food_group})`);
        });

        setReferences(display_data);

    }

    useEffect(() => {

        loadData();

    }, [props.manageModalVisible]);


    return (

        
        <View>
            <ManagementModal
                data={references}
                manageModalVisible={props.manageModalVisible}
                setManageModalVisible={props.setManageModalVisible}
                handleMemberDelete={handleMemberDelete}
            />
        </View>
    );
}

