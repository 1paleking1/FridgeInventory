import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { CameraView } from 'expo-camera';
import axios from 'axios';
import { db, auth } from '../firebaseConfig.js';
import { collection, setDoc, deleteDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 

// hook imports
import useFetchAdmin from '../hooks/useFetchAdmin.js';

// utility functions
import { getTodayDate } from '../functions/utility_functions.js';

export default function ScanningCamera(props) {

    const [facing, setFacing] = useState("back");
    const [scanning, setScanning] = useState(true);
    
    const admin = useFetchAdmin(props.fridge_id);
    const [jwt, setJwt] = useState(null);

    useEffect(() => {
    
        const getJwt = async() => {
            const jwt = await auth.currentUser.getIdToken();
            setJwt(jwt);
        }

        getJwt();

    }, []);



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
            await deleteProductfromDB(product_id, product_name, food_group);
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
        console.log("jwt is ", jwt)
        // call backend function to schedule notification
        await axios.post("http://192.168.1.147:3000/scheduleNotification", 
            {
                fridge_id: props.fridge_id,
                admin: admin,
                product_name: product_name,
                product_type: food_group,
                product_id: product_id
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );



    }

    const deleteProductfromDB = async(product_id, product_name, food_group) => {
    
        await deleteDoc(doc(db, "fridges", props.fridge_id.toString(), "inventory", food_group, "items", product_id.toString()));
        
        // only make cancel api call fi there's no notification in the database

        const notification_id = `${props.fridge_id}_${product_id}`;
        const notificationRef = doc(db, "fridges", props.fridge_id.toString(), "notifications", notification_id);

        const docSnap = await getDoc(notificationRef);

        if (!docSnap.exists()) {
            console.log("cancelling notification")
            // call backend function to cancel notification


            await axios.post("http://192.168.1.147:3000/cancelNotification", 
                {
                    job_name: `${props.fridge_id}_${product_id}`
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            );


        } else {
            await deleteDoc(notificationRef);
        }


        // add item to shopping list array
        const docRef = doc(db, "fridges", props.fridge_id.toString());
        await updateDoc(docRef, {
            shoppingList: arrayUnion(product_name)
        });

        // delete notification from database
        // const notificationRef = doc(db, "fridges", props.fridge_id.toString(), "notifications", notification_id);


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
