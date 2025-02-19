import { View, Text, Image } from "react-native";
import React, { useState, useCallback } from "react";
import ItemCard from "./ItemCard";
import { getAllPosts } from "../api/items"
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from "../constants/images";



const GridView = ({type}) => {

    const [posts, setPosts] = useState([]);
    const [hasFetchedAllPosts, setHasFetchedAllPosts] = useState(false)

    const getFilterStorageKey = (type) => {
        return type === 'lost' ? 'prevFilterLost' : 'prevFilterSpotted'
    }

    useFocusEffect(
        useCallback(() => {
            const showPosts = async () => {
                const storedFilteredPosts = await AsyncStorage.getItem('filteredPosts')
                const filterKey = getFilterStorageKey(type)

                if (storedFilteredPosts && storedFilteredPosts !== undefined) {
                    setPosts(JSON.parse(storedFilteredPosts))
                } else if (!hasFetchedAllPosts) {
                    await getAllPosts(type).then(posts => setPosts(posts))
                    setHasFetchedAllPosts(true)
                    await AsyncStorage.removeItem(filterKey)
                } else {
                    setPosts([])
                }
                await AsyncStorage.removeItem('filteredPosts')

            }
            showPosts()

            return () => setHasFetchedAllPosts(false)
        }, [type])
    )
    

    return (
        <View className="flex-1 bg-[#FFFFFD]">
            {posts.length === 0  ? (
                <View className="justify-center items-center flex-1 h-full">
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
                <View className="grid-cols-2 gap-2 flex-row flex-wrap">
                    {/* Map each object in array into item card component */}
                    {posts.map((obj, i) => {
                    return <ItemCard key={i} item={obj} img={i} />})}
                </View>
            )}
            
        </View>
    );
}

export default GridView