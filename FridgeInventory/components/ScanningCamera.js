// boilerplate
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { CameraView } from 'expo-camera';
import axios from 'axios';
import db from '../firebaseConfig.js';
import { collection, setDoc, deleteDoc, doc } from "firebase/firestore"; 

export default function ScanningCamera(props) {

    const [facing, setFacing] = useState("back");

    const getTodayDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }

    const getFoodGroup = (keywords) => {

        let food_group = "Misc";

        if (keywords.includes("vegetable")) {
            food_group = "Vegetable";
        } else if (keywords.includes("fruit")) {
            food_group = "Fruit";
        } else if (keywords.includes("dairy")) {
            food_group = "Dairy";
        } else if (keywords.includes("sauce")) {
            food_group = "Sauce";
        } else if (keywords.includes("bread")) {
            food_group = "Bread";

        return food_group;

        }
    }

    const handleProduct = async(product_id, product_name, food_group) => {
    
        if (props.deleting) {
            deleteProductfromDB(product_id, food_group);
        } else {
            addProducttoDB(product_id, product_name, food_group);
        }

    }

    const addProducttoDB = async(product_id, product_name, food_group) => {

        try {

            docRef = doc(db, "inventory", food_group, product_id);

            await setDoc(docRef, {
                name: product_name,
                date_scanned: getTodayDate()
            });

        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }

    const deleteProductfromDB = async(product_id, food_group) => {
    
        await deleteDoc(doc(db, "inventory", food_group, product_id));
        console.log("Document successfully deleted!");
        
    }

    const scanBarcode = (raw_data) => {

        let product_id = raw_data.data;

        axios.get(`https://world.openfoodfacts.net/api/v2/product/${product_id}`)

            .then((response) => {      
                console.log(response.data.product.product_name);

                let food_group = getFoodGroup(response.data.product._keywords);

                handleProduct(product_id, response.data.product.product_name, food_group);
            })
            .catch((error) => {
                alert("Product not found");
                console.log(error);
            });

        props.backToHome();
          
    }

    return (

            <CameraView style={styles.Camera} facing={facing} onBarcodeScanned={(raw_data) => scanBarcode(raw_data)}>
            </CameraView>

    )

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
