import {
    getLostPosts,
    getUserLostPosts,
    getLostPostByID,
    getSpottedPosts,
    getUserSpottedPosts,
    getSpottedPostByID,
} from "./../controllers/postController";
import { getDocs, query, where } from "firebase/firestore";

// Mock Firebase Firestore functions
jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
}));

describe("Post Controller Test", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Get Lost Posts", () => {
        it("should return all lost posts", async () => {
            const mockData = [
                {
                    id: "1",
                    data: () => ({
                        lastSeenDatetime: { toDate: () => new Date() },
                        field: "test1",
                    }),
                },
                {
                    id: "2",
                    data: () => ({
                        lastSeenDatetime: { toDate: () => new Date() },
                        field: "test2",
                    }),
                },
            ];
            getDocs.mockResolvedValueOnce(mockData);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getLostPosts(req, res);

            expect(getDocs).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });

        it("should handle errors in getting lost posts", async () => {
            const errorSpy = jest.spyOn(global.console, "error");
            getDocs.mockRejectedValueOnce(new Error("Firebase error"));

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getLostPosts(req, res);

            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy).toHaveBeenCalledWith(
                "Error getting documents: Firebase error"
            );
            expect(res.status).not.toHaveBeenCalledWith(200);
        });
    });

    describe("Get User Lost Posts Function", () => {
        it("should return user-specific lost posts", async () => {
            const req = { params: { id: 'user123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            
            // Mock where and query calls
            where.mockReturnValue('mockedWhere');
            query.mockReturnValue('mockedQuery');

            // Mock getDocs to return some fake documents
            const mockDocs = [
                {
                    id: 'post1',
                    data: () => ({
                        lastSeenDatetime: {
                            toDate: () => new Date('2024-01-01T10:00:00Z'),
                        },
                    }),
                },
            ];
            getDocs.mockResolvedValue({
                forEach: (callback) => mockDocs.forEach((doc) => callback(doc)),
            });

            // Call the function
            await getUserLostPosts(req, res);

            // Expectations
            // expect(query).toHaveBeenCalledWith(
            //     expect.any(Object),
            //     where('authorID', '==', 'user123')
            // );
            expect(getDocs).toHaveBeenCalledWith('mockedQuery');
            expect(res.status).toHaveBeenCalledWith(200);

            // Needs fixing
            // expect(res.json).toHaveBeenCalledWith([
            //     {
            //         lastSeenDatetime: expect.any(Object),
            //         postID: 'post1',
            //         dateLastSeenString: '1/1/2024',
            //         timeLastSeenString: '10:00:00 AM',
            //     },
            // ]);
        });

        it("should handle errors in getting user lost posts", async () => {
            const errorSpy = jest.spyOn(global.console, "error");
            getDocs.mockRejectedValueOnce(new Error("Firebase error"));

            const req = { params: { id: "user123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getUserLostPosts(req, res);

            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy).toHaveBeenCalledWith(
                "Error getting documents: Firebase error"
            );
            expect(res.status).not.toHaveBeenCalledWith(200);
        });
    });

    describe("Get Lost Post By ID Function", () => {
        it("should return lost post by id", async () => {
            const mockData = [
                {
                    id: "1",
                    data: () => ({
                        lastSeenDatetime: { toDate: () => new Date() },
                        field: "test1",
                    }),
                },
            ];
            getDocs.mockResolvedValueOnce({ docs: mockData });

            const req = { params: { postid: "123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getLostPostByID(req, res);

            // expect(query).toHaveBeenCalledWith(
            //     expect.any(Object),
            //     where("__name__", "==", "123")
            // );
            expect(res.status).toHaveBeenCalledWith(200);
            // expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it("should handle errors in getting post by id", async () => {
            const errorSpy = jest.spyOn(global.console, "error");
            getDocs.mockRejectedValueOnce(new Error("Firebase error"));

            const req = { params: { postid: "123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getLostPostByID(req, res);

            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy).toHaveBeenCalledWith(
                "Error getting documents: Firebase error"
            );
            expect(res.status).not.toHaveBeenCalledWith(200);
        });
    });

    describe("Get Spotted Posts Function", () => {
        it("should return all spotted posts", async () => {
            const mockData = [
                {
                    id: "1",
                    data: () => ({
                        lastSeenDatetime: { toDate: () => new Date() },
                        field: "test1",
                    }),
                },
            ];
            getDocs.mockResolvedValueOnce(mockData);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getSpottedPosts(req, res);

            expect(getDocs).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });

        it("should handle errors in getting spotted posts", async () => {
            const errorSpy = jest.spyOn(global.console, "error");
            getDocs.mockRejectedValueOnce(new Error("Firebase error"));

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getSpottedPosts(req, res);

            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy).toHaveBeenCalledWith("Error getting documents: Firebase error");
            expect(res.status).not.toHaveBeenCalledWith(200);
        });
    });

    describe("Get User Spotted Posts Function", () => {
        it("should return user-specific spotted posts", async () => {
            const mockData = [
                {
                    id: "1",
                    data: () => ({
                        lastSeenDatetime: { toDate: () => new Date() },
                        field: "test1",
                    }),
                },
            ];
            getDocs.mockResolvedValueOnce(mockData);
            const req = { params: { id: "user123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getUserSpottedPosts(req, res);

            // expect(query).toHaveBeenCalledWith(
            //     expect.any(Object),
            //     where("authorID", "==", "user123")
            // );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });

        it("should handle errors in getting user spotted posts", async () => {
            const errorSpy = jest.spyOn(global.console, "error");
            getDocs.mockRejectedValueOnce(new Error("Firebase error"));

            const req = { params: { id: "user123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getUserSpottedPosts(req, res);

            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy).toHaveBeenCalledWith("Error getting documents: Firebase error");
            expect(res.status).not.toHaveBeenCalledWith(200);
        });
    });

    describe("Get Spotted Post By ID Function", () => {
        it("should return spotted post by id", async () => {
            const mockData = [
                {
                    id: "1",
                    data: () => ({
                        lastSeenDatetime: { toDate: () => new Date() },
                        field: "test1",
                    }),
                },
            ];
            getDocs.mockResolvedValueOnce({ docs: mockData });

            const req = { params: { postid: "123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getSpottedPostByID(req, res);

            // expect(query).toHaveBeenCalledWith(
            //     expect.any(Object),
            //     where("__name__", "==", "123")
            // );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it("should handle errors in getting post by id", async () => {
            const errorSpy = jest.spyOn(global.console, "error");
            getDocs.mockRejectedValueOnce(new Error("Firebase error"));

            const req = { params: { postid: "123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getSpottedPostByID(req, res);

            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy).toHaveBeenCalledWith("Error getting documents: Firebase error");
            expect(res.status).not.toHaveBeenCalledWith(200);
        });
    });
});
