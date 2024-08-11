// boilerplate
import { Text, View, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from "react";

export default function ViewPage({ navigation, route }) {
    // note that fridge id comes from props
    return (
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.ViewPageButtons} onPress={() => navigation.navigate('FoodTypePage', {food_type: "Vegetable", fridge_id: route.params.fridge_id})}>
                <Text style={styles.VegText}>Vegetables</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ViewPageButtons} onPress={() => navigation.navigate('FoodTypePage', {food_type: "Fruit", fridge_id: route.params.fridge_id})}>
                <Text style={styles.FruitText}>Fruit</Text>
            </TouchableOpacity>
             
            <TouchableOpacity style={styles.ViewPageButtons} onPress={() => navigation.navigate('FoodTypePage', {food_type: "Dairy", fridge_id: route.params.fridge_id})}>
                <Text style={styles.DairyText}>Dairy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ViewPageButtons} onPress={() => navigation.navigate('FoodTypePage', {food_type: "Bread", fridge_id: route.params.fridge_id})}>
                <Text style={styles.BreadText}>Bread</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ViewPageButtons} onPress={() => navigation.navigate('FoodTypePage', {food_type: "Sauce", fridge_id: route.params.fridge_id})}>
                <Text style={styles.SaucesText}>Sauces</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ViewPageButtons} onPress={() => navigation.navigate('FoodTypePage', {food_type: "Misc", fridge_id: route.params.fridge_id})}>
                <Text style={styles.MiscText}>Misc</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#eda366",
        padding: 15,
        justifyContent: "space-evenly"
        
    },

    head: {
        height: 40,
        backgroundColor: '#f1f8ff'
    },

    row: {
        backgroundColor: '#fcde8b'
    },

    text: {
        margin: 5,
        fontSize: 20
    },

    ViewPageButtons: {
        backgroundColor: "#ffffff",
        color: "#ffffff",
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
        // spacing between buttons based on the screen size
        // marginVertical: "10%",
        alignSelf: "stretch",
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 20,
    },

    VegText: {
        fontSize: 30,
        color: "#45ba30",
    },

    FruitText: {
        fontSize: 30,
        color: "#f5810c",
    },

    DairyText: {
        fontSize: 30,
        color: "#1f80ff",
    },

    SaucesText: {
        fontSize: 30,
        color: "#fc1717",
    },

    BreadText: {
        fontSize: 30,
        color: "#a85811",
    },

    MiscText: {
        fontSize: 30,
        color: "#000000",
    },

    ButtonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    Title: {
        fontSize: 50,
        color: "#000000",
        marginBottom: 80,
    },

});