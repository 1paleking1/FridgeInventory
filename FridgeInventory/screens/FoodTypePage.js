import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

// component imports
import FoodTable from '../components/FoodTable';



export default function FoodTypePage({ route, navigation }) {

    return (
        <View style={styles.container}>
                        
            <FoodTable food_group={route.params.food_type} />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#eda366",
    },


});
