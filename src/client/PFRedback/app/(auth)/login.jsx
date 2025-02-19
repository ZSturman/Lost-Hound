import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const loginEndpoint = "/api/account/login";

    /**
     * Handles the login call to backend
     *
     */
    const submit = async (event) => {
        setIsSubmitting(true);
        const hostURL = process.env.HOST_URL;
        try {
            const url = `${hostURL}${loginEndpoint}`;
            event.preventDefault();
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });

            if (response.ok) {
                console.log("----------------------");
                console.log(response);
                console.log("----------------------");
                setIsSubmitting(false);
                router.replace("/home");
            } else {
                setIsSubmitting(false);
                const result = await response.text();
                console.log("----------------------");
                console.log(result);
                console.log("----------------------");

                if (result === "Empty email or password field") {
                    Alert.alert(
                        "Error: Empty Field(s)",
                        "Please ensure all fields are filled"
                    );
                } else if (result === "Invalid email format") {
                    Alert.alert("Error: Format", "Invalid email format");
                } else if (result === "User not verified") {
                    router.replace({
                        pathname: "/otp",
                        params: { userEmail: form.email },
                    });
                } else if (result === "No existing user") {
                    Alert.alert(
                        "User Does Not Exist",
                        "Please sign-up instead"
                    );
                } else if (result === "Incorrect email or password") {
                    Alert.alert("", "Incorrect email or password");
                }
            }
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            Alert.alert("", "An error occurred. Please try again.");
        }
    };

    return (
        <SafeAreaView className="bg-tiff_blue h-full">
            <ScrollView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior="height" enabled={false}>
                    <View className="w-full justify-center min-h-[60vh] px-4 my-6">
                        <FormField
                            title="Email Address"
                            value={form.email}
                            handleChangeText={(e) =>
                                setForm({ ...form, email: e.toLowerCase() })
                            }
                            otherStyles="mt-7"
                            keyboardType="email-address"
                            isLoading={isSubmitting}
                        />

                        <FormField
                            title="Password"
                            value={form.password}
                            handleChangeText={(e) =>
                                setForm({ ...form, password: e })
                            }
                            otherStyles="mt-7"
                            isLoading={isSubmitting}
                        />

                        <CustomButton
                            title="Sign In"
                            handlePress={submit}
                            containerStyles="bg-yellow_orange mt-7 border-black-200 focus:border-secondary"
                            textStyles="text-white"
                            isLoading={isSubmitting}
                        />

                        <View className="justify-center pt-5 flex-row gap-2">
                            <Text className="text-lg text-gray-100">
                                Don't have an account?
                            </Text>
                            {isSubmitting ? (
                                <Text className="text-lg text-moss font-extralight">
                                    {" "}
                                    Sign-Up{" "}
                                </Text>
                            ) : (
                                <Link
                                    href="/sign-up"
                                    className="text-lg text-moss"
                                >
                                    Sign-Up
                                </Link>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;
