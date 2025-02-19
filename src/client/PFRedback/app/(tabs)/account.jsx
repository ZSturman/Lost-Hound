import React, { useState, useEffect, useCallback } from "react";
import ListView from "../../components/ListView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl,
} from "react-native";
import ProfileImage from "../../components/ProfileImage";
import EditButton from "../../components/EditButton";
import { getCurrentAccount } from "../../api/accountApi";

const account = () => {
    const [user, setUser] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    // Fetch current account from back end using item api
    useEffect(() => {
        (async () => {
            await getCurrentAccount().then((account) => {
                console.log("inside", account);
                setUser(account);
            });
        })();
    }, [setUser]);

    console.log("outside", user);

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1">
                {user && (
                    <View className="flex-1 bg-[#FFFFFD]">
                        <View className="border-b-2 border-gray-200 border-opacity-20">
                            <View className="flex-row items-center border-b-2 border-gray-300 border-opacity-20">
                                <ProfileImage name={user.name} />

                                <View className="items-start">
                                    <Text className="text-xl">{user.name}</Text>
                                    <Text className="text-base">
                                        {user.email}
                                    </Text>
                                    <Text className="text-base">
                                        Address: {user.state}
                                    </Text>
                                    <EditButton />
                                </View>
                            </View>
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
                            <Text className="text-2xl font-normal ml-14 mt-5">
                                Lost pets
                            </Text>
                            <ListView id={user.id} type={"lost"} />
                            <Text className="text-2xl font-normal ml-14 mt-5">
                                Spotted pets
                            </Text>
                            <ListView id={user.id} type={"spotted"} />
                        </ScrollView>
                    </View>
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default account;
