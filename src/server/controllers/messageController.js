import { FIREBASE_AUTH, FIREBASE_DB } from "../config/firebase.js";
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    Timestamp,
    query,
    where,
    orderBy,
    arrayUnion
} from "firebase/firestore";

import Messages from "../models/messages.js"
import MessagingThread from "../models/messagingThread.js"

const auth = FIREBASE_AUTH
const db = FIREBASE_DB
const chatsRef = collection(db, "chats")


/**
 * Retrieves all chats 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} - An array of MessagingThread objects
 */
const getAllChats = async (req, res) => {
    // GET
    try {
        const allChats = []
        const chats = await getDocs(chatsRef)

        chats.forEach((doc) => {
            const chat = doc.data()
            allChats.push(chat)
        })

        return res.status(200).json(allChats)
        
    } catch (error) {
        console.error("Error getting chats: " + error.message)
        return res.status(400).json("Error getting chats: " + error.message)
    }
}

/**
 * Retrieve the chat thread by its ID
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {MessagingThread} - Containing all details of the message thread
 */
const getChatByThreadId = async (req, res) => {
    // GET
    try {
        const { threadID } = req.params
        console.log("Retrieving chat at this thread id: ", threadID)

        let q = query(chatsRef, where("__name__", "==", threadID))
        const chat = await getDocs(q)
        const chatData = chat.docs[0].data()
        return res.status(200).json(chatData)
    } catch (error) {
        console.error("Error getting chat: " + error.message)
        return res.status(400).json("Error getting chat: " + error.message)
    }
}

/**
 * Retrieves the chat thread(s) that the current user is involved in 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} - An array of MessagingThread objects
 */
const getChatByUser = async (req, res) => {
    try {
        const { userID } = req.params

        if (!userID) {
            return res.status(400).send("user ID required.");
        }

        const allChats  = []

        let q = query(chatsRef, where("users", "array-contains", userID))
        const chats = await getDocs(q)

        chats.forEach((doc) => {
            const chat = doc.data()

            // convert dates to readable dates
            chat.createdAt = chat.createdAt.toDate()
            chat.lastUpdated = chat.lastUpdated.toDate()

            chat.messages = chat.messages.map(message => {
                message.createdAt = new Date(message.createdAt.toDate())
                return message
            })
        
            allChats.push(chat)
        })
        
        return res.status(200).json(allChats)

    } catch (error) {
        console.error("Error getting chat: " + error.message)
        return res.status(400).send("Error getting chat: " + error.message)
    }
}

/**
 * Retrive the chat thread that both users are involved in
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {MessagingThread, String} - the MessagingThread object and the threadID associated with the object
 */
const getChatByBothUsers = async (req, res) => {
    // GET
    try {
        const { user1, user2 } = req.query

        console.log(user1)
        console.log(user2)

        if (!user1 || !user2) {
            return res.status(400).send("Both user IDs are required.");
        }

        // query the doc for chats that contains user 1
        let q = query(chatsRef, where("users", "array-contains", user1));
        const chats = await getDocs(q)

        // filter out chats that do not contain user 2
        for (const doc of chats.docs) {
            const chat = doc.data()

            console.log("does it include user2: ",chat.users.includes(user2))

            if (chat.users.includes(user2)) {
                // convert dates to readable dates
                chat.createdAt = chat.createdAt.toDate()
                chat.lastUpdated = chat.lastUpdated.toDate()
                
                chat.messages = chat.messages.map(message => {
                    message.createdAt = new Date(message.createdAt.toDate())
                    return message
                })

                return res.status(200).json({chat: chat, threadId: chat.chatThreadID })
            }
        }
        return res.status(200).json({chat: [], threadID: null})
    } catch (error) {
        console.error("Error getting chat: " + error.message)
        return res.status(400).send("Error getting chat: " + error.message)
    }
}


/**
 * Saves a new message to an existing thread 
 * 
 * @param {*} req 
 * @param {*} res 
 */
