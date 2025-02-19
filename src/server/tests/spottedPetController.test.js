import { submitForm } from "../controllers/spottedPetController.js";
import {getCoordinateFromLocation} from '../util/locationUtil.js';
import { collection, doc, setDoc, getDoc, Timestamp, GeoPoint } from "firebase/firestore";
import * as firebase_auth from "firebase/auth"; 


// Mock Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(() => ({
        id: 'mockDocId' 
    })),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    Timestamp: {
        now: jest.fn(),
        fromDate: jest.fn(),
    },
    GeoPoint: jest.fn().mockImplementation((lat, lng) => ({ lat, lng }))
}))

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
    }
})

jest.mock('../util/locationUtil.js', () => ({
    getCoordinateFromLocation: jest.fn().mockResolvedValue({
        lat: -37.8105,
        lng: 144.980331,
        state: 'VIC'
    })
}))

describe("Spotted Pet Controller Test", () => {
    describe("Submit Form", () => {
        const data = {
            email: "test",
            uid: "123",
            emailVerified: true,
        }
    

        afterEach(() => {
            jest.clearAllMocks()
        })

        it("should return 200, and have added form to firestore", async() => {
            getCoordinateFromLocation.mockResolvedValue({ lat: -37.833401, lng: 144.980331, state: 'VIC' })

                const mockUserData = {
                    email: "testuser@example.com",
                    name: "Test User",
                    state: "VIC",
                }

                doc.mockReturnValueOnce({})
                getDoc.mockResolvedValueOnce({
                    exists: () => true,
                    data: () => mockUserData,
                })

                Timestamp.fromDate.mockReturnValue('mockedTimestamp')
                GeoPoint.mockImplementation((lat, lng) => ({ lat, lng }))

                const req = {
                    body: {
                        species: 'Dog',
                        lastSeenDate: '2024-09-18T15:13:13.737Z',
                        lastSeenTime: '2024-09-18T15:13:13.737Z',
                        lastSeenLocation: 'Test Location',
                        primaryColour: 'Brown',
                        secondaryColour: '',
                        size: 'Medium',
                        additionalDetail: 'Ran towards Docklands Area',
                        photo: [],
                        breed: "Golden Retriever",
                        postType: 'Spotted Pet',
                        state: ""
                    },
                }

                const res = {
                    status: jest.fn().mockReturnThis(),
                    send: jest.fn(),
                }

                await submitForm(req, res)
                expect(getCoordinateFromLocation).toHaveBeenCalledWith('Test Location')
                expect(getDoc).toHaveBeenCalled()
                expect(getDoc).toHaveBeenCalledTimes(1)
                expect(setDoc).toHaveBeenCalled()
                expect(setDoc).toHaveBeenCalledTimes(1)
                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.send).toHaveBeenCalledWith({"message": "Form sucessfully updated!", "ok": true, "post_id": "mockDocId"})
        })

        it("should throw 400 error if user not logged in", async() => {
            firebase_auth.getAuth().currentUser = null

            const req = {
                body: {
                    species: 'Dog',
                    lastSeenDate: '2024-09-18T15:13:13.737Z',
                    lastSeenTime: '2024-09-18T15:13:13.737Z',
                    lastSeenLocation: 'Test Location',
                    primaryColour: 'Brown',
                    secondaryColour: '',
                    size: 'Medium',
                    additionalDetail: 'Ran towards Docklands Area',
                    photo: [],
                    breed: "Golden Retriever",
                    postType: 'Spotted Pet',
                    state: ""
                },
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            }

            await submitForm(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({"message": "User not logged in", "ok": false})
        })

        it("should throw 400 error if unable to retrieve user details from firestore", async() => {
            firebase_auth.getAuth().currentUser = data
            getCoordinateFromLocation.mockResolvedValue({ lat: -37.833401, lng: 144.980331, state: 'VIC' })

            doc.mockReturnValueOnce({})
            getDoc.mockResolvedValueOnce({
                exists: () => false,
            })

            const req = {
                body: {
                    species: 'Dog',
                    lastSeenDate: '2024-09-18T15:13:13.737Z',
                    lastSeenTime: '2024-09-18T15:13:13.737Z',
                    lastSeenLocation: 'Test Location',
                    primaryColour: 'Brown',
                    secondaryColour: '',
                    size: 'Medium',
                    additionalDetail: 'Ran towards Docklands Area',
                    photo: [],
                    breed: "Golden Retriever",
                    postType: 'Spotted Pet',
                    state: ""
                },
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            }

            await submitForm(req, res)
            expect(getDoc).toHaveBeenCalled()
            expect(getDoc).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({"message": "User details retrieval failed", "ok": false})
        })

        it("should throw 400 error if required fields are empty", async() => {
            firebase_auth.getAuth().currentUser = data
            getCoordinateFromLocation.mockResolvedValue({ lat: -37.833401, lng: 144.980331, state: 'VIC' })

            const mockUserData = {
                email: "testuser@example.com",
                name: "Test User",
                state: "VIC",
            }
            doc.mockReturnValueOnce({})
            getDoc.mockResolvedValueOnce({
                exists: () => true,
                data: () => mockUserData,
            })

            Timestamp.fromDate.mockReturnValue('mockedTimestamp')
            GeoPoint.mockImplementation((lat, lng) => ({ lat, lng }))

            const req = {
                body: {
                    species: 'Dog',
                    lastSeenDate: '2024-09-18T15:13:13.737Z',
                    lastSeenTime: '',
                    lastSeenLocation: 'Test Location',
                    primaryColour: 'Brown',
                    secondaryColour: '',
                    size: 'Medium',
                    additionalDetail: 'Ran towards Docklands Area',
                    photo: [],
                    breed: "Golden Retriever",
                    postType: 'Spotted Pet',
                    state: ""
                },
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            }

            await submitForm(req, res)

            expect(getDoc).toHaveBeenCalled()
            expect(getDoc).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({"message": "Empty fields", "ok": false})
        })

        it("should throw 400 error if unable to get coordinates from address", async() => {
            getCoordinateFromLocation.mockRejectedValue(new Error('Unable to get coordinates for the location'))

            const mockUserData = {
                email: "testuser@example.com",
                name: "Test User",
                state: "VIC",
            }

            doc.mockReturnValueOnce({})
            getDoc.mockResolvedValueOnce({
                exists: () => true,
                data: () => mockUserData,
            })

            Timestamp.fromDate.mockReturnValue('mockedTimestamp')
            GeoPoint.mockImplementation((lat, lng) => ({ lat, lng }))

            const req = {
                body: {
                    species: 'Dog',
                    lastSeenDate: '2024-09-18T15:13:13.737Z',
                    lastSeenTime: '2024-09-18T15:13:13.737Z',
                    lastSeenLocation: 'Invalid Location',
                    primaryColour: 'Brown',
                    secondaryColour: '',
                    size: 'Medium',
                    additionalDetail: 'Ran towards Docklands Area',
                    photo: [],
                    breed: "Golden Retriever",
                    postType: 'Spotted Pet',
                    state: ""
                },
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            }

            await submitForm(req, res)
            expect(getDoc).toHaveBeenCalled()
            expect(getDoc).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({"message": "Unable to get coordinates for the location", "ok": false})
        })

        it("should handle undefined additional detail field", async() => {
            getCoordinateFromLocation.mockResolvedValue({ lat: -37.833401, lng: 144.980331, state: 'VIC' })

            const mockUserData = {
                email: "testuser@example.com",
                name: "Test User",
                state: "VIC",
            }

            doc.mockReturnValueOnce({})
            getDoc.mockResolvedValueOnce({
                exists: () => true,
                data: () => mockUserData,
            })

            Timestamp.fromDate.mockReturnValue('mockedTimestamp')
            GeoPoint.mockImplementation((lat, lng) => ({ lat, lng }))

            const req = {
                body: {
                    species: 'Dog',
                    lastSeenDate: '2024-09-18T15:13:13.737Z',
                    lastSeenTime: '2024-09-18T15:13:13.737Z',
                    lastSeenLocation: 'Test Location',
                    primaryColour: 'Brown',
                    secondaryColour: '',
                    size: 'Medium',
                    additionalDetail: undefined,
                    photo: [],
                    breed: "Golden Retriever",
                    postType: 'Spotted Pet',
                    state: ""
                },
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            }

            await submitForm(req, res)
            expect(getCoordinateFromLocation).toHaveBeenCalledWith('Test Location')
            expect(getDoc).toHaveBeenCalled()
            expect(getDoc).toHaveBeenCalledTimes(1)
            expect(setDoc).toHaveBeenCalled()
            expect(setDoc).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({"message": "Form sucessfully updated!", "ok": true, "post_id": "mockDocId"})

            const spottedPetPost = {
                additionalDetail: '',
            }
            
            setDoc.mockImplementationOnce((docRef, data) => {
                expect(data.additionalDetail).toBe('')
            })
        })
    })
})