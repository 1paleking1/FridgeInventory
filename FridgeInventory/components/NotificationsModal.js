import React from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsModal(props) {
    return (
        <Modal visible={props.modalOpen} animationType='slide' transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modal}>

                    <Text style={styles.title}>Notifications</Text>
                    <TouchableOpacity onPress={() => props.setModalOpen(false)}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modal: {
        width: '80%',
        height: '60%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
});