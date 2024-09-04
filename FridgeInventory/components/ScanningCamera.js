import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';
import { db, auth } from '../firebaseConfig.js';
import { setDoc, deleteDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 

// hook imports
import useFetchAdmin from '../hooks/useFetchAdmin.js';

// utility functions
import { getTodayDate, addProducttoDB } from '../functions/utility_functions.js';

export default function ScanningCamera(props) {

    const [facing, setFacing] = useState("back");
    const [scanning, setScanning] = useState(true);
    const [permission, requestPermission] = useCameraPermissions();

    const admin = useFetchAdmin(props.fridge_id);
    const [jwt, setJwt] = useState(null);

    useEffect(() => {
    
        const getJwt = async() => {
            const jwt = await auth.currentUser.getIdToken();
            setJwt(jwt);
        }

        getJwt();

    }, []);


    const toManualPage = (product_id) => {

        props.navigation.navigate("ManualPage", {product_id: product_id, fridge_id: props.fridge_id, admin: admin, jwt: jwt});
    }


    const handleProduct = async(product_id, product_name, food_group) => {

        if (props.deleting) {
            await deleteProductfromDB(product_id, product_name, food_group);
        } else {
            await addProducttoDB(product_id, props.fridge_id,product_name, food_group, admin, jwt);
        }

    }

    checkArrMemebers = (arr1, arr2) => {
        return arr1.some(item => arr2.includes(item));
    }

    // const addProducttoDB = async(product_id, product_name, food_group) => {

    //     try {

    //         docRef = doc(db, "fridges", props.fridge_id.toString(), "inventory", food_group, "items", product_id.toString());

    //         await setDoc(docRef, {
    //             name: product_name,
    //             date_scanned: getTodayDate()
    //         });

    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }

    //     // call backend function to schedule notification
    //     await axios.post("https://fridgeinventoryapi.onrender.com/scheduleNotification", 
    //         {
    //             fridge_id: props.fridge_id,
    //             admin: admin,
    //             product_name: product_name,
    //             product_type: food_group,
    //             product_id: product_id
    //         },
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${jwt}`
    //             }
    //         }
    //     );



    // }

    const deleteProductfromDB = async(product_id, product_name, food_group) => {
    
        await deleteDoc(doc(db, "fridges", props.fridge_id.toString(), "inventory", food_group, "items", product_id.toString()));
        
        // only make cancel api call fi there's no notification in the database

        const notification_id = `${props.fridge_id}_${product_id}`;
        const notificationRef = doc(db, "fridges", props.fridge_id.toString(), "notifications", notification_id);

        const docSnap = await getDoc(notificationRef);

        if (!docSnap.exists()) {

            // call backend function to cancel notification
            await axios.post("https://fridgeinventoryapi.onrender.com/cancelNotification", 
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

        const docRef = doc(db, "fridges", props.fridge_id.toString());
        await updateDoc(docRef, {
            shoppingList: arrayUnion(product_name)
        });

    }

    const getReferenceProduct = async(product_id) => {

        let docRef = doc(db, "fridges", props.fridge_id, "reference", product_id);
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

            toManualPage(product_id);
    
        }
          
    }

    
    const getTemplate = () => {

        if (!permission) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Loading...</Text>
                </View>
            )
        
        } else if (!permission.granted) {
            return (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={() => requestPermission()}>
                        <Text style={styles.buttonText}>Request Permission</Text>
                    </TouchableOpacity>
                </View>
            )

    
        } else {
            return (
                <CameraView style={styles.Camera} facing={facing} onBarcodeScanned={(raw_data) => scanBarcode(raw_data)} >
                </CameraView>
            )

        }
    
    }

    return (
        getTemplate()
    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#eda366",
        alignItems: "center",
        justifyContent: "center",
    },

    Camera: {
        width: "100%",
        height: 100,
        flex: 1,
    },

    button: {
        backgroundColor: "#66b0ed",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 5,
        padding: 10,

        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.9,
        shadowRadius: 6,
        elevation: 15,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 30,
    },

    text: {
        fontSize: 30,
    }

});
