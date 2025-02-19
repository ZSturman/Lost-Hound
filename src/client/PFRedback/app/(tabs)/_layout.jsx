import { View, Text, Button, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Tabs, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images } from "../../constants";
import { useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
Layout for the All Tabs found in the App
Includes the Header Buttons (Message & Notification)
Tabs include: Home, Camera, Create Post, Account
*/
const TabsLayout = () => {
    const segment = useSegments();
    const page = segment[segment.length - 1];

    const [isComplete, setIsComplete] = useState(false); // Track if recognition is complete

    // Poll for recognition status
    useEffect(() => {
        let intervalId;
        let hasRecognitionStarted = false;

        const checkRecognitionStatus = async () => {
            try {
                const recognitionInProgress = await AsyncStorage.getItem(
                    "recognitionInProgress"
                );

                if (recognitionInProgress === null && hasRecognitionStarted) {
                    setIsComplete(true);
                    clearInterval(intervalId); // Stop polling
                    console.log("Recognition Complete!");
                } else if (recognitionInProgress !== null) {
                    hasRecognitionStarted = true;
                    console.log("Model still running or in progress");
                }
            } catch (error) {
                console.error("Error checking recognition status:", error);
                return false;
            }
        };

        // Polling AsyncStorage every 2 seconds
        intervalId = setInterval(checkRecognitionStatus, 2000);

        return () => {
            clearInterval(intervalId); // Cleanup when the component unmounts
        };
    }, []);
    return (
        <>
            <>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: "#236468",
                        tabBarInactiveTintColor: "#769D9E",
                        tabBarShowLabel: false,
                        tabBarStyle: {
                            backgroundColor: "#A9E0E2",
                            borderTopWidth: 1,
                            borderTopColor: "#D4D4D4",
                            height: 85,
                            paddingTop: 15,
                        },
                    }}
                >
                    <Tabs.Screen
                        name="home"
                        options={{
                            title: "Home",
                            headerStyle: {
                                backgroundColor: "#A9E0E2",
                            },
                            headerTintColor: "#236468",
                            tabBarIcon: ({ color }) => (
                                <Ionicons name="home" size={35} color={color} />
                            ),
                            headerTitle: () => (
                                <View>
                                    <Image
                                        style={{ width: 50, height: 50 }}
                                        source={images.logoOnly}
                                    />
                                </View>
                            ),
                            headerRight: () => (
                                <View className="flex-row justify-center items-center px-[20px] gap-3">
                                    <Link href="/message" className="text-moss">
                                        <Ionicons
                                            name="chatbubble-ellipses-outline"
                                            size={30}
                                        />
                                    </Link>

                                    <Link
                                        href="/notification"
                                        className="text-moss"
                                    >
                                        <View
                                            style={{
                                                position: "relative",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Ionicons
                                                name="notifications-outline"
                                                size={30}
                                                style={{
                                                    marginTop: 5,
                                                    color: "#236468",
                                                }}
                                            />

                                            <Image
                                                source={require("../../assets/icons/red-dot-notif.png")}
                                                style={{
                                                    position: "absolute",
                                                    top: 6,
                                                    right: 3,
                                                    width: 12,
                                                    height: 12,
                                                    // Conditionally render the red dot based on status
                                                    display: isComplete
                                                        ? "flex"
                                                        : "none",
                                                }}
                                            />
                                        </View>
                                    </Link>
                                </View>
                            ),
                        }}
                    />

                    <Tabs.Screen
                        name="camera"
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color }) => (
                                <Ionicons
                                    name="camera"
                                    size={40}
                                    color={color}
                                />
                            ),
                            tabBarStyle: {
                                display: page === "camera" ? "none" : "flex",
                            },
                            unmountOnBlur: true,
                        }}
                    />

                    <Tabs.Screen
                        name="create"
                        options={{
                            title: "Create",
                            headerStyle: {
                                backgroundColor: "#A9E0E2",
                            },
                            headerTintColor: "#236468",
                            tabBarIcon: ({ color }) => (
                                <Ionicons
                                    name="add-circle"
                                    size={40}
                                    color={color}
                                />
                            ),
                            headerShown: false,
                            tabBarStyle: {
                                display: page === "create" ? "none" : "flex",
                            },
                            unmountOnBlur: true,
                        }}
                        listeners={({ navigation }) => ({
                            tabPress: (e) => {
                                e.preventDefault();
                                navigation.navigate("create", null);
                            },
                        })}
                    />

                    <Tabs.Screen
                        name="account"
                        options={{
                            title: "Profile",
                            headerStyle: {
                                backgroundColor: "#A9E0E2",
                            },
                            headerTintColor: "#236468",
                            tabBarIcon: ({ color }) => (
                                <Ionicons
                                    name="person-circle"
                                    size={40}
                                    color={color}
                                />
                            ),
                            headerRight: () => (
                                <View className="flex-row justify-center items-center px-[20px] gap-3">
                                    <Link
                                        href="/settings"
                                        className="text-moss"
                                    >
                                        <Ionicons
                                            name="settings-outline"
                                            size={30}
                                        />
                                    </Link>
                                </View>
                            ),
                            unmountOnBlur: true,
                        }}
                    />
                </Tabs>
                <StatusBar backgroundColor="#161622" style="light" />
            </>
        </>
    );
};

export default TabsLayout;
