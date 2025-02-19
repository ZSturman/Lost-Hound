import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";

const EditButton = () => {
    
    return (
        <View className="mt-1 overflow-hidden rounded-[10px]">
                <Link 
                    className="w-auto flex self-center items-center justify-center pr-[15px] pl-[15px] h-auto bg-[#F7AF25]"
                    href={"/edit-account"}
                    >

                <Text className="text-white text-base"> 
                    Edit your details
                </Text>
        
            </Link>
        </View>
    );
}

export default EditButton