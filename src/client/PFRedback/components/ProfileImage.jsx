import { Text, View } from "react-native";

const ProfileImage = ({ name, height=80, width=80 }) => {
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
    const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";

    const palette = ["#B5A3CA", "#8CBEE2", "#A8EAD5", "#CCEECC", "#FFD78A", "#FFBB6D", "#EFA2B0", "#DC7F90"]

    // generating random number in range [x, y)
    function getRandomNum(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    let bgColour = palette[getRandomNum(0, 8)]
    console.log("color: ",bgColour)

    return (
        <View className="rounded-full flex justify-center items-center mt-5 m-5" style={{backgroundColor:bgColour, height: height, width: width}}>
            <Text className="text-4xl font-extrabold text-white">
                {firstNameInitial}
                {lastNameInitial}
            </Text>
        </View>
    );
};
export default ProfileImage;