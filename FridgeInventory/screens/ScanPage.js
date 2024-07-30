import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';

import db from '../firebaseConfig.js';
import { collection, addDoc } from "firebase/firestore"; 


export default function HomePage({ navigation }) {

    const [facing, setFacing] = useState("back");

    const getTodayDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }

    const addProducttoDB = async(product_id, product_name) => {

        try {

            const docRef = await addDoc(collection(db, "inventory"), {
                name: product_name,
                product_id: product_id,
                date_scanned: getTodayDate(),
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }

    const scanBarcode = (raw_data) => {

        product_id = raw_data.data;

        axios.get(`https://world.openfoodfacts.net/api/v2/product/${product_id}?fields=product_name`)

            .then((response) => {      
                console.log(response.data.product.product_name);          
                addProducttoDB(product_id, response.data.product.product_name);
            })
            .catch((error) => {
                console.log("error in axios request")
                console.log(error);
            });
        


        // go back to the home Page
        navigation.navigate('HomePage');
        

        
    }


    return (
        <View style={styles.container}>
                        
            <CameraView style={styles.Camera} facing={facing} onBarcodeScanned={(raw_data) => scanBarcode(raw_data)}>

            </CameraView>

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

    Camera: {
        width: "100%",
        height: 100,
        flex: 1,

    },

});
