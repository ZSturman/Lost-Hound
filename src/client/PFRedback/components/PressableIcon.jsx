import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, Pressable, View } from "react-native";

const PressableIcon = ({
    iconName,
    iconSize = 32,
    iconColour = 'black',
    handlePress,
    badges = 0,
    containerStyles,
}) => {
    return (
        <Pressable
            onPress={handlePress}
            activeOpacity={0.7}
            className={`m-2 flex-row pb-6 ${containerStyles}`}> 
            <Ionicons name={iconName} size={iconSize} color={iconColour}/>

            {(badges > 0) && (
                <View className="absolute -top-1 -right-1 bg-red-600 h-4 w-4 rounded-full justify-center items-center">
                    <Text className="text-white"> {badges} </Text>
                </View>
                

            )}



        </Pressable>
    );
};

export default PressableIcon;
