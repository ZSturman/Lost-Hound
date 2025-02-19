import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="login"
                    options={{
                        title: "Login",
                        headerStyle: {
                            backgroundColor: "#A9E0E2",
                        },
                        headerTintColor: "#236468",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                        headerTransparent: true,
                        headerBackTitleVisible: false, 
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="sign-up"
                    options={{
                        title: "Sign Up",
                        headerStyle: {
                            backgroundColor: "#A9E0E2",
                        },
                        headerTintColor: "#236468",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                        headerTransparent: true,
                        headerBackTitleVisible: false, 
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="otp"
                    options={{
                        title: "Sign up",
                        headerStyle: {
                            backgroundColor: "#A9E0E2",
                        },
                        headerTintColor: "#236468",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                        headerTransparent: true,
                        headerBackTitleVisible: false,
                    }}
                />
                
            </Stack>
            <StatusBar backgroundColor="#161622" style="light" />
        </>
    );
};

export default AuthLayout;
