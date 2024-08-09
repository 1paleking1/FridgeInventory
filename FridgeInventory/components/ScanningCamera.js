import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { CameraView } from 'expo-camera';
import axios from 'axios';
import { db, auth } from '../firebaseConfig.js';
import { collection, setDoc, deleteDoc, doc, getDoc } from "firebase/firestore"; 

// hook imports
import useFetchAdmin from '../hooks/useFetchAdmin.js';

export default function ScanningCamera(props) {

    const [facing, setFacing] = useState("back");
    const [scanning, setScanning] = useState(true);
    const admin = useFetchAdmin(props.fridge_id);

    // const fridge_id = useFetchFridgeID(auth.currentUser);

    const getTodayDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today;
    } 

    // getFridgeID = async() => {

    //     let user = auth.currentUser;
    //     let docRef = doc(db, "users", user.uid);
    //     let docSnap = await getDoc(docRef);

    //     if (docSnap.exists()) {
    //         return docSnap.data().fridge_id;
    //       } else {
    //         return null;
    //     }
        
    // }

    // useEffect(() => {
        

    // }, [auth.currentUser]);


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

            docRef = doc(db, "fridges", props.fridge_id.toString(), "inventory", food_group, "items", product_id.toString());

            await setDoc(docRef, {
                name: product_name,
                date_scanned: getTodayDate()
            });

        } catch (e) {
            console.error("Error adding document: ", e);
        }


        console.log("making axios call")
        // call backend function to schedule notification
        await axios.post("http://192.168.1.147:3000/scheduleNotification", {
            fridge_id: props.fridge_id,
            admin: admin,
            product_name: product_name,
            product_type: food_group
        })

    }

    const deleteProductfromDB = async(product_id, food_group) => {
    
        await deleteDoc(doc(db, "fridges", props.fridge_id.toString(), "inventory", food_group, "items", product_id.toString()));
        console.log("Document successfully deleted!");
        
        // call backend function to cancel notification
        await axios.post("http://192.168.1.147:3000/cancelNotification", {
            job_name: `${props.fridge_id}_${product_id}`
        })

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


    const productInDatabase = async(product_id ,food_group) => {

        const docRef = doc(db, "fridges", props.fridge_id.toString(), "inventory", food_group, "items", product_id.toString());
        const docSnap = await getDoc(docRef);

        return docSnap.exists();

    }


    const scanBarcode = async(raw_data) => {

        if (!scanning) {
            return;
        }

        setScanning(false);
        
        let product_id = await raw_data.data;

        // exists = productInDatabase(product_id)

        // if (exists && !props.deleting) {
        //     alert("Product already exists in the fridge");
        //     props.backToHome();
        // } else if (!exists && props.deleting) {
        //     alert("Product does not exist in the fridge");
        //     props.backToHome();
        // }

        let cached_reference = await getReferenceProduct(product_id);

        if (cached_reference) {
            
            exists = await productInDatabase(product_id, cached_reference.food_group);

            console.log("exists set to ", exists);

            if (exists && !props.deleting) {
                alert("Product already exists in the fridge");
                props.backToHome();
            } else if (!exists && props.deleting) {
                alert("Product does not exist in the fridge");
                props.backToHome();
            }

            handleProduct(product_id, cached_reference.product_name, cached_reference.food_group);
            props.backToHome();

        } else {
            
            alert("Product not found");

            await props.toManualPage(product_id);
            
            // try {

                // res = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${product_id}`)
                
                // console.log(res.data.product.product_name);
                
                // let food_group = getFoodGroup(res.data.product._keywords);
                
                // handleProduct(product_id, res.data.product.product_name, food_group);                

            // } catch (error) {
            //     alert("Product not found"); 
            //     props.toManualPage(product_id);
            // }
    
        }
          
    }

    return (

            <CameraView style={styles.Camera} facing={facing} onBarcodeScanned={(raw_data) => scanBarcode(raw_data)} >
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
