// boilerplate
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { CameraView } from 'expo-camera';
import axios from 'axios';
import db from '../firebaseConfig.js';
import { collection, setDoc, deleteDoc, doc, getDoc } from "firebase/firestore"; 

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

        if (checkArrMemebers(keywords, ["vegetable", "pak"])) {
            food_group = "Vegetable";
        } else if (checkArrMemebers(keywords, ["fruit"])) {
            food_group = "Fruit";
        } else if (checkArrMemebers(keywords, ["dairy", "milk", "egg"])) {
            food_group = "Dairy";
        } else if (checkArrMemebers(keywords, ["sauce"])) {
            food_group = "Sauce";
        } else if (checkArrMemebers(keywords, ["bread"])) {
            food_group = "Bread";
        }

        return food_group;
    }

    const handleProduct = async(product_id, product_name, food_group) => {
    
        if (props.deleting) {
            await deleteProductfromDB(product_id, food_group);
        } else {
            await addProducttoDB(product_id, product_name, food_group);
        }

    }

    checkArrMemebers = (arr1, arr2) => {
        return arr1.some(item => arr2.includes(item));
    }

    const addProducttoDB = async(product_id, product_name, food_group) => {

        try {

            docRef = doc(db, "inventory", food_group, "items", product_id);

            await setDoc(docRef, {
                name: product_name,
                date_scanned: getTodayDate()
            });

        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }

    const deleteProductfromDB = async(product_id, food_group) => {
    
        await deleteDoc(doc(db, "inventory", food_group, "items", product_id));
        console.log("Document successfully deleted!");
        
    }

    const getReferenceProduct = async(product_id) => {

        let docRef = doc(db, "reference", product_id.toString());
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
          } else {
            return null;
          }
    }

    const scanBarcode = async(raw_data) => {

        let product_id = raw_data.data;
        
        let cached_reference = await getReferenceProduct(product_id);

        if (cached_reference != null) {
            handleProduct(product_id, cached_reference.product_name, cached_reference.food_group);
        } else{

            axios.get(`https://world.openfoodfacts.net/api/v2/product/${product_id}`)
    
                .then((response) => {
    
                    let food_group = getFoodGroup(response.data.product._keywords);
    
                    handleProduct(product_id, response.data.product.product_name, food_group);
                })
                .catch((error) => {
                    alert("Product not found");
                    props.toManualPage(product_id);
                });
    
        }

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
