import { StyleSheet, Text, View, TouchableOpacity, FlatListComponent } from "react-native";
import React, { useEffect, useState } from "react";

// component imports
import ScanningCamera from '../components/ScanningCamera.js';


export default function ScanPage({ navigation, route }) {

    const toManualPage = (product_id) => {

        console.log("Product ID received: " + product_id);

        navigation.navigate("ManualPage", {product_id: product_id});
    }

    return (
        <View style={styles.container}>
            <ScanningCamera
            backToHome={() => navigation.navigate("HomePage")}
            toManualPage={toManualPage}
            deleting={false}
            fridge_id={route.params.fridge_id}
            />    
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
