import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const DropdownField = ({
    title,
    data,
    value,
    handleChange,
    otherStyles,
    required,
    isLoading,
}) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View className={`space-y-2 group ${otherStyles}`}>
            {/* {renderLabel()} */}
            <Text className="text-base text-moss">
                {title}
                {required === true && "*"}
            </Text>

            <Dropdown
                className={`focus:border-blue-300 border border-gray-300 rounded-2xl p-4 h-16 bg-white ${
                    isLoading ? "opacity-70 text-gray-50" : ""
                }`}
                data={data}
                search
                minHeight={100}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select item" : "..."}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={handleChange}
                disable={isLoading}
                accessibilityLabel={title} // Add accessibility label for testing
                // renderLeftIcon={() => (
                //     <AntDesign
                //         color={isFocus ? "blue" : "black"}
                //         name="Safety"
                //         size={20}
                //     />
                // )}
            />
        </View>
    );
};

export default DropdownField;
