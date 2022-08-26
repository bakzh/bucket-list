import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, StyleSheet } from "react-native";

const DeleteAll = () => {

    return (
        <TouchableOpacity style={styles.container}>
            <Text style={styles.content}>완료항목 전체삭제</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create ({
    container: {
        backgroundColor: '#778899',
    },

    content: {
        fontSize: 25,
        textAlign: "center",
        color: '#000080',
    }
})

export default DeleteAll;