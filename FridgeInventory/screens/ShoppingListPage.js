import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, TextInput, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { collection, setDoc, deleteDoc, doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db, auth } from '../firebaseConfig';

// component imports
import ShoppingAddModal from "../components/ShoppingAddModal";



export default function ShoppingListPage({ navigation, route }) {

    const [data, setData] = useState([]);
    const [deleteStack, setDeleteStack] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const deleteItem = (item) => {
    
        const newData = data.filter((data) => data !== item);
        setData(newData);

        setDeleteStack([...deleteStack, item]);

        const docRef = doc(db, "fridges", route.params.fridge_id);
        updateDoc(docRef, {
            shoppingList: arrayRemove(item)
        });


    }

    const addItem = (item) => {

        const newData = [item, ...data];
        setData(newData);

        // append to the database
        const docRef = doc(db, "fridges", route.params.fridge_id);
        updateDoc(docRef, {
            shoppingList: arrayUnion(item)
        });
    
    }

    const undoDelete = () => {
    
        if (deleteStack.length > 0) {
            const item = deleteStack.pop();
            const newData = [item, ...data];
            setData(newData);

            const docRef = doc(db, "fridges", route.params.fridge_id);
            updateDoc(docRef, {
                shoppingList: arrayUnion(item)
            });
        }

   

    }

    const loadShoppingList = async () => {
        
        const docRef = doc(db, "fridges", route.params.fridge_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setData(data.shoppingList);
        }
    
    }


    useEffect(() => {
    
        loadShoppingList();

    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Ionicons style={styles.icon} name="arrow-undo-circle-sharp" size={36} color="black" onPress={() => undoDelete()} />
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

            <ShoppingAddModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            addItem={addItem} />


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
        width: "80%",
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

});

