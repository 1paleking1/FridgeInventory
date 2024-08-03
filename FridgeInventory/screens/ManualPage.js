// boilerplate
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, Touchable } from 'react-native';
import React, { useEffect, useState } from "react";
import { SelectList } from 'react-native-dropdown-select-list'

import { db } from '../firebaseConfig.js';
import { collection, setDoc, deleteDoc, doc } from "firebase/firestore"; 


export default function ManualPage(props) {

    const [product_id, setProductID] = useState(props.route.params.product_id);

    const addToDatabase = () => {

        console.log(product_id)
        
        const docRef = doc(db, "reference", product_id);

        setDoc(docRef, {
            product_name: product_name,
            food_group: selected_food_group,
        });

        alert("Product added to database!");
    }

    const handleSubmit = () => {

        addToDatabase();
        props.navigation.navigate("HomePage");
    
    }


    const food_groups = [
        { key: 'Fruits', value: 'Fruits' },
        { key: 'Vegetables', value: 'Vegetables' },
        { key: 'Dairy', value: 'Dairy' },
        { key: 'Bread', value: 'Bread' },
        { key: 'Sauce', value: 'Sauce' },
        { key: 'Misc', value: 'Misc' },
    ];

    const [selected_food_group, setSelectedFoodGroup] = useState("");
    const [product_name, setProductName] = useState("");
  
    
    return (
        <View style={styles.container}>

            <View style={styles.formBox} >
                <Text style={styles.labelText} >Product Name:</Text>

                <TextInput
                style={styles.nameInput} 
                placeholder="Product Name..."
                onChangeText={(val) => setProductName(val)}
                />
                

                <SelectList 
                data={food_groups}
                setSelected={(val) => setSelectedFoodGroup(val)} 
                inputStyles={styles.pickerInput}          
                dropdownTextStyles={styles.pickerOptions}
                
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit} >
                    <Text style={styles.buttonText} >Submit</Text>
                </TouchableOpacity>

            </View>



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

    formBox: {
        backgroundColor: "#ffffff",
        padding: 50,
        borderRadius: 20,
    },

    pickerInput: {
        fontSize: 20,
    },

    pickerOptions: {
        fontSize: 15,
    },

    nameInput: {
        fontSize: 20,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        width: 200,
        padding: 10,
    },

    button: {
        backgroundColor: "#66b0ed",
        color: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 20,
        marginTop: 40,
    },

    labelText: {
        fontSize: 25,
        color: "#000000",
        marginBottom: 10,
    },

    buttonText: {
        fontSize: 25,
        color: "#ffffff",
        marginVertical: 5,
    },

});
