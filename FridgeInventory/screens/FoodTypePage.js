import { StyleSheet, View } from "react-native";
import React from "react";

// component imports
import FoodTable from '../components/FoodTable';

export default function FoodTypePage({ route }) {

    return (
        <View style={styles.container}>
                        
            <FoodTable food_group={route.params.food_type} fridge_id={route.params.fridge_id} />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#eda366",
    },


});
