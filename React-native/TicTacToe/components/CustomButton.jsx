import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

function CustomButton({value, onClick}) {
    const onPress = () => {
        console.log("Custom btn");
    }
    return (
        <TouchableOpacity className="float-left border border-red-600 text-4xl p-0 h-[100px] items-center justify-center w-[100px] -mr[1px] -mt[1px] cursor-pointer" onPress={onClick}>
            {value && 

            <Text className="text-4xl">{value}</Text>
            }
        </TouchableOpacity>
    );
}


export default CustomButton;