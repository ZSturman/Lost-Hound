import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, {useState} from "react";
import { useImagePicker } from '../api/useImagePicker.js';
import FormField from "../components/FormField.jsx";
import DropdownField from "../components/DropdownField.jsx";
import CustomButton from "../components/CustomButton.jsx";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';

const EditPost = () => {

    const {id, type}  = useLocalSearchParams();

    console.log("post to be edited: ", type, id);

    const [form, setForm] = useState({
        postType: "",
        petName: "",
        species: "",
        age: "",
        breed: "",
        primaryColour: "",
        secondaryColour: "",
        size: "",
        lastSeenLocation: "",
        // lastSeenDate: new Date(),           // Current "Datetime" for input but will update only the "date" part
        // lastSeenTime: new Date(),           // Current "Datetime" for input but will update only the "time" part
        state: "",
        additionalDetails: "",
        photo: [],

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

    const breedOptions = {
        Dog: [
            { label: "Chihuahua", value: "Chihuahua" },
            { label: "Golden Retriever", value: "Golden Retriever" }
        ],
        Cat: [
            { label: "Siamese", value: "Siamese" }
        ],
        Bird: [
            { label: "Mockingjay", value: "Mockingjay" }
        ],
    };

    const primaryColour = [
        { label: "White / Cream", value: "White / Cream" },
        { label: "Black", value: "Black" },
        { label: "Brown", value: "Brown" },
        { label: "Golden / Yellow", value: "Golden / Yellow" },
        { label: "Red", value: "Red" },
        { label: "Orange", value: "Orange" },
        { label: "Grey / Blue", value: "Grey / Blue" },
    ];
    
    const size = [
        { label: "Small", value: "Small" },
        { label: "Medium", value: "Medium" },
        { label: "Large", value: "Large" },
    ];

    const [photoUri, pickImage] = useImagePicker(form.postType);

    // Function to handle form submission
    const onSubmit = async (event) => {
        event.preventDefault();
        // const imageUrls = await uploadImage();

        const hostURL = process.env.HOST_URL;
        const url = `${hostURL}/api/posts/${type}/edit/${id}`;

        console.log('Submitting form:', form);

        // Send form data without images first
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log(result);
        if (response.ok) {
            router.push({ pathname: `/view-post`, params:{id: id, type: type}});
        }
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
                    <FormField
                        title="Pet Name"
                        value={form.petName}
                        handleChangeText={(e) =>
                            setForm({ ...form, petName: e })
                        }
                        required
                        otherStyles="pt-2"
                    />

                    {/* <FormField
                        title="Last Seen Date"
                        value={form.lastSeenDate}
                        handleChangeText={(e) =>
                            setForm({ ...form, lastSeenDate: e })}
                        required
                        isDateField={true}  // Enable date picker functionality
                        otherStyles="pt-2"
                    />

                    <FormField
                        title="Last Seen Time"
                        value={form.lastSeenTime}
                        handleChangeText={(e) =>
                            setForm({ ...form, lastSeenTime: e })}
                        required
                        isTimeField={true}  // Enable time picker functionality 
                        otherStyles="pt-2"
                    /> */}

                    <View style={{ zIndex: 2000 }}>
                        <FormField
                            title="Last Seen Location"
                            value={form.lastSeenLocation}
                            handleChangeText={(e) => 
                                setForm({ ...form, lastSeenLocation: e })}
                            isLocationField={true}              // This enables Google Places autocomplete
                            required
                        />
                    </View>

                    <DropdownField
                        title="Breed"
                        data={breedOptions[form.species] || []}
                        value={form.breed}
                        handleChange={(item) =>
                            setForm({ ...form, breed: item.value })
                        }
                        required
                        otherStyles="pt-2"
                    />

                    <DropdownField
                        title="Primary Colour"
                        data={primaryColour}
                        value={form.primaryColour}
                        handleChange={(item) =>
                            setForm({ ...form, primaryColour: item.value })
                        }
                        required
                        otherStyles="pt-2"
                    />

                    <FormField
                        title="Secondary Colour"
                        value={form.secondaryColour}
                        handleChangeText={(e) =>
                            setForm({ ...form, secondaryColour: e })
                        }
                        otherStyles="pt-2"
                    />

                    {/* {form.postType === "Lost Pet" && (
                        <FormField
                            title="Age"
                            value={form.age}
                            handleChangeText={handleAgeChange}
                            isNumeric
                            placeholder={"Enter age 0-25"}
                            otherStyles="pt-2"
                        />
                    )} */}

                    <DropdownField
                        title="Size"
                        data={size}
                        value={form.size}
                        handleChange={(item) =>
                            setForm({ ...form, size: item.value })
                        }
                        otherStyles="pt-2"
                    />

                    <DropdownField
                        title="State"
                        data={states}
                        value={form.state}
                        handleChange={(item) =>
                            setForm({ ...form, state: item.value })
                        }
                        otherStyles="pt-2"
                    />

                    <FormField
                        title="Additional Details"
                        value={form.additionalDetails}
                        handleChangeText={(e) =>
                            setForm({ ...form, additionalDetails: e })
                        }
                        otherStyles="pt-2"
                    />

                    <Text className="text-base text-moss"> Add Photo </Text>

                    <CustomButton
                        handlePress={pickImage}
                        containerStyles="bg-white mt-7 border-gray-200 focus:border-secondary"
                        showImage={true}
                        imageUris={photoUri}             // Pass the array of image URIs
                        imageStyle={{ width: 100, height: 200, resizeMode: 'contain', marginLeft: 10 }}
                        isLoading={false}
                    />

                    <CustomButton
                        handlePress={onSubmit}
                        title="Update post"
                        containerStyles="bg-yellow_orange mt-7 border-black-200 focus:border-secondary"
                        // handlePress={()=>console.log(form)}
                    />

                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default EditPost;