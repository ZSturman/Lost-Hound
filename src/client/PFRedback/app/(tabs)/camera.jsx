import {
    Button,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ComingSoonPost from "../../components/ComingSoonPost";
import { router } from "expo-router";
import { CameraView, Camera, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useImagePicker } from "../../api/useImagePicker";

/*
NOTE:
This will be improved in next sprint as the task for Taking a Picture will be worked on Sprint 3
*/
const camera = () => {
    //   return (
    //     <>
    //       <View className="h-full bg-tiff_blue justify-center">
    //         <ComingSoonPost />
    //       </View>
    //     </>
    //   );
    const [cameraImg, setCameraImg] = useState(null);
    const [facing, setFacing] = useState("back");
    const [flash, setFlash] = useState("off");
    const [permission, requestPermission] = useCameraPermissions();
    const [imageUris, setImageUris] = useState([]);
    const cameraRef = useRef(null);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View className="flex-1 justify-center">
                <Text className="text-center pb-10">
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const toggleFlash = () => {
        setFlash((current) => (current === "off" ? "on" : "off"));
    };

    const closeCamera = () => {
        setCameraImg(null);
        router.replace("/home");
    };

    const captureImage = async () => {
        if (cameraRef) {
            try {
                const response = await cameraRef.current.takePictureAsync();
                console.log(response);
                if (response) {
                    console.log("image data");
                    console.log(response);
                    setCameraImg(response);
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    const goToCreate = async () => {
        console.log("redirect to create");
        console.log("cameraImg:", cameraImg);
        if (cameraImg) {
            imgData = cameraImg
            console.log("stringify: " + JSON.stringify([cameraImg]))
            // clear the cameraImg to reset camera
            setCameraImg(null);

            router.push({
                pathname: "/create",
                params: {data : JSON.stringify([imgData])},
            });
            
        }
    };

    return (
        <SafeAreaView className="bg-zinc-800 w-full h-full justify-between">
            <View className="fixed top-0 left-0 w-full flex flex-row justify-between p-5 pt-10">
                <TouchableOpacity
                    onPress={toggleFlash}
                    disabled={facing === "front"}
                >
                    <Ionicons
                        name={
                            flash === "on"
                                ? "flash"
                                : facing === "front"
                                ? "flash-off-outline"
                                : "flash-outline"
                        }
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
                <TouchableOpacity disabled={true}>
                    <Ionicons name="settings-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {cameraImg ? (
                <Image source={{ uri: cameraImg?.uri }} className="grow" />
            ) : (
                <CameraView
                    className="grow"
                    facing={facing}
                    flashMode={flash}
                    ref={cameraRef}
                ></CameraView>
            )}

            {cameraImg ? (
                <View className="p-5 flex flex-row items-center justify-center space-x-5 w-full">
                    <TouchableOpacity
                        className="flex-grow rounded-lg bg-zinc-700"
                        onPress={() => setCameraImg(null)}
                    >
                        <View className="flex flex-row items-center gap-3 justify-center h-[65px]">
                            <MaterialCommunityIcons
                                name="refresh"
                                size={24}
                                color="white"
                            />
                            <Text className="text-white font-medium">
                                Retake
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-grow rounded-lg bg-blue-500"
                        onPress={goToCreate}
                    >
                        <View className="flex flex-row items-center gap-3 justify-center h-[65px]">
                            <MaterialCommunityIcons
                                name="image-edit"
                                size={24}
                                color="white"
                            />
                            <Text className="text-white font-medium">
                                Create a Post
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="px-10 py-5 space-y-10">
                    <View className="flex flex-row items-center justify-center gap-5">
                        <Text className="text-sm text-white uppercase">
                            Video
                        </Text>
                        <Text className="text-sm text-white uppercase">
                            Photo
                        </Text>
                    </View>
                    <View className="flex flex-row justify-between items-center">
                        <TouchableOpacity onPress={closeCamera}>
                            <Ionicons
                                name="close-outline"
                                size={32}
                                color="white"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={captureImage}
                            className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
                        >
                            <Ionicons name="paw" size={32} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleCameraFacing}>
                            <Feather
                                name="refresh-cw"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default camera;
