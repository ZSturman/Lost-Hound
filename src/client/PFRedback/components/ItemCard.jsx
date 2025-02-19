import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions,
} from "react-native";
import OverlayTag from "./OverlayTag";
import { Shadow } from "react-native-shadow-2";
import { router, usePathname, useSegments } from "expo-router";
import images from "../constants/images";
import { cat_img } from "../constants/cat_img";

const PAGE_WIDTH = Dimensions.get("window").width;

// Get the names of images available
const imagesKeyList = Object.keys(cat_img);

const ItemCard = ({ item, img }) => {
    const segments = useSegments();

    const path = segments.slice(-1)[0];

    // Get the name of the image at the current index
    const name = imagesKeyList[img];

    return (
        <SafeAreaView>
            <TouchableOpacity
                onPress={() => {
                    const postID =
                        (path === "spotted" || path === "img-recog-feed") ? item.spottedPostId : item.lostPostId;

                    const type = (path === "img-recog-feed") ? "spotted" : path;

                    router.push({
                        pathname: `/view-post`,
                        params: { id: postID, type: type },
                    });
                }}
            >
                <Shadow
                    distance={2}
                    startColor={"#0223"}
                    offset={[10, 11]}
                    className="rounded-xl"
                >
                    <View
                        className="border-solid border-[#E5E5E5] bg-[#F7F7F7] m-2 overflow-hidden rounded-[10px] border-t-[1px] border-l-[1px]"
                        style={{
                            width: PAGE_WIDTH * 0.4,
                            height: PAGE_WIDTH * 0.54,
                        }}
                    >
                        <View
                            className="rounded-[3px] bg-[#c6e2d4] self-center mt-2"
                            style={{
                                width: PAGE_WIDTH * 0.4 * 0.9,
                                height: PAGE_WIDTH * 0.5 * 0.8,
                            }}
                        >
                            {
                                item.photo && item.photo.length > 0 && (
                                    <Image
                                        source={typeof item.photo[0] === 'string' ? { uri: item.photo[0] } : item.photo[0]}  // Handle both remote URLs and local images
                                        style={{
                                            width: PAGE_WIDTH * 0.4 * 0.9,
                                            height: PAGE_WIDTH * 0.5 * 0.8,
                                        }}
                                    />
                                )
                            }
                            <View className="absolute bottom-0 left-0 self-start">
                                <OverlayTag
                                    text={
                                        "Last seen " + item.dateLastSeenString
                                    }
                                />
                            </View>
                        </View>

                        {/* Conditional rendering for pet name if it exists */}
                        {("petName" in item && item.petName != "" && (
                            <Text className="ml-[5%] text-base mt-[2%] font-semibold">
                                {item.petName + " - " + item.species}
                            </Text>
                        )) || (
                            <Text className="ml-[5%] text-base mt-[2%] font-semibold">
                                {item.species}
                            </Text>
                        )}

                        <View>
                            <Text className="ml-[5%] text-sm font-normal text-left">
                                {item.primaryColour} {item.breed}
                            </Text>
                        </View>

                        {/* Add grey out effect if the pet is found */}
                        {item && item.status == "Found" && (
                            <View className="absolute top-0 right-0 left-0 bottom-0 bg-gray-400/60">
                                <Text className="self-center top-1/2 font-extrabold text-2xl text-white">
                                    Pet Found
                                </Text>
                            </View>
                        )}
                    </View>
                </Shadow>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ItemCard;
