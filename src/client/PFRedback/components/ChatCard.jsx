import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity
} from "react-native";

import ProfileImage from "./ProfileImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { updateReadStatus } from "../api/messaging";

const ChatCard = ({chatThreadId, otherUserId, otherUserName, lastMessage, date, chatMessages, currentUser}) => {
    const lastChatMessage = chatMessages[chatMessages.length - 1]
    const isMessageFromOtherUser = lastChatMessage.senderInfo.authorID !== currentUser.id

    // navigates to the individual chat page, and changes the read status if message is coming from other user
    const handlePress = async () => {
        router.push({
            pathname: "/chat", 
            params: {threadId: chatThreadId, 
                    otherUserId: otherUserId,
                    otherUserName: otherUserName, 
                    chatMessages: JSON.stringify(chatMessages),
                    currentUser: JSON.stringify(currentUser)}})

        if (!lastChatMessage.ifRead && isMessageFromOtherUser) {
            await updateReadStatus(chatThreadId)
        }
    }


    return (
        <SafeAreaView>
            <TouchableOpacity onPress={handlePress}>
                <View className="border-b-[1px] border-[#c1c0c0] mx-2 mt-2 h-fit">
                    <View className="flex-row">
                        <ProfileImage name={otherUserName} height={60} width={60}/>
                        <View className="mt-4 w-1/2">
                            <Text className="text-moss font-extrabold text-xl">
                                {otherUserName}
                            </Text>
                            <Text className="mt-2 text-moss pr-1" numberOfLines={2} ellipsizeMode="tail">
                                {lastMessage}
                            </Text>
                        </View>

                        <View className="relative flex-col items-center mt-4 pl-2">
                            <Text className="text-moss text-sm">{date}</Text>
                            
                            {isMessageFromOtherUser && !lastChatMessage.ifRead && (
                                <View className="flex-1 justify-center -top-2">
                                <Ionicons name="ellipse" color={"#ECD0C0"} size={18}/>
                                </View>
                            )}
                            
                        </View>
                    </View>
                    
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default ChatCard

