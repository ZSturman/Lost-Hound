import { View, Text, SafeAreaView, Image } from "react-native";
import React, {useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import OverlayTag from "../../../components/OverlayTag";
import ItemCard from "../../../components/ItemCard";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Spotted from "./spotted";
import Lost from "./lost";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LocationContext from "../../../components/LocationContext";
import Toast, {BaseToast} from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const Tabs = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        key="success-toast"
        style={{ borderLeftColor: 'green' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: 'bold' 
        }}
        renderTrailingIcon={() => (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
              <Image
                source={require('../../../assets/icons/green-tick.png')}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </View>
          )}
      />
    ),
    info: (props) => (
        <BaseToast
        {...props}
        key="info-toast"  
        style={{ borderLeftColor: 'blue' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
            fontSize: 15,
            fontWeight: 'bold',
        }}
        renderTrailingIcon={() => (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
            <Image
                source={require('../../../assets/icons/loading.gif')} 
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
            />
            </View>
        )}
        />
    ), 
    
};

/* 
Layout for the Home Page
Includes the Tab Navigation (Spotted & Lost)
*/
const Home = () => {

    const [isRecognitionRunning, setIsRecognitionRunning] = useState(false);
    const [recognitionInProgress, setRecognitionInProgress] = useState(null); // To track AsyncStorage changes

    // Poll for recognition status
    useEffect(() => {
        let intervalId;

        const pollRecognitionStatus = async () => {
            try {
                // Fetch current value of recognitionInProgress from AsyncStorage
                const recognitionStatus = await AsyncStorage.getItem('recognitionInProgress');

                // Update state if AsyncStorage value changes
                if (recognitionStatus !== recognitionInProgress) {
                    setRecognitionInProgress(recognitionStatus);
                }
            } catch (error) {
                console.error("Error checking recognition status:", error);
            }
        };

        // Start polling every 2 seconds
        intervalId = setInterval(pollRecognitionStatus, 2000);

        return () => {
            clearInterval(intervalId);  // Cleanup on component unmount
        };
    }, [recognitionInProgress]);  // Trigger useEffect when recognitionInProgress changes

    // React to recognitionInProgress changes
    useEffect(() => {
        if (recognitionInProgress && !isRecognitionRunning) {
            // Recognition has started
            setIsRecognitionRunning(true);
            Toast.show({
                type: 'info',
                text1: 'Model is running...',
                position: 'top',
                autoHide: false,  // Keep toast visible
            });
            console.log("Recognition started, showing banner");
        } else if (!recognitionInProgress && isRecognitionRunning) {
            // Recognition has completed
            setIsRecognitionRunning(false);
            Toast.hide();  // Hide the running toast

            setTimeout(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Model completed!',
                    text2: 'A.I. matching complete. Check your notifications.',
                    position: 'top',
                    visibilityTime: 5000,  // Show toast for 5 seconds
                });
            }, 500);  // Delay for clarity
            console.log("Recognition completed, hiding banner");
        }
    }, [recognitionInProgress, isRecognitionRunning]);  // React when AsyncStorage or running state changes

    


    return (
        <LocationContext.LocationProvider>
            <GestureHandlerRootView className="flex-1">
                <SafeAreaView className="bg-offwhite h-full">
                    <View className="flex-1 bg-['#FFFFFD']">
                        <Tabs.Navigator
                            screenOptions={{
                                tabBarActiveTintColor: "#34657B",
                                tabBarIndicatorStyle: {
                                    backgroundColor: "#A9E0E2",
                                    height: 90,
                                    borderColor: "#OOOOOO",
                                },
                                tabBarItemStyle: {
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                },
                                tabBarStyle: {
                                    gap: 10,
                                    padding: 0,
                                    height: 45,
                                },
                            }}
                        >
                            <Tabs.Screen
                                name="spotted"
                                component={Spotted}
                                options={{
                                    title: "Spotted",
                                    tabBarIcon: ({ color }) => (
                                        <Ionicons
                                            name="locate-outline"
                                            size={20}
                                            color={color}
                                        />
                                    ),
                                }}
                            />

                            <Tabs.Screen
                                name="lost"
                                component={Lost}
                                options={{
                                    title: "Lost",
                                    tabBarIcon: ({ color }) => (
                                        <Ionicons
                                            name="help-circle-outline"
                                            size={20}
                                            color={color}
                                        />
                                    ),
                                }}
                            />
                        </Tabs.Navigator>
                    </View>
                    <Toast config={toastConfig}/>
                </SafeAreaView>
            </GestureHandlerRootView>
        </LocationContext.LocationProvider>
    );
};

export default Home;
