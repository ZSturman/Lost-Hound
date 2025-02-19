import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions,
} from "react-native";
import images from "../constants/images.js";

const ComingSoonPost = () => {
    return (
        <SafeAreaView>
            <View className="justify-center items-center">
                <Text className="text-lg text-moss"> This feature is...</Text>
                <Image
                    source={images.comingSoon}
                    className="w-[250px] h-[250px]"
                    resizeMode="contain"
                />
            </View>
        </SafeAreaView>
    );
};

export default ComingSoonPost;
