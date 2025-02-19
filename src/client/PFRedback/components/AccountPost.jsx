import { View, Text, TouchableOpacity, Dimensions, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import PostCarousel from "./PostCarousel";
import OverlayTag from "./OverlayTag";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { deletePostByID } from "../api/items";
import QRModal from "./QRModal";

const PAGE_WIDTH = Dimensions.get('window').width;

const AccountPost = ({item, host, refresh}) => {

    let itemType;
    let itemId;


    const [isQRModalVisible, setQRModalVisible] = useState(false)
    const [qrLink, setQrLink] = useState('')


    if("lostPostId" in item){
        itemType = "lost";
        itemId = item.lostPostId;
    }
    else if("spottedPostId" in item){
        itemType = "spotted";
        itemId = item.spottedPostId;
    }

    const handleDeletePost = () => {
        Alert.alert(
            "Confirm Delete Post",
            "Are you sure you want to delete your post?",
            [
            {
                text: "Cancel",
                onPress: () => console.log("Delete Button Cancelled"),
                style: "cancel",
                role: "cancel"
            },
            { text: "Delete post", onPress: () => {
                    deletePostByID(itemType, itemId);
                    console.log("Delete Button Pressed");
                    refresh(true);
                }
            },
            ],
            { cancelable: true }
        );
    };

    // generate link to this specific post 
    // NOTE: the current link won't actually link to this particular page when scanned 
    // (because the page needs to be hosted outside of expo go)
    const generateLink = () => {
        console.log(host)
        console.log(itemId)
        const qrLink = `exp://${host}/--/view-post?id=${itemId}&type=lost`
        setQrLink(qrLink)
    }

    const closeQRModal = () => {
        setQRModalVisible(false)
    }

    return (
        <TouchableOpacity onPress={() => {
            router.push({ pathname: `/view-post`, params:{id: itemId, type: itemType}})
        }}>

            {/* Wrapper for the entire post to be able to display in relative position */}
            <View className="mt-4 relative" >
                
                {/* Wrapper for the carousel to have background colour and other stuff */}
                <View className="border-[#1111112b] border-2 border-b-4 border-r-4 flex flex-col justify-center"
                style={{ backgroundColor:"#E8E8E8", alignSelf:"center", borderRadius:10, paddingBottom:2, height:PAGE_WIDTH*0.65}}>
                    <PostCarousel postList={item} isFeed={true}/>

                        <View className="right-0 px-[15px] mb-1 mt-0 absolute bottom-0 sm:w-full min-w-[90%]">
                        <View className="flex items-center flex-row gap-1">
                            {itemType && itemType == "spotted" &&
                            <Text className="text-black text-lg font-semibold pt-0">{item.species}</Text>}
                            <Text className="text-black text-lg font-semibold mr-[5px] pt-0">{item.petName}</Text>
                            <View>
                                <OverlayTag text={"Last seen " + item.dateLastSeenString}/>
                            </View>
                            {item.status == "Found" && <View><OverlayTag text={"Found"} colour="#93CF93"/></View>}

                        </View>
                            <View className="flex flex-row items-end justify-between">
                                <View className="flex">
                                    {/* Wrapper for title and overlay status tag */}
                                    
                                    
                                    {/* Body text */}
                                    <Text className="text-black text-sm font-normal mt-0 pt-0">
                                        {item.breed}{"\n"}{item.primaryColour}
                                    </Text>

                                </View>
                                {/* Buttons to share post, edit post, and delete post */}
                                <View className="flex flex-row items-end gap-4">
                                    {itemType === 'lost' && (
                                        <Pressable onPress={() => {setQRModalVisible(true), generateLink()}}>
                                            <Ionicons name="qr-code-outline" size={30}/>
                                        </Pressable>
                                    )}

                                    <Pressable onPress={() => {
                                        router.push({ pathname: `/edit-post`, params:{id: itemId, type: item.type}})
                                    }}>
                                        <Ionicons name="pencil-outline" size={30}/>
                                    </Pressable>

                                    <Pressable onPress={handleDeletePost}>
                                        <Ionicons name="trash-bin-outline" size={30}/>
                                    </Pressable>
                                </View>
                                
                            
                            </View>
                            
                        </View>
                        {item && item.status == "Found" && <View className="rounded-[10px] absolute top-0 right-0 left-0 bottom-0 bg-white/60"/>}
                </View>
            </View>
            <QRModal visible={isQRModalVisible} onClose={closeQRModal} link={qrLink}/>
        </TouchableOpacity>
    );
}

export default AccountPost