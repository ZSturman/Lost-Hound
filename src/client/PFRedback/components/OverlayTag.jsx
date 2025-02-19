import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

const OverlayTag = ({ text, colour = '#DC7F90'} ) => {

    return (
        <View className="m-1">
                <View className="w-auto flex self-center rounded-[3px] items-center justify-center pr-[5px] pl-[5px] h-auto"

                        style={{ backgroundColor: colour }}  
                    >

                <Text className="text-white text-xs"> 
                    {text} 
                </Text>
        
            </View>
        </View>
    );
}

export default OverlayTag