const saveNewMessage = async (req, res) => {
    // POST 
    
    try {
        const { threadID } = req.params
        const { authorID, name, text } = req.body

        const messageID = doc(chatsRef).id

        const chatThreadRef = doc(db, 'chats', threadID)

        // construct the map object for sender's info
        const senderInfo = {
            name,
            authorID
        }

        // construct the message object 
        const newMessage = new Messages (
            messageID,
            senderInfo,
            Timestamp.now(),
            text,
            true, 
            false,
            false
        )

        // add new message to the messages array, and modify the lastUpdated field
        await updateDoc(chatThreadRef, {
            messages: arrayUnion({...newMessage}),
            lastUpdated: Timestamp.now()
        })

        console.log(`new message added from ${name}`)
        res.status(200).send("Added message to existing thread")

    } catch (error) {
        console.error("Error saving new message: " + error.message)
        return res.status(400).send("Error saving new message: " + error.message)
    }
}

/**
 * Creates a new thread between 2 users if it doesn't exist
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {String} - the created chat thread ID
 */
const createNewChat = async (req, res) => {
    // POST
    
    try {
        const { user1, user2 } = req.query
        const { authorID, name, text } = req.body

        console.log("creating new chat")

        // check if both users are valid
        if (!user1 || !user2) {
            return res.status(400).send("both user IDs required");
        }

        // check if chat already exists, if it does, then just update the chat (add it before threadID gets set below)

        // generate unique IDs
        const chatDocRef = doc(chatsRef)
        const threadID = chatDocRef.id
        const messageID = doc(chatsRef).id

        const users = [user1, user2]

        // construct the map object for sender's info
        const senderInfo = {
            name,
            authorID
        }

        // construct the message object 
        const newMessage = new Messages (
            messageID,
            senderInfo,
            Timestamp.now(),
            text,
            true, 
            false,
            false
        )

        // construct new thread object
        const newThread = new MessagingThread (
            threadID,
            users,
            [{...newMessage}],
            Timestamp.now(),
            Timestamp.now()
        )

        // add new thread document to the collection 
        await setDoc(chatDocRef, { ...newThread })

        console.log("new chat thread created: ", threadID)
        res.status(200).send(threadID)

    } catch (error) {
        console.error("Error creating new chat: " + error.message)
        return res.status(400).send("Error creating new chat: " + error.message)
    }

}

/**
 * Updates the read status of a message 
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateReadStatus = async (req, res) => {
    // PATCH 

    try {
        const { threadID } = req.params

        console.log("updating ifRead status")

        // check if thread and message ID exists 
        const chatThreadRef = doc(db, 'chats', threadID)
        const chatSnapshot = await getDoc(chatThreadRef)

        if (!chatSnapshot.exists()) {
            return res.status(400).send("Chat not found")
        }

        // retrieve messages array
        const chatData = chatSnapshot.data()
        const messages = chatData.messages

        // updates the "read" field in the messages array until it encounters a "read" = true
        // this is to deal with the situation where there are multiple messages the user has yet to read
        for (let i = messages.length-1; i >= 0; i--) {
            console.log("number of messages = ", messages.length)
            if (messages[i].ifRead === false) {
                console.log("if read is false")
                messages[i].ifRead = true
                console.log("if read is now true")
            } else if (messages[i].ifRead === true) {
                console.log("if read is true")
                break
            }
        }

        // update the messages array
        await updateDoc(chatThreadRef, {
            messages: messages,
        })


        console.log("updated ifRead status")
        res.status(200).send("updated ifRead status")
        
    } catch (error) {
        console.error("Error updating read status: " + error.message)
        return res.status(400).send("Error updating read status: " + error.message)
    }
}

/**
 * Updates the received status of a message
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateReceivedStatus = async (req, res) => {
    try {
        const { threadID, messageID } = req.params

        // check if thread and message ID exists 
        const chatThreadRef = doc(db, 'chats', threadID)
        const chatSnapshot = await getDoc(chatThreadRef)

        if (!chatSnapshot.exists()) {
            return res.status(400).send("Chat not found")
        }

        // retrieve messages array
        const chatData = chatSnapshot.data()
        const messages = chatData.messages
        const messageIndex = messages.findIndex(message => message.messageID === messageID)

        if (messageIndex === -1) {
            return res.status(404).send("Message not found")
        }

        // update ifReceived field
        messages[messageIndex].ifReceived = true

        await updateDoc(chatThreadRef, {
            messages: messages
        })

        console.log("updated ifReceived status")
        res.status(200).send("updated ifReceived status")

    } catch (error) {
        console.error("Error updating read status: " + error.message)
        return res.status(400).send("Error updating read status: " + error.message)
    }

}



export default { getAllChats, getChatByThreadId, getChatByUser, getChatByBothUsers, saveNewMessage, createNewChat, updateReadStatus, updateReceivedStatus }