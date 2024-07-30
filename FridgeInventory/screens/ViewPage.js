// boilerplate
import { Text, View, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from "react";

export default function ManualPage({ navigation }) {
    
    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.HomePageButtons} onPress={() => navigation.navigate('VegetablePage')}>
                <Text style={styles.VegText}>Vegetables</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.HomePageButtons}>
                <Text style={styles.FruitText}>Fruit</Text>
            </TouchableOpacity>
             
            <TouchableOpacity style={styles.HomePageButtons}>
                <Text style={styles.DairyText}>Dairy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.HomePageButtons}>
                <Text style={styles.SaucesText}>Sauces</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.HomePageButtons}>
                <Text style={styles.MiscText}>Misc</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#eda366",
        padding: 16,
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

    HomePageButtons: {
        backgroundColor: "#ffffff",
        color: "#ffffff",
        padding: 10,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        marginVertical: 30,
        alignSelf: "stretch",
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 20,
    },

    TimedButton: {
        backgroundColor: "#ffffff",
        color: "#ffffff",
        padding: 10,
        margin: 10,
        justifyContent: "center",
        paddingHorizontal: 20,
        marginVertical: 30,
        alignSelf: "stretch",
        alignItems: "center",
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
        fontFamily: "Mulish-Regular",
    },

});