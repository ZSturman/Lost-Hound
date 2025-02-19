import dotenv from 'dotenv'
import assert from 'assert'

dotenv.config()

const {
    HOST,
    HOST_URL,
    EXPO_FIREBASE_API_KEY,
    EXPO_FIREBASE_AUTH_DOMAIN,
    EXPO_FIREBASE_PROJECT_ID,
    EXPO_FIREBASE_STORAGE_BUCKET,
    EXPO_FIREBASE_MESSAGING_SENDER_ID,
    EXPO_FIREBASE_APP_ID,
    EXPO_FIREBASE_MEASUREMENT_ID
} = process.env

const PORT = process.env.PORT || 3001;
assert(PORT, 'Port is required');
assert(HOST, 'Host is required');

export default {
    port: PORT,
    host: HOST,
    hostUrl: HOST_URL,
    firebaseConfig: {
        apiKey: EXPO_FIREBASE_API_KEY,
        authDomain: EXPO_FIREBASE_AUTH_DOMAIN,
        projectId: EXPO_FIREBASE_PROJECT_ID,
        storageBucket: EXPO_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: EXPO_FIREBASE_MESSAGING_SENDER_ID,
        appId: EXPO_FIREBASE_APP_ID,
        measurementId: EXPO_FIREBASE_MEASUREMENT_ID
    },
}