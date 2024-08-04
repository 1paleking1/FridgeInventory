// boilerplate
import React, { Component } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function ManageFridgeModal(props) {

    return (
        <View style={styles.container}>
            <Modal visible={props.manageModalVisible}>

                <Text>Manage asdfasdf Modal</Text>
                
                <TouchableOpacity onPress={() => props.setManageModalVisible(false)}>
                    <Text>Close</Text>
                </TouchableOpacity>

            </Modal>
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
});
