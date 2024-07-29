import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';
import db from "@react-native-firebase/database";



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


    const scanBarcode = (raw_data) => {

        product_id = raw_data.data;

        axios.get(`https://world.openfoodfacts.net/api/v2/product/${product_id}?fields=product_name`)

            .then((response) => {
                console.log(response.data.product.product_name);
                addProduct(product_id);
                // createInventoryTable(db);
                // createInventoryTable(db);
                // getProductInventory(db);

            })
            .catch((error) => {
                console.log(error);
            });
        


        // go back to the home Page
        navigation.navigate('HomePage');
        

        
    }

    const addProduct = (product_id) => {
    
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
