import { StatusBar } from "expo-status-bar";
import { ScrollView, View, Image } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";

export default function App() {

    return (
        <SafeAreaView className="bg-tiff_blue h-full">
            <ScrollView contentContainerStyle={{ height: "100%"}}>
                <View className="w-full justify-center items-center h-full px-4 bg-transparent absolute overflow-hidden">
                    <Image
                        source={images.mainLogo}
                        className="w-[250px] h-[250px]"
                        resizeMode="contain"
                    />
                    <StatusBar style="auto" />
                    <Link
                        href={"/sign-up"}
                        className="bg-yellow_orange mt-7 border-black-200 rounded-xl px-4 py-3 w-full text-center justify-center items-center text-white text-base"
                    >
                        Sign up
                    </Link>
                    <Link
                        href={"/login"}
                        className="bg-sky_blue mt-7 border-black-200 rounded-xl px-4 py-3 w-full text-center justify-center items-center text-white text-base"
                    >
                        Login
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Navbar or Footer (Homepage)
