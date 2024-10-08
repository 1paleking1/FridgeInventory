import { StyleSheet, View } from "react-native";
import React from "react";

// component imports
import ScanningCamera from '../components/ScanningCamera.js';


export default function DeletePage({ navigation, route }) {

    return (
        <View style={styles.container}>

            <ScanningCamera
            backToHome={() => navigation.navigate("HomePage")}
            deleting={true}
            fridge_id={route.params.fridge_id}
            navigation={navigation}
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
