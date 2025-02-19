/**
 * This file is the model of Messages
 * --------------------------------
 * @module domain.Messages
 */

class Messages {
    constructor(
        messageID,
        senderInfo,
        createdAt,
        text, 
        ifSent,
        ifReceived,
        ifRead
    ) {
        // The unique identifier of the message
        this.messageID = messageID;

        // The information of the sender (authorId and name)
        this.senderInfo = senderInfo;

        // The timestamp when this message was created
        this.createdAt = createdAt;

        // The content of the message
        this.text = text;

        // Indicates if the message has been sent (true for sent, false otherwise)
        this.ifSent = ifSent;

        // Indicates if the message has been received by the target user (true for received, false otherwise)
        this.ifReceived = ifReceived;

        // Indicates if the message has been read by the target user (true for read, false otherwise)
        this.ifRead = ifRead;   
    }
}

export default Messages;