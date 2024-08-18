import { StyleSheet, View, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';

export default function ShoppingAddModal(props) {

    const [item, setItem] = useState("");

    return (
        <Modal visible={props.modalVisible} transparent={true} animationType='slide'>
            <TouchableWithoutFeedback onPress={() => props.setModalVisible(false)}>
                <View style={styles.ModalBackground}>
                <TouchableWithoutFeedback>
                    <View style={styles.ModalWindow}>
                        
                        <View style={styles.row}>
                            <TextInput
                                onChangeText={setItem}
                                placeholder="Enter Item"
                                style={styles.textInput}
                            />

                            <TouchableOpacity onPress={() => props.addItem(item)} style={styles.plusIcon} >
                                <Ionicons name="add-outline" size={36} color="black" />
                            </TouchableOpacity>
                        </View>


                    </View>
                </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eda366",
        alignItems: "center",
        justifyContent: "top",
    },

    ModalWindow: {
        justifyContent: "top",
        borderWidth: 3,
        backgroundColor: "#ffffff",
        padding: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: '30%',
        marginTop: 'auto',
        width: '100%',
        alignItems: "center",
    },

    ModalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    plusIcon: {

    },

    textInput: {
        borderWidth: 1,
        borderColor: "#000",
        width: "80%",
        padding: 10,
        margin: 10,
        borderRadius: 5,
        fontSize: 20,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

});

