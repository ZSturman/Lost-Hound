import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import FormField from "../components/FormField";
import DropdownField from "../components/DropdownField";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomButton from "../components/CustomButton";
import { router } from 'expo-router';

const EditAccount = () => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        state: ""
    });

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

    // Function to handle form submission
    const onSubmit = async (event) => {
        event.preventDefault();
        // const imageUrls = await uploadImage();

        const hostURL = process.env.HOST_URL;
        const url = `${hostURL}/api/account`;

        console.log('Submitting form:', form);

        // Send form data without images first
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Redirecting to account page after successfully edit account details
        const result = await response.json();
        console.log(result);
        if (response.ok) {
            router.replace("/account");
        }
        // errror handling needed
    };

    return (
        <SafeAreaView>
            <KeyboardAwareScrollView
                    contentContainerStyle={{ paddingHorizontal: 2 }}
                    enableAutomaticScroll={true}
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps='handled'
                >
                <View className="w-full justify-center px-4 my-6 space-y-7 flex flex-col">

                    {/* Form to get edit inputs */}
                    {/* Account name */}
                    <FormField
                        title="Name"
                        value={form.accountName}
                        handleChangeText={(e) =>
                            setForm({ ...form, name: e })
                        }
                        required
                        otherStyles="pt-2"
                    />

                    {/* Account state */}
                    <DropdownField
                        title="State"
                        data={states}
                        value={form.state}
                        handleChange={(item) =>
                            setForm({ ...form, state: item.value })
                        }
                        otherStyles="pt-2"
                    />

                    {/* Submitting button */}
                    <CustomButton
                        handlePress={onSubmit}
                        title="Submit"
                        containerStyles="bg-yellow_orange mt-7 border-white focus:border-secondary"
                        // handlePress={()=>console.log(form)}
                    />

                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default EditAccount;