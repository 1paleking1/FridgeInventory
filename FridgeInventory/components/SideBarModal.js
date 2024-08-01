import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function ScheduleModal(props) {

    return (

        <View>
            <Modal visible={props.modalOpen} transparent={true} animationType='fade'>
                <View style={styles.ModalBackgroundOpacity}>

                    <View style={styles.ModalWindow}>

                        <TouchableOpacity onPress={setModalOpen}>
                            <Text style={styles.CloseButton}>❌</Text>
                        </TouchableOpacity>

                        <View style={styles.Row}>
                            <ModalDropDown data={data} setSelected={setSelected} setModalOpen={setModalOpen}/>
                        </View>

                    </View>

                </View>
            </Modal>
        </View>

    )

}

const styles = StyleSheet.create({

    ModalWindow: {
        justifyContent: "top",
        borderWidth: 3,
        backgroundColor: "#ffffff",
        padding: 10,
        // paddingHorizontal: "20%",
        borderRadius: 15,
        // width: "100%",
        // make modal cover bottom half of screen
        // height: "50%",
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

    Row: {
        flexDirection: "row",
        alignItems: "center",
        // borderWidth: 3,
        paddingTop: 10
    },

});