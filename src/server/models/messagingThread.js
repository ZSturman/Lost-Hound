/**
 * This file is the model of the MessagingThread
 * --------------------------------
 * @module domain.MessagingThread
 */

class MessagingThread {
    constructor(
        chatThreadID,
        users,
        messages,
        createdAt,
        lastUpdated
    ) {
        // The unique identifier of the post
        this.chatThreadID = chatThreadID;

        // The users involved in this conversation thread 
        this.users = users;

        // An array of messages 
        this.messages = messages;

        // The timestamp when this thread was created
        this.createdAt = createdAt;

        // The timestamp when this thread was last updated 
        this.lastUpdated = lastUpdated;
        
    }
}

export default MessagingThread;