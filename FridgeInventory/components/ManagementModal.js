import React from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';


export default function ManageFridgeModal(props) {

    const [displayData, setDisplayData] = useState([]);

    const formatReferences = (data) => {
            
        const sortedProducts = data
            .sort((a, b) => {
                if (a.food_group < b.food_group) return -1;
                if (a.food_group > b.food_group) return 1;
                return 0;
            })
            .map(item => `${item.product_name} (${item.food_group})`);
        
        return sortedProducts;
            
    }

    const sortData = (data) => {

        if (props.dataType == "Emails") {
            return data
        } else if (props.dataType == "References") {
            return formatReferences(data)
        }

    }

    const handleMemberDelete = async (item) => {

        const status = await props.handleMemberDelete(item);

        if (status) {
            // update local state
            setDisplayData(displayData.filter(ref => ref != item));
        }

    }

    const getTableRowJSX = (item) => {

        if (props.dataType == "Emails") {
            return (
                <View style={styles.TableRow}>
                    <Text style={styles.text} >{item}</Text>
                    <Ionicons name="trash" size={24} color="black" onPress={() => props.handleMemberDelete(item)} />
                </View>
            )
        } else if (props.dataType == "References") {

            let split_list = item.split(" ")

            let product_name = split_list.slice(0, -1).join(" ")
            let food_group = split_list[split_list.length - 1]

            return (
                <View style={styles.TableRow}>

                    <Text style={styles.text} >{product_name}
                        <Text style={getFoodGroupTextStyle(food_group)}> {food_group}</Text>
                    </Text>

                    <Ionicons name="trash" size={24} color="black" onPress={() => handleMemberDelete(item)} />

                </View>
            )
        }

    }

    const getFoodGroupTextStyle = (food_group) => {
        
        let color = "black";

        switch (food_group) {
            case "(Bread)":
                color = "brown";
                break;
            case "(Dairy)":
                color = "blue";
                break;
            case "(Vegetables)":
                color = "green";
                break;
            case "(Fruit)":
                color = "yellow";
                break;
            case "(Sauce)":
                color = "red";
                break;
            case "(Misc)":
                color = "black";
                break;
        }

        return {
            color: color,
        }

    }

    useEffect(() => {
        setDisplayData(sortData(props.data));
    }, [props.data])

    return (
        <View>
            <Modal visible={props.manageModalVisible} animationType="fade">
                <View style={styles.container}>

                    <TouchableOpacity style={styles.button} onPress={() => props.setManageModalVisible(false)}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={displayData}
                        style={styles.UsersScroll}
                        renderItem={({ item }) => (
                                
                            getTableRowJSX(item)
                            
                        )}
                    />

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
        shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.9,
        shadowRadius: 6,
        elevation: 15,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 20,
    },

});