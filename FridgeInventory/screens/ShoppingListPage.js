import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, TextInput, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';

// component imports



export default function ShoppingListPage({ navigation, route }) {

    // const data = ["Apples", "Oranges", "Bananas", "Milk", "Eggs", "Bread", "Oranges", "Bananas", "Milk", "Eggs", "Bread", "Oranges", "Bananas", "Milk", "Eggs", "Bread"];

    const [data, setData] = useState(["Apples", "Oranges", "Bananas", "Milk", "Eggs", "Bread", "Oranges", "Bananas", "Milk", "Eggs", "Bread", "Oranges", "Bananas", "Milk", "Eggs", "Bread"]);
    const [modalVisible, setModalVisible] = useState(false);


    const deleteItem = (item) => {
    
        const newData = data.filter((data) => data !== item);
        setData(newData);

    }

    const addItem = (item) => {
    
        const newData = [...data, item];
        setData(newData);
    
    }

    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <Ionicons style={styles.icon} name="arrow-undo-circle-sharp" size={36} color="black" />
                <Ionicons style={styles.icon} name="add-circle-sharp" size={36} color="black" onPress={() => setModalVisible()} />
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

            <Modal visible={modalVisible} transparent={true} animationType='slide'>
                <View style={styles.ModalWindow}>

                    <Text style={styles.title}>Add Item</Text>

                    <TextInput
                        style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={text => addItem(text)}
                        placeholder="Enter Item"
                    />

                    <TouchableOpacity style={styles.button} onPress={() => addItem("New Item")}>
                        <Text style={styles.buttonText}>Add Item</Text>
                    </TouchableOpacity>

                </View>

            </Modal>


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

    icon: {
        marginHorizontal: 30,
        marginVertical: 20,
    },
    ModalWindow: {
        justifyContent: "top",
        borderWidth: 3,
        backgroundColor: "#ffffff",
        padding: 10,
        // top left and top right radius is 15
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        


        height: '50%',
        marginTop: 'auto',
        width: '100%',
        alignItems: "center",

    },

    ModalBackgroundOpacity: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    Title: {
        fontSize: 25,
        justifyContent: "center",
        alignItems: "center",
    },

    CloseButton: {
        fontSize: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 10,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 0,
        paddingBottom: 10,
        paddingTop: 10,
        // position: "relative",
        // left:2,
        // top: 10,
        
    },

});

