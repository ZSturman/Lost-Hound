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
import { Link, router, useLocalSearchParams } from "expo-router";
import DropdownField from "../../components/DropdownField.jsx";

const SignUp = () => {
    const states = [
        { label: "Australian Capital Territory", value: "ACT" },
        { label: "New South Wales", value: "NSW" },
        { label: "Northern Territory", value: "NT" },
        { label: "Queensland", value: "QLD" },
        { label: "South Australia", value: "SA" },
        { label: "Tasmania", value: "TAS" },
        { label: "Victoria", value: "VIC" },
        { label: "Western Australia", value: "WA" },
    ];
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        state: "",
    });

    const [isRegistering, setIsRegistering] = useState(false);
    const registerEndpoint = "/api/account/register";

    const signup = async (event) => {
        setIsRegistering(true);
        const hostURL = process.env.HOST_URL;

        try {
            const url = `${hostURL}${registerEndpoint}`;
            console.log(url);
            event.preventDefault();

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    form: form,
                }),
            });

            if (response.ok) {
                console.log("all ok");
                setIsRegistering(false);
                console.log("user email: ", form.email);
                router.replace({
                    pathname: "/otp",
                    params: { userEmail: form.email },
                });
            } else {
                console.log("not ok");
                setIsRegistering(false);
                const result = await response.text();
                console.log(result);

                if (result === "Empty field(s)") {
                    Alert.alert(
                        "Error: Empty Field(s)",
                        "Please ensure all fields are filled"
                    );
                } else if (result === "Invalid email format") {
                    Alert.alert("Error: Format", "Invalid email format");
                } else if (result === "Existing account") {
                    Alert.alert("User Already Exists", "Please log in instead");
                } else {
                    Alert.alert(
                        "Weak Password",
                        "Please choose a stronger password to secure your account"
                    );
                }
            }
        } catch (error) {
            console.error(error);
            setIsRegistering(false);
            Alert.alert("", "An error occurred. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="height"
            enabled={false}
        >
            <SafeAreaView className="bg-tiff_blue h-full">
                <ScrollView>
                    <View className="w-full justify-center min-h-[85vh] px-4 my-6 space-y-7 flex flex-col">
                        <FormField
                            title="Name"
                            value={form.name}
                            handleChangeText={(e) =>
                                setForm({ ...form, name: e })
                            }
                            keyboardType="email-address"
                            isLoading={isRegistering}
                            required
                        />

                        <FormField
                            title="Email Address"
                            value={form.email}
                            handleChangeText={(e) =>
                                setForm({ ...form, email: e.toLowerCase() })
                            }
                            keyboardType="email-address"
                            isLoading={isRegistering}
                            required
                        />

                        <FormField
                            title="Password"
                            value={form.password}
                            handleChangeText={(e) =>
                                setForm({ ...form, password: e })
                            }
                            isLoading={isRegistering}
                            required
                        />

                        <DropdownField
                            title="State"
                            data={states}
                            value={form.state}
                            handleChange={(item) =>
                                setForm({ ...form, state: item.value })
                            }
                            isLoading={isRegistering}
                        />

                        <CustomButton
                            title="Register"
                            handlePress={signup}
                            containerStyles="bg-yellow_orange mt-7 border-black-200 focus:border-secondary"
                            isLoading={isRegistering}
                        />

                        <View className="justify-center pt-5 flex-row gap-2">
                            <Text className="text-lg text-offwhite">
                                Already have an account?
                            </Text>
                            {isRegistering ? (
                                <Text className="text-lg text-moss font-extralight">
                                    {" "}
                                    Login{" "}
                                </Text>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-lg text-moss"
                                >
                                    Login
                                </Link>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default SignUp;
