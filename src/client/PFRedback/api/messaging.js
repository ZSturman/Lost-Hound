const chatsEndpoint = "/api/chats"

/**
 * Retrieves all chats from firestore
 * @returns an array of chat thread objects
 */
const getAllChats = async () => {
    try {
        const hostURL = process.env.HOST_URL
        const url = `${hostURL}${chatsEndpoint}/all`
        console.log(url)

        const response = await fetch(url)

        if (response.ok) {
            const data = await response.json()

            console.log("all chats: ", data)
            return data
        } else {
            console.error("Error:", response.statusText); // Handle the error response
        }
    } catch (error) {
        console.error("Error fetching data: ", error)
    }
}


/**
 * Retrieves a chat thread by its associated ID 
 * @param threadID
 */
const getChatByThreadId = async (threadID) => {
    try {
        const hostURL = process.env.HOST_URL
        const url = `${hostURL}${chatsEndpoint}/${threadID}`
        console.log(url)

        const response = await fetch(url)

        if (response.ok) {
            const data = await response.json()
            console.log(`chat from ${threadID}: ${data}`)
            return data
        }

    } catch (error) {
        console.error("Error fetching data: ", error)
    }

}

/**
 * Retrieve a specific chat thread by the userID(s)
 * @param users - an array of userIDs (minimum 1, maximum 2)
 * @returns an array of chat thread objects if 1 user specified, otherwise, returns a chat thread object
 */
const getChatByUsers = async (users) => {
    try {
        console.log(users)
        console.log("number of users: ", users.length)
        const hostURL = process.env.HOST_URL
        let response = null

        if (users.length == 1) {
            const url = `${hostURL}${chatsEndpoint}/user/${users[0]}`
            response = await fetch(url)

        } else if (users.length == 2) {
            const url = `${hostURL}${chatsEndpoint}/between?user1=${users[0]}&user2=${users[1]}`
            console.log("two users: ", url)
            response = await fetch(url)
        } else {
            console.log("wrong number of users")
            return []
        }

        if (response.ok) {
            const data = await response.json()
            console.log("data from get chat (userid): ", data)
            return data
        } else {
            const data = await response.text()
            console.log(data)
            return []
        }
        
    } catch (error) {
        console.error("Error fetching data: ", error)
        return null
    }

}

/**
 * Saves a new message in an existing thread 
 * 
 * @param threadID 
 * @param authorID 
 * @param name 
 * @param text 
 */
const saveNewMessage = async (threadID, authorID, name, text) => {
    try {
        const hostURL = process.env.HOST_URL
        const url = `${hostURL}${chatsEndpoint}/${threadID}/messages`
        console.log(url)

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authorID: authorID,
                name: name,
                text: text
            })
        })


        if (response.ok) {
            const data = await response.text()
            console.log(data)
        } else {
            const data = await response.text()
            console.log(data)
        }
    } catch (error) {
        console.error("Error fetching data: ", error)
    }

}

/**
 * Creates a new chat thread between two users with the new message
 * 
 * router.post("/new", messageController.createNewChat)
 * 
 * @param users - array of userID
 * @param authorID 
 * @param name 
 * @param text 
 * @returns {String} - the created chat thread ID
 */
const createNewChat = async (users, authorID, name, text) => {
    try {
        const hostURL = process.env.HOST_URL
        const url = `${hostURL}${chatsEndpoint}/new?user1=${users[0]}&user2=${users[1]}`
        console.log(url)

        // const response = await fetch(url)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authorID: authorID,
                name: name,
                text: text
            })
        })

        if (response.ok) {
            const data = await response.text()
            console.log("new chat data: ", data)
            return data
        } else {
            const data = await response.text()
            console.log("error with user id: ", data)
            return null
        }
    } catch (error) {
        console.error("Error fetching data: ", error)
    }
}

/**
 * Updates the "ifRead" status of messages in a specific message thread 
 * 
 * @param threadID 
 */
const updateReadStatus = async (threadID) => {

    try {
        const hostURL = process.env.HOST_URL
        const url = `${hostURL}${chatsEndpoint}/${threadID}/messages/read`
        console.log(url)

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json-patch+json",
            }
        })

        if (response.ok) {
            const data = await response.text()
            console.log(data)
        } else {
            const data = await response.text()
            console.log("error: ", data)
        }
    } catch (error) {
        console.error("Error fetching data: ", error)
    }
}

/**
 * Updates the "ifReceived" status of a specific message
 * 
 * @param threadID 
 * @param messageID 
 */
const updateReceivedStatus = async (threadID, messageID) => {
    // PATCH METHOD

    try {
        const hostURL = process.env.HOST_URL
        const url = `${hostURL}${chatsEndpoint}/${threadID}/messages/${messageID}/received`
        console.log(url)

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json-patch+json",
            }
        })

        if (response.ok) {
            const data = await response.text()
            console.log(data)
        } else {
            const data = await response.text()
            console.log("error: ", data)
        }
    } catch (error) {
        console.error("Error fetching data: ", error)
    }
}


export { getAllChats, getChatByThreadId, getChatByUsers, saveNewMessage, createNewChat, updateReadStatus, updateReceivedStatus }