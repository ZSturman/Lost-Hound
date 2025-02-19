import { Text, View } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { GiftedChat } from 'react-native-gifted-chat'
import { saveNewMessage, createNewChat } from '../api/messaging'

// individual chat/conversation page
const chat = () => {
    const navigation = useNavigation()

    const {threadId, otherUserId, otherUserName, chatMessages = '{}', currentUser}  = useLocalSearchParams()
    
    const [newThreadId, setNewThreadId] = useState(threadId)
    const parsedChatMessages = JSON.parse(chatMessages)
    const currentAccount = JSON.parse(currentUser)

    // sets the header to the other user's name 
    useLayoutEffect(() => {
        if (otherUserName) {
            navigation.setOptions({
                title: otherUserName 
            })
        }
    }, [navigation, otherUserName])

    

    // formats the message to be compatible with the GiftedChat component 
    const formatMessage = (parsedChatMessages) => {
        let all = []

        if (Object.keys(parsedChatMessages).length !== 0) {
            parsedChatMessages.map((chatMessage) => {
                let modifiedMessages = {
                    _id: chatMessage.messageID, 
                    text: chatMessage.text,
                    createdAt: new Date(chatMessage.createdAt),
                    user: {
                        _id: chatMessage.senderInfo.authorID,
                        name: chatMessage.senderInfo.name
                    }
                }
                all.push(modifiedMessages)
            })
    
            all.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt) 
            })
        }
        return all
    }
    const [allMessages, setAllMessages] = useState(formatMessage(parsedChatMessages))

    
    // sends the message, and saves it to firestore or async storage
    const onSend = async (message = {}) => {
        console.log("the new message: ", message)
        setAllMessages(previousMessages => GiftedChat.append(previousMessages, message))
        console.log("message sent")

        const userID = message[0].user._id
        const userName = message[0].user.name
        const text = message[0].text
        
        if (newThreadId) {
            console.log("threadid exists: ", newThreadId)
            await saveNewMessage(newThreadId, userID, userName, text)
        } else {
            console.log("thread id does not exist, new chat")
            const threadIdCreated = await createNewChat([currentAccount.id, otherUserId], userID, userName, text)
            console.log("new chat id: ", threadIdCreated)
            setNewThreadId(threadIdCreated)
        }
    }

    return (
        <View className="flex-1 pb-10 bg-white">
            <GiftedChat 
                messages={allMessages}
                showAvatarForEveryMessage={true}
                onSend={allMessages => onSend(allMessages)}
                renderUsernameOnMessage={true}
                bottomOffset={50}
                user={{
                    _id: currentAccount.id,
                    name: currentAccount.name
                }}
                messagesContainerStyle={{
                    backgroundColor: 'white', 
                    paddingBottom: 20, 
                  }}
            />
        </View>
    )
}

export default chat