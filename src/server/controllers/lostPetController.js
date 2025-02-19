import { FIREBASE_AUTH, FIREBASE_DB } from "../config/firebase.js";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    Timestamp,
    GeoPoint,
} from "firebase/firestore";
import LostPet from "../models/lostPet.js";
import { getCoordinateFromLocation } from "../util/locationUtil.js";

const auth = FIREBASE_AUTH;
const db = FIREBASE_DB;
const lostPetsRef = collection(db, "lost_pets");

/**
 * Adds the lost pet form to firestore if the form is valid
 */
const submitForm = async (req, res) => {
    try {
        const form = req.body;
        const user = auth.currentUser;

        // checks if user is logged in
        if (!user) {
            throw new Error("User not logged in");
        }

        const currentUserDoc = doc(db, "users", user.uid);
        const currentUserSnap = await getDoc(currentUserDoc);

        if (!currentUserSnap.exists()) {
            throw new Error("User details retrieval failed");
        }

        const currentUser = currentUserSnap.data();

        // checks if required fields are filled
        if (
            form.species === "" ||
            form.lastSeenDate === "" ||
            form.lastSeenTime === "" ||
            form.lastSeenLocation === "" ||
            form.primaryColour === ""
        ) {
            throw new Error("Empty fields");
        }

        const lostPetDocRef = doc(lostPetsRef);
        const docID = lostPetDocRef.id;

        // converts date and time to timestamp data type
        const date = new Date(form.lastSeenDate).toISOString().split("T")[0];
        const time = new Date(form.lastSeenTime)
            .toISOString()
            .split("T")[1]
            .split("Z")[0];
        const lastSeenDatetimeString = `${date}T${time}Z`;
        const lastSeenDatetime = new Date(lastSeenDatetimeString);
        const lastSeenTimestamp = Timestamp.fromDate(lastSeenDatetime);

        // converts location address to geopoint data type
        const locationLatLngState = await getCoordinateFromLocation(
            form.lastSeenLocation
        );
        const { lat, lng, state } = locationLatLngState;
        const locationCoordinates = new GeoPoint(lat, lng);

        // create form
        const lostPetPost = new LostPet(
            currentUser.name,
            docID,
            Timestamp.now(),
            Timestamp.now(),
            true,
            user.uid,
            form.petName,
            lastSeenTimestamp,
            locationCoordinates,
            "Lost",
            form.species,
            form.age,
            form.breed,
            form.primaryColour,
            form.secondaryColour,
            form.size,
            state,
            form.additionalDetail || "",
            []
        );

        await setDoc(lostPetDocRef, { ...lostPetPost });

        res.status(200).send({
            ok: true,
            message: "Form sucessfully added!",
            post_id: docID,
        });
    } catch (error) {
        console.error("Error handling form submission:", error.message);
        res.status(400).send({
            ok: false,
            message: error.message,
        });
    }
};

export { submitForm };
