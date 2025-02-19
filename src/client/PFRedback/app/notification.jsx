import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import ComingSoonPost from "../components/ComingSoonPost";
import { router } from "expo-router";

const Notification = () => {

    // Hardcoded the notification message
    const notifications = [
        { id: '1', message: 'A.I. Matching Complete. Check your latest pet matches now!' },
    ];

    const handlePress = () => {
        router.push('/img-recog-feed');
    };

    const renderNotification = ({ item }) => (
        <TouchableOpacity onPress={handlePress} className="bg-white p-4 m-2 rounded-lg">
            <Text className="text-moss text-base font-semibold">{item.message}</Text>
        </TouchableOpacity>
    );




    return (
        <>
            <View className="h-full bg-tiff_blue justify-center">

                <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
                contentContainerStyle={{ padding: 10 }}
                 />
            </View>
        </>
    );
};

export default Notification;
