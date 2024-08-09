import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';

// component imports



export default function ShoppingListPage({ navigation, route }) {

    // const data = ["Apples", "Oranges", "Bananas", "Milk", "Eggs", "Bread", "Oranges", "Bananas", "Milk", "Eggs", "Bread", "Oranges", "Bananas", "Milk", "Eggs", "Bread"];

    const [data, setData] = useState(["Apples", "Oranges", "Bananas", "Milk", "Eggs", "Bread", "Oranges", "Bananas", "Milk", "Eggs", "Bread", "Oranges", "Bananas", "Milk", "Eggs", "Bread"]);

    const deleteItem = (item) => {
    
        const newData = data.filter((data) => data !== item);
        setData(newData);

    }

    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <Ionicons name="arrow-undo-circle-sharp" size={36} color="black" />
                <Ionicons name="add-circle-sharp" size={36} color="black" />
            </View>


            <FlatList
            data={data}
            style={styles.UsersScroll}
            renderItem={({ item }) => (
                <View style={styles.TableRow}>
                    <Text style={styles.text} >{item}</Text>
                    <Ionicons name="trash" size={24} color="black" onPress={() => deleteItem(item)} />
                </View>
            )}
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
    TableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    text: {
        fontSize: 20,
    },

    title: {
        fontSize: 30,
        margin: 20,
    },

    UsersScroll: {
        width: 300,
    },

    button: {
        backgroundColor: "#66b0ed",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 5,
        marginTop: 40,
        marginBottom: 20,
        width: 150,
        height: 50,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 20,

    },

});

