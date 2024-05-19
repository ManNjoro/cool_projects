import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../config/colors';

function CustomButton(props) {
    const onPress = () => {
        console.log("Custom btn");
    }
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.buttonText}>Hello</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        elevation: 8,
        backgroundColor: 'blue',
        borderRadius: 10,
        padding: 5
    },
    buttonText: {
        fontSize: 15,
        color: colors.white,
        alignItems: 'center'
    }
})

export default CustomButton;