import {
    View,
    Text,
    SafeAreaView,
    Alert,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import FormField from "../../components/FormField";
import DropdownField from "../../components/DropdownField.jsx";
import CustomButton from "../../components/CustomButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useImagePicker } from "../../api/useImagePicker.js";
import { router, useLocalSearchParams } from "expo-router";
import { FIREBASE_STORAGE, FIREBASE_DB } from "../../config/FirebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { images } from "../../constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { startImageRecog } from "../../api/startImageRecog.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPostByID } from "../../api/items";

const create = () => {
    const lostPetEndpoint = "/api/lostPet/submitForm";
    const spottedPetEndpoint = "/api/spottedPet/submitForm";
    const { data } = useLocalSearchParams();
    const [imageData, setImageData] = useState([]);

    const [isSubmit, setIsSubmit] = useState(false);

    const [form, setForm] = useState({
        postType: "Lost Pet",
        petName: "",
        species: "",
        breed: "",
        age: "",
        primaryColour: "",
        secondaryColour: "",
        size: "",
        lastSeenLocation: "",
        lastSeenDate: new Date(), // Current "Datetime" for input but will update only the "date" part
        lastSeenTime: new Date(), // Current "Datetime" for input but will update only the "time" part
        additionalDetail: "",
        photo: [],
    });

    const postType = [
        { label: "Lost Pet", value: "Lost Pet" },
        { label: "Spotted Pet", value: "Spotted Pet" },
    ];

    const species = [
        { label: "Dog", value: "Dog" },
        { label: "Cat", value: "Cat" },
        { label: "Bird", value: "Bird" },
        { label: "Others", value: "Others" },
    ];

    /**
     * TODO: As of 19/09, Change to TEXT for breed, not sure if we still need dropdown in the future
     */
    // const breedOptions = {
    //     Dog: [
    //         { label: "Chihuahua", value: "Chihuahua" },
    //         { label: "Golden Retriever", value: "Golden Retriever" }
    //     ],
    //     Cat: [
    //         { label: "Siamese", value: "Siamese" }
    //     ],
    //     Bird: [
    //         { label: "Mockingjay", value: "Mockingjay" }
    //     ],
    // };

    const primaryColour = [
        { label: "White / Cream", value: "White / Cream" },
        { label: "Black", value: "Black" },
        { label: "Brown", value: "Brown" },
        { label: "Golden / Yellow", value: "Golden / Yellow" },
        { label: "Red", value: "Red" },
        { label: "Orange", value: "Orange" },
        { label: "Grey / Blue", value: "Grey / Blue" },
    ];

    const secondaryColour = [
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

    const [imageUris, setImageUris, pickImage] = useImagePicker(form.postType);

    const closeCreate = () => {
        resetForm(form.postType);
        if (imageData && data) {
            setImageData([]);
            setForm((prevForm) => ({
                ...prevForm,
                photo: [],
            }));
        }
        router.push("/home");
    };

    // Function to handle image selection and update the form
    // Updated to convert URI to Blob
    const handleImageSelect = async () => {
        if (imageUris) {
            setForm((prevForm) => ({
                ...prevForm,
                photo: imageUris,
            }));
        }
    };

    const handleCameraImage = async () => {
        console.log("params: " + data);
        if (data && form.photo.length === 0) {
            var parsed = JSON.parse(data);
            console.log("parse: " + parsed);
            var image = parsed[0];
            setImageData([image]);
            setForm((prevForm) => ({
                ...prevForm,
                photo: [image],
            }));
        }
    };

    // When an image is picked, call this
    React.useEffect(() => {
        handleImageSelect();
        handleCameraImage();
    }, [imageUris, form.photo]);

    const handleAgeChange = (e) => {
        const age = parseInt(e, 10);
        setForm({ ...form, age: e }); // Update the form with the input value

        setTimeout(() => {
            // Delay the alert by 500ms
            if (age < 0 || age > 25) {
                Alert.alert(
                    "Invalid Age",
                    "Please enter an age between 0 and 25.",
                    [
                        {
                            text: "OK",
                            onPress: () => setForm({ ...form, age: "" }),
                        }, // Clear the age after alert is dismissed
                    ]
                );
            }
        }, 500);
    };

    const removeImgFromSelection = (index) => {
        setImageUris((currentImgs) =>
            currentImgs.filter((img, i) => i !== index)
        );
    };

    const handleRemoveCameraImg = () => {
        setImageData([]);
    };

    const [formKey, setFormKey] = useState(0); // Key to force re-render

    const resetForm = (item) => {
        setForm({
            postType: item,
            petName: "",
            species: "",
            breed: "",
            age: "",
            primaryColour: "",
            secondaryColour: "",
            size: "",
            lastSeenLocation: "",
            lastSeenDate: new Date(),
            lastSeenTime: new Date(),
            additionalDetail: "",
            photo: [],
        });
        setImageUris(null);
        // Force the FormField component to re-render
        setFormKey((prevKey) => prevKey + 1);
    };

    // Function to handle image recognition
    const handleImageRecognition = async (uuid) => {
        try {
            // Set a flag that the recognition is in progress
            await AsyncStorage.setItem("recognitionInProgress", "true");

            // Start image recognition
            const result = await startImageRecog(uuid);

            const detailedPosts = [];

            // Fetch spotted pet post details for each match
            for (const match of result) {
                const postId = match.postId;
                const postDetails = await getPostByID("spotted", postId);

                if (postDetails) {
                    detailedPosts.push(postDetails);
                }
            }

            // Store top matches (detailed posts) in AsyncStorage
            await AsyncStorage.setItem(
                "topMatches",
                JSON.stringify(detailedPosts)
            );

            console.log("Matching process completed. Check Spotted Feed.");

            // Remove the loading state
            await AsyncStorage.removeItem("recognitionInProgress");
        } catch (error) {
            console.error("Error during image recognition:", error);
        }
    };

    // Function to handle form submission
    const onSubmit = async (event) => {
        event.preventDefault();
        const hostURL = process.env.HOST_URL;

        // Prevent empty photo post from submitting
        if (form.photo.length == 0) {
            Alert.alert("", "Please add images to the post");
            console.log("no photo");
            return;
        }

        let endpoint =
            form.postType === "Lost Pet" ? lostPetEndpoint : spottedPetEndpoint;

        const url = `${hostURL}${endpoint}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json());

        const result = response.message;
        if (response.ok) {
            setIsSubmit(true);
            const directory =
                form.postType === "Spotted Pet" ? "spotted" : "lost";
            await uploadImageToFirebase(
                response.post_id,
                form.photo,
                directory
            );
        } else {
            if (result === "Empty fields") {
                Alert.alert("", "Please ensure all required fields are filled");
            } else {
                Alert.alert(
                    "",
                    "Form could not be submitted, please try again"
                );
            }
        }
    };

    const uploadImageToFirebase = async (uuid, images, target = "lost") => {
        let firebaseImgUrls = [];
        if (images.length > 0) {
            images.forEach(async (image) => {
                let imgResponse = await fetch(image.uri);
                console.log(imgResponse);
                if (
                    imgResponse.hasOwnProperty("uri") ||
                    imgResponse.hasOwnProperty("url")
                ) {
                    const manipulateResult = await manipulateAsync(
                        image.uri || image.url,
                        [{ resize: { width: 480 } }],
                        { format: SaveFormat.JPEG }
                    );
                    imgResponse = manipulateResult;
                }
                const response = await fetch(imgResponse.uri);
                const blob = await response.blob();

                const blobData = blob._data;

                let name;
                if (image.hasOwnProperty("fileName")) {
                    name = image.fileName.toString();
                } else if (blobData.hasOwnProperty("name")) {
                    name = blobData.name.toString();
                } else {
                    name = blobData.blobId.toString();
                }

                if (blob) {
                    const metadata = {
                        contentType: "image/jpeg",
                    };
                    const storageRef = ref(
                        FIREBASE_STORAGE,
                        `/${target ?? "lost"}/${name}`
                    );
                    const uploadTask = uploadBytesResumable(
                        storageRef,
                        blob,
                        metadata
                    );

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress =
                                (snapshot.bytesTransferred /
                                    snapshot.totalBytes) *
                                100;
                            console.log(progress.toFixed());
                        },
                        (error) => {
                            console.log(
                                "Error encountered during image upload!"
                            );
                            console.log(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(
                                async (imageURL) => {
                                    // push the imageUrl to local array
                                    firebaseImgUrls.push(imageURL);
                                    // use the stored firebaseImgUrls to update recent post column
                                    if (
                                        images.length === firebaseImgUrls.length
                                    ) {
                                        await updatePhotoColumn(
                                            firebaseImgUrls,
                                            uuid,
                                            target
                                        );
                                    }
                                }
                            );
                        }
                    );
                }
            });
        }
    };

    const updatePhotoColumn = async (imageURLs, uuid, target) => {
        const updateLostDocRef = doc(
            FIREBASE_DB,
            `${target ?? "lost"}_pets`,
            uuid
        );

        await updateDoc(updateLostDocRef, {
            photo: imageURLs,
        }).then(() => {
            resetForm(form.postType);
            router.replace("/home");
            setIsSubmit(false);

            // Ensure image recognition only runs if target is "lost"
            if (target === "lost") {
                handleImageRecognition(uuid);
            }
        });
    };

    console.log("images:", imageUris);

    return (
        <SafeAreaView>
            {!isSubmit && (
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 2,
                    }}
                    enableAutomaticScroll={true}
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex flex-row mt-5 mx-2">
                        <TouchableOpacity onPress={closeCreate}>
                            <Ionicons
                                name="close-outline"
                                size={32}
                                color="black"
                            />
                        </TouchableOpacity>
                        <Text className="w-10/12 text-center justify-center items-center text-black text-xl font-bold">
                            New Post
                        </Text>
                    </View>
                    <View className="w-full justify-center px-4 my-6 space-y-7 flex flex-col">
                        <DropdownField
                            title="Post Type"
                            data={postType}
                            value={form.postType}
                            handleChange={(item) => {
                                setForm({ ...form, postType: item.value });
                                resetForm(item.value);
                            }}
                        />

                        {form.postType === "Lost Pet" && (
                            <FormField
                                title="Pet Name"
                                value={form.petName}
                                handleChangeText={(e) =>
                                    setForm({ ...form, petName: e })
                                }
                                required
                                placeholder={"Enter your pet's name"}
                                otherStyles="pt-2"
                            />
                        )}

                        <FormField
                            title="Last Seen Date"
                            value={form.lastSeenDate}
                            handleChangeText={(e) =>
                                setForm({ ...form, lastSeenDate: e })
                            }
                            required
                            isDateField={true} // Enable date picker functionality
                            otherStyles="pt-2"
                        />

                        <FormField
                            title="Last Seen Time"
                            value={form.lastSeenTime}
                            handleChangeText={(e) =>
                                setForm({ ...form, lastSeenTime: e })
                            }
                            required
                            isTimeField={true} // Enable time picker functionality
                            otherStyles="pt-2"
                        />

                        <View className="z-50">
                            <FormField
                                key={formKey} // Use key to force re-render on form reset
                                title="Last Seen Location"
                                value={form.lastSeenLocation}
                                handleChangeText={(e) => {
                                    console.log(e);
                                    setForm({
                                        ...form,
                                        lastSeenLocation: e,
                                    });
                                }}
                                isLocationField={true} // This enables Google Places autocomplete
                                required
                            />
                        </View>

                        <DropdownField
                            title="Species"
                            data={species}
                            value={form.species}
                            handleChange={(item) =>
                                setForm({ ...form, species: item.value })
                            }
                            required
                            otherStyles="pt-2"
                        />

                        <FormField
                            title="Breed"
                            value={form.breed}
                            handleChangeText={(e) =>
                                setForm({ ...form, breed: e })
                            }
                            otherStyles="pt-2"
                            placeholder={"Enter the breed"}
                        />

                        <DropdownField
                            title="Primary Colour"
                            data={primaryColour}
                            value={form.primaryColour}
                            handleChange={(item) =>
                                setForm({
                                    ...form,
                                    primaryColour: item.value,
                                })
                            }
                            required
                            otherStyles="pt-2"
                        />

                        <DropdownField
                            title="Secondary Colour"
                            data={secondaryColour}
                            value={form.secondaryColour}
                            handleChange={(item) =>
                                setForm({
                                    ...form,
                                    secondaryColour: item.value,
                                })
                            }
                            otherStyles="pt-2"
                        />

                        {form.postType === "Lost Pet" && (
                            <FormField
                                title="Age"
                                value={form.age}
                                handleChangeText={handleAgeChange}
                                isNumeric
                                placeholder={"Enter age 0-25"}
                                otherStyles="pt-2"
                            />
                        )}

                        <DropdownField
                            title="Size"
                            data={size}
                            value={form.size}
                            handleChange={(item) =>
                                setForm({ ...form, size: item.value })
                            }
                            otherStyles="pt-2"
                        />

                        <FormField
                            title="Additional Details"
                            value={form.additionalDetail}
                            handleChangeText={(e) =>
                                setForm({ ...form, additionalDetail: e })
                            }
                            otherStyles="pt-2"
                            placeholder={"Enter additional details"}
                        />

                        {imageData && imageData.length !== 0 && (
                            <View className="">
                                <Text className="text-base text-moss">
                                    {" "}
                                    Image from Camera{" "}
                                </Text>
                                <View className="flex-row bg-white mt-3 space-y-2 py-7 flex items-center justify-center rounded-md">
                                    <View className="rounded-md overflow-hidden relative">
                                        <Image
                                            source={{
                                                uri: imageData[0].uri,
                                            }}
                                            className="w-[120px] h-[200px] rounded-md"
                                        ></Image>
                                        {/* <TouchableOpacity
                                            className="p-2 bg-red-500 rounded-md absolute top-0 right-0"
                                            onPress={() =>
                                                handleRemoveCameraImg()
                                            }
                                        >
                                            <Ionicons
                                                name="trash-outline"
                                                size={20}
                                                color="white"
                                            />
                                        </TouchableOpacity> */}
                                    </View>
                                </View>
                            </View>
                        )}

                        {imageData && imageData.length === 0 && (
                            <View>
                                <Text className="text-base text-moss">
                                    {" "}
                                    Add Photo{" "}
                                </Text>
                                <CustomButton
                                    handlePress={pickImage}
                                    containerStyles="bg-white mt-7"
                                    showImage={true}
                                    imageUris={imageUris} // Pass the array of image URIs
                                    isLoading={false}
                                    handleImgDelete={(index) =>
                                        removeImgFromSelection(index)
                                    }
                                />
                            </View>
                        )}

                        <CustomButton
                            handlePress={onSubmit}
                            title="Submit"
                            containerStyles="bg-yellow_orange mt-7 border-black-200 focus:border-secondary"
                        />
                    </View>
                </KeyboardAwareScrollView>
            )}
            {isSubmit && (
                <View className="h-screen w-screen flex justify-center relative top-0 right-0 left-0 bottom-0 bg-[#FCFCFF] items-center">
                    <Image
                        source={images.loading}
                        style={{ width: 200, height: 200 }}
                    />
                    <Text className="self-center font-extrabold text-2xl text-black">
                        Loading...
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default create;
