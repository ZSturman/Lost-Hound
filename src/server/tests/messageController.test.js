// Import necessary modules
import { getDocs, getDoc, updateDoc, setDoc, query, where, Timestamp, arrayUnion, doc } from "firebase/firestore";
import controller from "../controllers/messageController";

jest.mock("firebase/app", () => {
    return {
        initializeApp: jest.fn(),
    };
});

jest.mock("firebase/auth", () => {
    return {
        getAuth: jest.fn().mockReturnValue({
            currentUser: {
                email: "test",
                uid: "123",
                emailVerified: true,
            },
        }),
        auth: jest.fn(),
    };
});

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    arrayUnion: jest.fn(),
    Timestamp: {
        now: jest.fn().mockReturnValue({ seconds: 1634083200, nanoseconds: 0 }), // Mock Timestamp.now()
    }
}));

jest.mock("firebase/storage", () => {
    return {
        getStorage: jest.fn(),
    };
});

// Mock request and response objects
const req = {
    params: {},
    body: {},
    query: {},
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  

const mockChatData = {
    messages: [
      {
        messageID: 'message1',
        senderInfo: { name: 'User 1', authorID: 'author1' },
        createdAt: Timestamp.now(),
        text: 'Hello',
        ifRead: false,
        ifReceived: false,
      },
      {
        messageID: 'message2',
        senderInfo: { name: 'User 2', authorID: 'author2' },
        createdAt: Timestamp.now(),
        text: 'Hi',
        ifRead: true,
        ifReceived: true,
      },
    ],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now(),
    users: ['user1', 'user2'],
  };

  // Test cases
  describe('Message Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should retrieve all chats', async () => {
      // Mock the Firestore getDocs response
      const mockDocs = [
        {
          id: 'chat1',
          data: jest.fn().mockReturnValue(mockChatData),
        },
      ];
      getDocs.mockResolvedValue({ forEach: (fn) => mockDocs.forEach(fn) });
  
      // Call the controller function
      await controller.getAllChats(req, res);
  
      // Verify response
      expect(getDocs).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockChatData]);
    });
  
    it('should retrieve a chat by thread ID', async () => {
      req.params.threadID = 'thread1';
      
      const mockDocSnap = {
        docs: [
          {
            id: 'thread1',
            data: jest.fn().mockReturnValue(mockChatData),
          },
        ],
      };
  
      getDocs.mockResolvedValue(mockDocSnap);
  
      await controller.getChatByThreadId(req, res);
  
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockChatData);
    });
  
    it('should return 400 if user1 or user2 is missing', async () => {
        // Set up mock request data without user1 and user2
        req.query = { user1: null, user2: 'user2' };
        req.body = {
          authorID: 'author1',
          name: 'User 1',
          text: 'Hello!',
        };
    
        // Call the function
        await controller.createNewChat(req, res);
    
        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("both user IDs required");
      });
    
      it('should create a new chat thread and return the threadID', async () => {
        // Set up mock request data
        req.query = { user1: 'user1', user2: 'user2' };
        req.body = {
          authorID: 'author1',
          name: 'User 1',
          text: 'Hello!',
        };
    
        // Mock doc() and setDoc()
        const mockDocRef = { id: 'mockThreadID' };
        doc.mockReturnValue(mockDocRef);
        setDoc.mockResolvedValueOnce();
    
        // Call the function
        await controller.createNewChat(req, res);
    
        // Assertions
        expect(doc).toHaveBeenCalledTimes(2); // For threadID and messageID
        expect(setDoc).toHaveBeenCalledWith(mockDocRef, expect.any(Object));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith('mockThreadID');
      });
    
      it('should return 400 if there is an error during chat creation', async () => {
        // Set up mock request data
        req.query = { user1: 'user1', user2: 'user2' };
        req.body = {
          authorID: 'author1',
          name: 'User 1',
          text: 'Hello!',
        };
    
        // Mock an error in setDoc
        setDoc.mockRejectedValueOnce(new Error('Firestore error'));
    
        // Call the function
        await controller.createNewChat(req, res);
    
        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Error creating new chat: Firestore error');
      });
  
    it('should update read status', async () => {
      req.params.threadID = 'thread1';
  
      const mockChatSnapshot = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue(mockChatData),
      };
  
      getDoc.mockResolvedValueOnce(mockChatSnapshot);
      updateDoc.mockResolvedValueOnce();
  
      await controller.updateReadStatus(req, res);
  
      expect(getDoc).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('updated ifRead status');
    });
  });
  