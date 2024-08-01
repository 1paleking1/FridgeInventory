import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect, Suspense } from "react";
import { usePushNotifications } from "../components/usePushNotifications";
import { auth } from "../firebaseConfig";


export default function HomePage({ navigation }) {
    
    const { expoPushToken, notification } = usePushNotifications();

    const data = JSON.stringify(notification, undefined, 2);
    // ExponentPushToken[1HtfjOLJ5Sn0tD-w6SKX6d]
    return (

            <View style={styles.container}>
                
                <Text>Token: {expoPushToken?.data ?? "No token"}</Text>
                <Text>{data}</Text>
                <Text>signed in as {auth.currentUser.email}</Text>
                            
                <TouchableOpacity style={styles.HomePageButtons} onPress={() => navigation.navigate('ScanPage')}>
                    <Text style={styles.ButtonText}>Scan</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.HomePageButtons} onPress={() => navigation.navigate('DeletePage')}>
                    <Text style={styles.ButtonText}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.HomePageButtons} onPress={() => navigation.navigate('ViewPage')}>
                    <Text style={styles.ButtonText}>View</Text>
                </TouchableOpacity>


            </View>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#eda366",
        alignItems: "center",
        justifyContent: "center",
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

    ButtonText: {
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
