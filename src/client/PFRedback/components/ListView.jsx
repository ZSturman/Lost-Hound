import { View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AccountPost from "./AccountPost";
import { getUserPosts } from "../api/items";
import { useFocusEffect } from "expo-router";
import Constants from 'expo-constants';

const ListView = ({id, type}) => {
    const [posts, setPosts] = useState([]);
    const [hasFetchedAllPosts, setHasFetchedAllPosts] = useState(false);

    const handleOnRefresh = useCallback(async () => {
        await getUserPosts(type,id).then(posts => setPosts(posts));
    }, []);

    const [host, setHost] = useState('')

    // Fetch all posts from back end using item api (needs to write api to handle posts associated with account)
    useFocusEffect(
        useCallback(() => {
            (async() => {
                if(!hasFetchedAllPosts){
                    await getUserPosts(type,id).then(posts => setPosts(posts));
                    setHasFetchedAllPosts(true)
                }
            })();
        }, [])
    )

    // Fetch the current host to link to this particular lost post
    // NOTE: the current link won't actually link to this particular page when scanned 
    // (because the page needs to be hosted outside of expo go)
    useEffect (() => {
        const expoHost = Constants.expoGoConfig.debuggerHost
        console.log("expo go object: ", expoHost)

        // static link to Tico post
        const expoLink = `exp://${expoHost}/--/view-post?id=Si9GGIahGuoucpAMNBxn&type=lost`
        setHost(expoHost)
    }, [])

    console.log(id)
    console.log("list fetch check: ", posts)

    return (
        <View className="relative bg-[#FFFFFD] space-y-5">

            {/* Map each object in array into item card component */}
            {posts && posts.map((obj,i) => 
                    <AccountPost key={i} item={obj} host={host} refresh={handleOnRefresh}/>
            )}
        </View>
    );
}

export default ListView