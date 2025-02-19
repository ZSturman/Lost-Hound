import { FIREBASE_DB } from '../config/firebase.js'
import { getStorage, ref, getStream, getBytes } from "firebase/storage";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    setDoc,
    query,
    where,
    orderBy,
    limit,
    documentId,
    
} from 'firebase/firestore';

const db = FIREBASE_DB;
const spottedPostsRef = collection(db, "spotted_pets");


const loadData = async (species) => {

    try {

        const postIdUris = []

        // Write a loop to loop for id in ids or for i in range length of list of firestore

            let q = query(spottedPostsRef, where("photo", "!=", []), where("species", "==", species));
        
            const querySnapshot = await getDocs(q);


            querySnapshot.forEach((doc) => {
                const post = doc.data();
                
                // Check if status is "Found" and skip this document if it is
                if (post.status === "Found") {
                    return;  // Skip to the next iteration
                }

                const uri = post.photo[0];          // Get 1st image for feature matching
                const id = post.spottedPostId;
                const species = post.species;

                const obj = {"postId":id, "uri": uri, species};

                postIdUris.push(obj);
            })
            return postIdUris;
        //}

    }
    catch(error){
        console.error("Error getting documents: " + error.message);
    }
};

export default loadData