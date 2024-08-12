import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, TouchableWithoutFeedback, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install and import Ionicons
import { collection, setDoc, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from '../firebaseConfig';
import * as Clipboard from 'expo-clipboard';
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function DataList(props) {


    

    return (

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

    )

}