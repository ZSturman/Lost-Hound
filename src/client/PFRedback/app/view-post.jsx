import { Image, Text, SafeAreaView, TextInput, ScrollView, View, Alert } from "react-native";
import React, {useEffect, useState} from "react";
import { router, Stack } from "expo-router";
import OverlayTag from "../components/OverlayTag";
import CustomButton from '../components/CustomButton'
import PostCarousel from "../components/PostCarousel";
import { useLocalSearchParams } from 'expo-router';
import { getPostByID } from "../api/items";
import locations from "../api/locations";
import { getCurrentAccount } from "../api/accountApi";
import { getChatByUsers } from "../api/messaging";



const ViewPost = () => {
    
    const [post, setPost] = useState();
    const [location, setLocation] = useState('');
    const [user, setUser] = useState(null);
    const {id, type}  = useLocalSearchParams();
    console.log("pass item to view details: ",{id, type});
    

    // Fetch current account from back end using item api
    useEffect(() => {
        (async () => {
            await getCurrentAccount().then((account) => {
                console.log("inside", account);
                setUser(account);
            });
        })();
    }, [setUser]);

    useEffect(() => {
        (async() => {
            await getPostByID(type, id).then(post => setPost(post));
        })();
    }, [])

    useEffect(() => {
        if (post) {
            (async () => {
                let convertedLocation = {
                    lat: post.lastSeenLocation.latitude,
                    lng: post.lastSeenLocation.longitude
                } 
                const address = await locations.getAddressFromCoordinates(convertedLocation)
                setLocation(address)
            })()
        }
    }, [post])

    console.log("retrieved post details: ", post);

    // Calling update post status api
    const update = async (event) => {

        const hostURL = process.env.HOST_URL;
        const url = `${hostURL}/api/posts/${type}/update_status/${id}`;

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            }
        });
        const result = await response.text();
        console.log(result);
    }

    // Confirm that user wants to mark post as found
    const handleUpdate = (event) => {
        Alert.alert(
            "Confirm Update Post Status?",
            "Are you sure you want to mark this post as Found?",
            [{
                text: "Cancel",
                onPress: () => console.log("Update Status Button Cancelled"),
                style: "cancel",
                role: "cancel"
            },
            {
                text:"Mark as Found", onPress: () => {
                    update(event);
                    Alert.alert(
                        "Post Status Updated!",
                        router.push({pathname: `/account`}));
                }
            }]
        );
    }

    // Direct user to chat page 
    const handleChat = async () => {
        // retrieve chat for these specific users (author of post and current user)
        let {chat, threadId} = await getChatByUsers([post.authorID, user.id])
        console.log("threadId in view post: ", threadId)

        let chatMessages = {}

        if (chat) {
            chatMessages = chat.messages
        }

        console.log("chat retrieved: ", chat)
        console.log("thread id:" , threadId)

        router.push({
            pathname: "/chat", 
            params: {threadId: threadId, 
                    otherUserId: post.authorID,
                    otherUserName: post.authorName, 
                    chatMessages: JSON.stringify(chatMessages),
                    currentUser: JSON.stringify(user)}})
    }

    return (
        <SafeAreaView className="flex-1 justify-center align-center bg-[#FFFFFD]">

            {post && <ScrollView className="px-5">

                <View className="justify-center flex-row mt-5">
                    <PostCarousel postList={post} isFeed={false}/>
                </View>

                {/* Pet Name */}
                <View className="mt-5 flex-row justify-center">
                    <View>
                        <View className="flex-row justify-start items-center">
                            <Text className="text-left text-black text-xl font-bold mr-2">
                                {type != "spotted" && post.petName || "Spotted " + post.species}
                            </Text>                    
                            <OverlayTag text={type + post.timeDifference} />
                        </View>

                        {/* Species with OverlayTag */}
                        <View className="flex-row justify-start">
                            <Text className="text-dark_grey text-base mr-1">Species*</Text>
                            <OverlayTag text= {post.species} colour="#B5A3CA"/>
                        </View>

                        {/* Colour with OverlayTag*/}
                        <View className="flex-row justify-start mr-1">
                            <Text className="text-dark_grey text-base">
                                Colour* 
                            </Text>
                            <OverlayTag 
                                colour='#8CBEE2'
                                text= {post.primaryColour}
                            />
                        </View>

                        {/* Breed with OverlayTag*/}
                        {post.breed && <View className="flex-row justify-start mr-1">
                            <Text className="text-dark_grey text-base">
                                Breed  
                            </Text>
                            <OverlayTag 
                                colour='#A3E5D0'
                                text= {post.breed}
                            />
                        </View>}

                        {/* Additional Details */}
                        <Text className="mt-1 text-left text-dark_grey text-base">
                            Additional Details
                        </Text>

                        {/* TextInput for Additional Details */}
                        <TextInput
                            className="mt-2 mx-auto w-[350px] min-h-[100px] text-left text-black text-base border border-gray-300 p-3 bg-black-100 rounded-2xl"
                            editable={false}
                            multiline={true}
                            value={post.additionalDetails}
                            //value="Lorem ipsum dolor sit amet, consectetur adipiscing elit purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor."
                        />

                        {/* Last Seen Section */}
                        <Text className="mt-5 text-left text-black text-xl font-bold">
                            Last Seen
                        </Text>

                        {/* Edit this to not be static */}
                        <View className="w-[350px] mb-0">
                            <Text className="mt-1 text-left text-black text-base text-balace text-wrap">
                                {location}
                            </Text>
                        </View>

                        

                    </View>
                    
                </View>



            </ScrollView>}

                {/* Need condition to switch to contact or update status */}
                {   post && user && post.authorID === user.id &&
                    <CustomButton
                        title="Update post status"
                        handlePress={handleUpdate}
                        textStyles="text-moss"
                        containerStyles="mt-5 mx-auto w-[350px] rounded-2xl bg-tiff_blue  border-black-200"
                    />

                    ||

                    <CustomButton 
                        title="Contact"
                        handlePress={handleChat}  
                        textStyles="text-moss"
                        containerStyles="mt-5 mx-auto w-[350px] rounded-2xl bg-tiff_blue  border-black-200"
                    />
            }


            {/* Overlay screen for found post */}
            {post && post.status == "Found" && 
                <SafeAreaView className="absolute top-0 right-0 left-0 bottom-0 bg-gray-500/50">
                    <Text className="self-center top-1/2 font-extrabold text-3xl text-white">Pet Found</Text>
                </SafeAreaView>}
        </SafeAreaView>
    );
};

export default ViewPost;