import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';




export default function HomePage({ navigation }) {

    const [facing, setFacing] = useState("back");

    const scanBarcode = (raw_data) => {

        product_id = raw_data.data;

        addProduct(product_id);

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
