import { View } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChatCard from "../components/ChatCard";
import { ScrollView } from "react-native-gesture-handler";
import { getCurrentAccount, getAccountById } from "../api/accountApi"
import { FIREBASE_DB } from "../config/FirebaseConfig.js"
import { onSnapshot, collection, query, where } from "firebase/firestore"


// Chat List
const Message = () => {
    const db = FIREBASE_DB

    const [user, setUser] = useState(null)
    const [chats, setChats] = useState([])

    useEffect(() => {
        const fetchChats = async () => {
            // get current account
            const currentAccount = await getCurrentAccount()
            setUser(currentAccount)

            // setting up the listener for new updates to the chats collection, filtering out documents that
            // not involve the user
            const chatsRef = collection(db, "chats")
            const chatsQuery = query(chatsRef, where("users", "array-contains", currentAccount.id))
            const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
                const chatPromises = querySnapshot.docs.map(async (doc) => {
                    const data = doc.data()
                    const chatThreadId = data.chatThreadID
                    const otherUserId = data.users.find(userId => userId !== currentAccount.id)

                    try {
                        // information used to generate the chat card
                        const otherAccount = await getAccountById(otherUserId)
                        const otherUserName = otherAccount.name
                        
                        let allMessages = data.messages
                        const latestMessageDetails = allMessages[allMessages.length - 1]
                        const latestMessage = latestMessageDetails.text
                        
                        // format date for latest message for the chat card component 
                        const createdAt = latestMessageDetails.createdAt
                        const latestMessageDate = formatDateForChatCard(new Date(createdAt.toDate()))

                        allMessages = await data.messages.map(formatDateForGiftedChat)
                            

                        return {
                            chatThreadId,
                            otherUserId,
                            otherUserName,
                            latestMessage, 
                            latestMessageDate,
                            allMessages
                        }
                       
                    } catch (error) {
                        console.log(error)
                        return null
                    }
                })

                Promise.all(chatPromises).then(resolvedChats => {
                    const newChats = resolvedChats.filter(chat => chat !== null);
                    setChats(newChats)
                }).catch(error => {
                    console.log("Error resolving chat promises: ", error);
                })
            })
            return () => {unsubscribe()}
        }

        fetchChats()

    }, [])
                
    // format the date in a readable way
    const formatDateForChatCard = (date) => {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)

        // if date is today, show the time
        if (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        ) {
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const ampm = hours >= 12 ? 'PM' : 'AM'
            const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`
            return formattedTime
        }


        // if date is yesterday, show 'yesterday'
        if (
            date.getFullYear() === yesterday.getFullYear() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getDate() === yesterday.getDate()
        ) {
            return 'Yesterday'
        }

        // otherwise, show the date in mm/dd/yy
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const year = String(date.getFullYear() % 100).padStart(2, '0')
        return `${month}/${day}/${year}` 
    }

    // format date for GiftedChat component on the chat page
    // and if message is sent by the other person, mark as received
    const formatDateForGiftedChat = (message) => {
        const createdAt = message.createdAt
        const messageDate = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000)

        return {
            ...message,
            createdAt: messageDate
        }
    }

    
    return (
        <GestureHandlerRootView className="flex-1">
                <ScrollView className="flex-1 flex-grow bg-white">
                    <View className="h-full bg-white">
                        {chats.map(({ chatThreadId, otherUserId, otherUserName, latestMessage, latestMessageDate, allMessages }) => (
                            
                            <ChatCard 
                                key={chatThreadId} 
                                chatThreadId={chatThreadId}
                                otherUserId={otherUserId}
                                otherUserName={otherUserName}
                                lastMessage={latestMessage}
                                date={latestMessageDate}
                                chatMessages={allMessages}
                                currentUser={user}/>
                        ))}
                    </View>
                </ScrollView>
        </GestureHandlerRootView>
    )
}

export default Message;
