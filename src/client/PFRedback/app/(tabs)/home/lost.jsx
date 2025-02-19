import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
    GestureHandlerRootView,
    TouchableOpacity,
} from "react-native-gesture-handler";
import GridView from "../../../components/GridView";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import LocationContext from "../../../components/LocationContext";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import locations from "../../../api/locations";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Lost = () => {
    const { location, errorMsg } = useContext(LocationContext.LocationContext);
    const [locationLatLngString, setLocationLatLngString] = useState(
        JSON.stringify(location)
    );
    const [locationAddressShown, setLocationAddressShown] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    // For image recognition
    let appHasClearedStorage = false; // In-memory flag to track if storage was cleared

    const clearAsyncStorageOnStart = async () => {
        try {
            if (!appHasClearedStorage) {
                // If we haven't cleared it yet
                // Clear recognitionInProgress and topMatches
                await AsyncStorage.removeItem("recognitionInProgress");
                await AsyncStorage.removeItem("topMatches");

                console.log("Cleared AsyncStorage on app start");
                console.log("appHasClearedStorage: ", appHasClearedStorage);

                // Set the flag to true, so we don't clear again
                appHasClearedStorage = true;
                console.log("appHasClearedStorage: ", appHasClearedStorage);
            } else {
                console.log("Storage clearing skipped. Already cleared.");
            }
        } catch (error) {
            console.error("Error clearing AsyncStorage on app start:", error);
        }
    };

    useEffect(() => {
        console.log("here");
        clearAsyncStorageOnStart();
    }, []);

    useEffect(() => {
        const fetchAddress = async () => {
            // Fetch address if permission granted to use address, otherwise, default location is used
            if (location) {
                console.log(location);
                const addressString = await locations.getAddressFromCoordinates(
                    location
                );
                setLocationAddressShown(addressString);
            } else {
                const addressString = await locations.useDefaultLocation();
                setLocationAddressShown(addressString);
            }
        };
        fetchAddress();
    }, [location]);

    const handleLocationSelect = async (data, details = null) => {
        setLocationAddressShown(data.description);
        setIsEditing(false);
        const latlng = await locations.getCoordinateFromLocation(
            data.description
        );
        setLocationLatLngString(JSON.stringify(latlng));
    };

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1">
                <View className="bg-white h-16 items-center justify-center pr-5 -mb-2 flex-row z-50">
                    <View className="flex-1 align-middle ml-6 z-50">
                        {isEditing ? (
                            <GooglePlacesAutocomplete
                                placeholder="Search location"
                                disableScroll={true}
                                minLength={2}
                                onPress={handleLocationSelect}
                                query={{
                                    key: process.env.GOOGLE_API_KEY,
                                    language: "en",
                                    components: "country:aus",
                                }}
                                fetchDetails={false}
                                styles={{
                                    textInputContainer: {
                                        backgroundColor: "transparent",
                                        marginTop: 8,
                                        zIndex: 2000,
                                    },
                                    textInput: {
                                        color: "#236468",
                                        fontSize: 16,
                                    },
                                    predefinedPlacesDescription: {
                                        color: "#1faadb",
                                    },
                                    description: {
                                        color: "#236468",
                                    },
                                    listView: {
                                        position: "absolute",
                                        zIndex: 2000,
                                        top: 50,
                                        backgroundColor: "black",
                                        borderRadius: 5,
                                        elevation: 5,
                                    },
                                }}
                                nearbyPlacesAPI="GooglePlacesSearch"
                                debounce={200}
                                listUnderlayColor="black"
                                enablePoweredByContainer={false}
                            />
                        ) : (
                            <TouchableOpacity
                                onPress={() => setIsEditing(true)}
                                className="flex-row items-center gap-1 pr-4"
                            >
                                <Ionicons
                                    name="location-outline"
                                    size={18}
                                    color={"#236468"}
                                />
                                <Text
                                    className="text-moss -mt-1 pr-6 underline"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {locationAddressShown}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Link
                        href={{
                            pathname: "/filter-sort",
                            params: {
                                isLostFeed: true,
                                location: locationLatLngString,
                            },
                        }}
                    >
                        <View className="flex-row items-center  border border-gray-200 rounded-2xl p-2">
                            <Ionicons
                                name="options-outline"
                                size={30}
                                color={"rgba(35, 100, 104, 0.6)"}
                            />
                        </View>
                    </Link>
                </View>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View className="flex-1 bg-[#FFFFFD] p-6">
                        <GridView type={"lost"} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default Lost;
