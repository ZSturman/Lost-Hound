import { View, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from "../constants/images";

const ImgRecogGridView = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const showPosts = async () => {
            try {
                // Check if topMatches exist in AsyncStorage
                const storedTopMatches = await AsyncStorage.getItem('topMatches');
                if (storedTopMatches) {
                    const parsedMatches = JSON.parse(storedTopMatches);
                    setPosts(parsedMatches); 
                    console.log("Loaded topMatches in ImgRecogGridView");
                } else {
                    // If no topMatches, set an empty posts state
                    console.log("Image recognition not ready, no topMatches.");
                    setPosts([]);
                }
            } catch (error) {
                console.error("Error fetching posts: ", error);
                setPosts([]); // On error, set an empty posts state
            }
        };

        showPosts();
    }, []); 

    return (
        <View className="flex-1 bg-[#FFFFFD]">
            {posts.length === 0 ? (
                <View className="justify-center items-center flex-1 h-full pt-60">
                    <Image
                        source={images.defaultCat}
                        className="w-[125px] h-[125px] items-center mx-auto"
                        resizeMode="contain"
                    />
                    <Text className="text-slate-500 tracking-wider font-light mt-6 mx-auto">
                        No posts available
                    </Text>
                </View>
            ) : (
                <View className="grid-cols-2 gap-2 flex-row flex-wrap pl-[25] pt-6">
                    {/* Map each object in array into item card component */}
                    {posts.map((obj, i) => (
                        <ItemCard key={i} item={obj} img={i} />
                    ))}
                </View>
            )}
        </View>
    );
};

export default ImgRecogGridView;
