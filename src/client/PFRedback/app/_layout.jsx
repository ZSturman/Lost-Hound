import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { Slot, SplashScreen, Stack, router } from "expo-router";
import { useFonts } from "expo-font";
import { NativeWindStyleSheet } from "nativewind";
import { getCurrentAccount } from "../api/accountApi";

NativeWindStyleSheet.setOutput({
    // web version to have the same style
    default: "native",
});

SplashScreen.preventAutoHideAsync(); // prevent the Splash screen from auto hiding before the assets loaded

/*
Main Root Layout
Includes all Stack Screens: (auth) group, (tabs) group, Message, Navigation, search, index
*/
const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    useEffect(() => {
        (async () => {
            await getCurrentAccount().then((account) => {
                if (account) {
                    router.replace("/home");
                } 
            });
        })();
    }, []);

    if (!fontsLoaded && !error) return null;

    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{
                    title: "Home",
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: "#A9E0E2",
                    },
                    headerShadowVisible: true,
                }}
            />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
                name="message"
                options={{
                    title: "Messages",
                    headerStyle: {
                        backgroundColor: "#A9E0E2",
                    },
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerShadowVisible: true,
                    headerBackTitleVisible: false,
                    headerTintColor: "#236468",
                }}
            />
            <Stack.Screen
                name="chat"
                options={{
                    title: "Conversation",
                    headerStyle: {
                        backgroundColor: "#A9E0E2",
                    },
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerShadowVisible: true,
                    headerBackTitleVisible: false,
                    headerTintColor: "#236468",
                }}
            />
            <Stack.Screen
                name="notification"
                options={{
                    title: "Notifications",
                    headerStyle: {
                        backgroundColor: "#A9E0E2",
                    },
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerShadowVisible: true,
                    headerBackTitleVisible: false,
                    headerTintColor: "#236468",
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    title: "Settings",
                    headerStyle: {
                        backgroundColor: "#A9E0E2",
                    },
                    headerTintColor: "#236468",
                    headerShadowVisible: true,
                }}
            />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="filter-sort"
                options={{
                    title: "Feed Options",
                    presentation: "modal",
                    headerStyle: {
                        backgroundColor: "#A9E0E2",
                    },
                    headerTintColor: "#236468",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerBackTitleVisible: false,
                    headerBackVisible: false,
                }}
            />
            <Stack.Screen
                name="view-post"
                options={{
                    title: "Information",
                    headerTintColor: "#236468",
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#A9E0E2"
                    },
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerShadowVisible: true,
                }}
            />

            <Stack.Screen
                name="edit-account"
                options={{
                    title: "Edit account",
                    headerTintColor: "#236468",
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#A9E0E2"
                    },
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerShadowVisible: true,
                }}
            />

            <Stack.Screen
                name="edit-post"
                options={{
                    title: "Edit post",
                    headerTintColor: "#236468",
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#A9E0E2"
                    },
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerShadowVisible: true,
                }}
            />

            <Stack.Screen
                name="img-recog-feed"
                options={{
                    title: "Match results",
                    headerTintColor: "#236468",
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#A9E0E2"
                    },
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerShadowVisible: true,
                }}
            />
        </Stack>
    );
};

export default RootLayout;
