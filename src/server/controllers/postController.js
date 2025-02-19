import { FIREBASE_DB, FIREBASE_APP, FIREBASE_AUTH } from '../config/firebase.js'
import {posts, spotted} from "../fakedb.js"
import { Client } from '@googlemaps/google-maps-services-js';

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
    documentId
    
} from 'firebase/firestore';

const auth = FIREBASE_AUTH
const db = FIREBASE_DB
const lostPostsRef = collection(db, "lost_pets")
const spottedPostsRef = collection(db, "spotted_pets")

const client = new Client({})

const fieldsToCompare = [
    { field: 'lastSeenLocation', weight: 1.5 }, // weighted heavier to "penalise" post further away
    { field: 'species', weight: 1 },
    { field: 'primaryColour', weight: 1 },
    { field: 'secondaryColour', weight: 1 },
    { field: 'size', weight: 0.8 }, // weighted lower due to individual perceptual differences
    { field: 'state', weight: 1 }
]

/**
 * Get all lost posts and print all posts in this case 
 */
const getLostPosts = async (req, res) => {
    try {

        const allPosts = []

        const posts = await getDocs(lostPostsRef)

        console.log("all lost")


        posts.forEach((doc) => {
            const post = doc.data()
            const time = doc.data().lastSeenDatetime.toDate().toLocaleTimeString()
            const date = doc.data().lastSeenDatetime.toDate().toLocaleDateString()
            post['postID'] = doc.id
            
            post['dateLastSeenString'] = date
            post['timeLastSeenString'] = time
            
            if (post.isActive) {
                allPosts.push(post)
            }
            
        })

        //return res.status(200).json(posts)
        return res.status(200).json(allPosts)
        
    } catch (error) {
        console.error("Error getting documents: " + error.message)
        return res.status(400).json("Error getting documents: " + error.message)
    }

}


/**
 * Get all user lost posts
 */
const getUserLostPosts = async (req, res) => {
    try {

        const allPosts = []

        console.log("user lost")

        // Get the id parameter from the request
        const rid = req.params.id;

        // Find the post with the given id in the posts array
        let q = query(lostPostsRef, where("authorID", "==", rid))

        // const post = posts.filter((d) => d.authorID == rid);
        // console.log(post)

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {

            const post = doc.data()

            const time = post.lastSeenDatetime.toDate().toLocaleTimeString()
            const date = post.lastSeenDatetime.toDate().toLocaleDateString()


            post['postID'] = doc.id

            post['dateLastSeenString'] = date
            post['timeLastSeenString'] = time

            allPosts.push(post)
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", post);
        });

        return res.status(200).json(allPosts)
    }
    catch(error){
        console.error("Error getting documents: " + error.message)
        return res.status(400).json("Error getting documents: " + error.message)
    }
}

/**
 * Get lost post by id 
 */
const getLostPostByID = async (req,res) => {

    try{

        console.log("id lost")

        // Get the id parameter from the request
        const rid = req.params.postid

        console.log(rid)

        // Find the post with the given id in the posts array
        let q = query(lostPostsRef, where("__name__", "==", rid))

        const post = await getDocs(q)

        const postData = post.docs[0].data()

        getTimeDifferenceString(postData)
        
        return res.status(200).json(postData)

    }
    catch(error){
        console.error("Error getting documents: " + error.message)
        return res.status(400).json("Error getting documents: " + error.message)
    }
}

/**
 * Get all spotted posts and print all posts in this case 
 */
const getSpottedPosts = async (req, res) => {
    try {

        const allPosts = []

        const posts = await getDocs(spottedPostsRef)

        posts.forEach((doc) => {
            const post = doc.data()
            const time = post.lastSeenDatetime.toDate().toLocaleTimeString()
            const date = post.lastSeenDatetime.toDate().toLocaleDateString()
            post['postID'] = doc.id
            
            post['dateLastSeenString'] = date
            post['timeLastSeenString'] = time
            
            if (post.isActive) {
                allPosts.push(post)
            }
        })

        //return res.status(200).json(spotted)
        return res.status(200).json(allPosts)

    } catch (error) {
        console.error("Error getting documents: " + error.message)
        return res.status(400).json("Error getting documents: " + error.message)
    }

}

/**
 * Get all user spotted posts
 */
const getUserSpottedPosts = async (req, res) => {
    try {

        const allPosts = []

        // Get the id parameter from the request
        const rid = req.params.id;

        // Find the post with the given id in the posts array
        let q = query(spottedPostsRef, where("authorID", "==", rid))

        // const post = posts.filter((d) => d.authorID == rid);
        // console.log(post)

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const post = doc.data()
            const time = post.lastSeenDatetime.toDate().toLocaleTimeString()
            const date = post.lastSeenDatetime.toDate().toLocaleDateString()
            post['postID'] = doc.id

            post['dateLastSeenString'] = date
            post['timeLastSeenString'] = time

            allPosts.push(post)
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", post);
        });

        return res.status(200).json(allPosts)
    }
    catch(error){
        console.error("Error getting documents: " + error.message)
        return res.status(400).json("Error getting documents: " + error.message)
    }
}

/**
 * Get spotted post by id 
 */
const getSpottedPostByID = async (req,res) => {

    try{

        console.log("id lost")

        // Get the id parameter from the request
        const rid = req.params.postid

        console.log(rid)

        // Find the post with the given id in the posts array
        let q = query(spottedPostsRef, where("__name__", "==", rid))

        const post = await getDocs(q)

        const postData = post.docs[0].data()
        const time = postData.lastSeenDatetime.toDate().toLocaleTimeString()
        const date = postData.lastSeenDatetime.toDate().toLocaleDateString()
        postData['postID'] = doc.id

        postData['dateLastSeenString'] = date
        postData['timeLastSeenString'] = time

        getTimeDifferenceString(postData)
        
        return res.status(200).json(postData)

    }
    catch(error){
        console.error("Error getting documents: " + error.message)
        return res.status(400).json("Error getting documents: " + error.message)
    }
}


/**
 * Calculates the time difference between now and the datetime pet was last spotted
 */
const getTimeDifferenceString = (post) => {
    const timeNow = new Date()
    const lastSeenTimestamp = post.lastSeenDatetime
    const lastSeenMs = lastSeenTimestamp.seconds * 1000 + Math.floor(lastSeenTimestamp.nanoseconds / 1000000)

    const timeDifferenceMs = timeNow - lastSeenMs

    const timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60))
    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60)
    const timeDifferenceDays = Math.floor(timeDifferenceHours / 24)
    const timeDifferenceMonths = Math.floor(timeDifferenceDays / 30)

    if (timeDifferenceMinutes < 60) {
        post['timeDifference'] = ` ${timeDifferenceMinutes} mins ago`
        console.log(post.timeDifference)
    } else if (timeDifferenceHours < 24) {
        const hours = Math.floor(timeDifferenceMinutes / 60)
        const minutes = timeDifferenceMinutes % 60
        post['timeDifference'] = ` ${hours} hr ${minutes} mins ago`
        console.log(post.timeDifference)
    } else if (timeDifferenceDays < 31) {
        const lostDate = lastSeenTimestamp.toDate()

        const nowDateMidnight = new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate());
        const lostDateMidnight = new Date(lostDate.getFullYear(), lostDate.getMonth(), lostDate.getDate());

        const timeDiff = nowDateMidnight.getTime() - lostDateMidnight.getTime();
        const dateDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24), 0);

        post['timeDifference'] = ` ${dateDiff} days ago`
        console.log(post.timeDifference)
    } else {
        post['timeDifference'] = ` ${timeDifferenceMonths} mths ago`
        console.log(post.timeDifference)
    }
}



/**
 * Retrieve subset of all posts that matches the filter(s) applied, and sorts it accordingly 
 */
const getFilteredPosts = async(req, res) => {
    const { selectedOptions, isLostFeed, location } = req.body
    
    const { colourOptions, sortOption, range } = selectedOptions

    const filters = constructQuery(selectedOptions)

    var filteredPosts = new Set()
    let feedRefs = isLostFeed === 'true' ? lostPostsRef : spottedPostsRef

    console.log("is from lost feed? ", isLostFeed)
    
    try {
        // filtering
        if (filters.length > 0 && colourOptions && colourOptions.length > 0) {

            let feedRefs = isLostFeed === 'true' ? lostPostsRef : spottedPostsRef

            let primaryColourQuery = query(feedRefs, ...filters, where('primaryColour', 'in', colourOptions))
            let secondaryColourQuery = query(feedRefs, ...filters, where('secondaryColour', 'in', colourOptions))
    
            const snapshotPrimary = await getDocs(primaryColourQuery)
            await processSnapshot(snapshotPrimary, filteredPosts, location, range)
    
            // assumption that primary_colour only takes in 1 colour
            if (colourOptions.length > 1) {
                const snapshotSecondary =  await getDocs(secondaryColourQuery)
                await processSnapshot(snapshotSecondary, filteredPosts, location, range)
            }
    
        } else if (filters.length > 0) {
            // no colour filters applied
            const snapshot = await getDocs(query(feedRefs, ...filters))
            await processSnapshot(snapshot, filteredPosts, location, range)

        } else {
            // no filters, get all posts
            console.log("No filters applied")
            const snapshot = await getDocs(feedRefs)
            await processSnapshot(snapshot, filteredPosts, location, range)
        }

        filteredPosts = convertBackToJson(filteredPosts)


        // sorting 
        if (sortOption === 'distDesc') {
            filteredPosts.sort((a, b) => { 
                return b.distanceMetres - a.distanceMetres 
            })
        } else if (sortOption === 'bestMatched' && isLostFeed === 'false') {
            const userLatestPost = await getUserLatestPost()
            console.log("user latest post: ", userLatestPost)
            if (userLatestPost) {
                console.log("User has a lost pet post")
                await calculateMatchScores(filteredPosts, userLatestPost, range)
            } else {
                // user does not have a lost pet post, sort by default, which is by ascending distance
                filteredPosts.sort((a, b) => { 
                    return a.distanceMetres - b.distanceMetres 
                })
            }
        } else { 
            // if chose distAsc, or if chose best matched option from the lost feed
            filteredPosts.sort((a, b) => { 
                return a.distanceMetres - b.distanceMetres 
            })
        }
        
        console.log("filtered post....: ", filteredPosts)

        res.status(200).json(filteredPosts)
    } catch (error) {
        res.status(400).send("Error fetching post")
        console.error(error)
    }
}

/**
 * Processes the snapshot of the query and filters out posts that are inactive or is outside of the geographic range 
 * @param {*} snapshot 
 * @param {*} filteredPosts
 * @param {*} location -- location of the user
 * @param {*} range -- geographic range in km
 */
const processSnapshot = async (snapshot, filteredPosts, location, range) => {
    
    for (const doc of snapshot.docs) {
        const post = sortPostInformation(doc.data())
        const isActive = post.isActive

        if (isActive) {
            convertTime(post)

            const distanceMetres = await getDistance(location, post['lastSeenLocation'])

            if (distanceMetres && distanceMetres <= range*1000) {
                post['distanceMetres'] = distanceMetres
                const key = JSON.stringify(post)
                filteredPosts.add(key, post)
            }
        }
    }
}


/**
 * Convert seconds and nanoseconds to actual date and time to be displayed on frontend 
 */
const convertTime = (post) => {
    const time = post.lastSeenDatetime.toDate().toLocaleTimeString()
    const date = post.lastSeenDatetime.toDate().toLocaleDateString()
    post['dateLastSeenString'] = date
    post['timeLastSeenString'] = time
}

/**
 * Constructs query based on the options selected
 * @param {*} selectedOptions -- filter options selected by user
 * @returns query for firestore
 */
const constructQuery = (selectedOptions) => {
    const { speciesOption, sizeOption, dates } = selectedOptions
    
    let filters = []

    var startDate = dates.startDate
    var endDate = dates.endDate

    if (speciesOption) {
        filters.push(where('species', '==', speciesOption))
    } 

    if (sizeOption) {
        filters.push(where('size', '==', sizeOption))
    }

    if (startDate && endDate) {
        startDate = new Date(startDate)
        endDate = new Date(endDate)

        endDate.setHours(23, 59, 59, 999)

        filters.push(where('timeCreated', '>=', startDate))
        filters.push(where('timeCreated', '<=', endDate))
    }

    return filters
}


/**
 * Uses google distance matrix API to retrieve the distance between lost pets last seen location
 * and locations where pets were last spotted at 
 * 
 * @param {*} locationUser -- users' location
 * @param {*} destinationPost -- posts' last seen location of pet 
 * @returns the disance in metres
 */
const getDistance = async (locationUser, destinationPost) => {
    const origin = locationUser
    const destination = destinationPost
    var distanceMetres = null
    const request = {
        params: {
            origins: [origin] ,
            destinations: [destination],
            unitSystem: 'metric',
            key: process.env.GOOGLE_API_KEY
        }
        
    }

    try {
        const response = await client.distancematrix(request)
        const responseRows = response.data.rows

        responseRows.forEach((row) => {
            row.elements.forEach((element) => {
                if (element.status === 'OK') {
                    distanceMetres = element.distance.value
                } else {
                    console.log('No result, locations too far apart')
                }
            })
        })
        return distanceMetres
    } catch (error) {
        console.error(error)
        return null
    }
}


/**
 * Map colours to colours on database
 * @param {*} colourOptions -- selected from form
 * @returns 
 */
const mapColours = (colourOptions) => {
    const colourMap = {
        'White / Cream': 'white',
        'Black': 'black',
        'Brown': 'brown',
        'Golden / Yellow': 'golden',
        'Red': 'red',
        'Orange': 'orange',
        'Grey / Blue': 'grey'
    };

    return colourOptions.map(colour => colourMap[colour] || null).filter(colour => colour !== null)
}

/**
 * Sort the names of each column in the post for matching, else duplicates will be added to the set
 * @param {*} post
 * @returns 
 */
const sortPostInformation = (post) => {
    const sortedKeys = Object.keys(post).sort()
    const sortedPost = {}
    sortedKeys.forEach(key => {
        sortedPost[key] = post[key]
    })
    return sortedPost
}

const convertBackToJson = (filteredPostsSet) => {
    return Array.from(filteredPostsSet).map(postString => {
        try {
            return JSON.parse(postString)
        } catch (error) {
            console.error("Error parsing JSON:", error)
            return null
        }
    })
}


/**
 * Get latest lost pet post of current user - user has to be logged in 
 */
const getUserLatestPost = async () => {
    try {
        const user = auth.currentUser        

        if (user !== null) {
            const userID = user.uid
            console.log("user id: ", userID)

            const q = query(lostPostsRef, where("authorID", "==", userID), orderBy("timeCreated", "desc"), limit(1))
            const snapshot = await getDocs(q)

            if (!snapshot.empty) {
                console.log("latest post by user: ", snapshot.docs[0].data())
                return snapshot.docs[0].data()
            } else {
                return null
            }
        } else {
            console.log("user not logged in")
            return null
        }
    } catch (error) {
        console.error("Error getting user post: ", error)
        return null
    }
}


/**
 * Count number of matching fields with post and users' latest post, with each field being weighed differently. It then
 * sorts the filtered posts according to the score (in descending order)
 * 
 * @param {*} filteredPosts 
 * @param {*} latestPost 
 * @param {*} range 
 */
const calculateMatchScores = async (filteredPosts, latestPost, range) => {
    let postScores = {}

    for (const post of filteredPosts) {
        let score = 0

        for (const { field, weight } of fieldsToCompare) {
            if (field === "lastSeenLocation") {
                const distance = await getDistance(latestPost[field], post[field])
                const distanceScore = weight * Math.max(0, 1 - (distance / (range * 1000)))
                score += distanceScore
            } else if (post[field].toLowerCase() === latestPost[field].toLowerCase() && (latestPost[field] !== "" || post[field] !== "")) {
                score += weight
            }
        }

        const key = post.postID;
        postScores[key] = score;
    }

    console.log("scores for each post: ", postScores)

    filteredPosts.sort((a, b) => {
        return postScores[b.postID] - postScores[a.postID]
    })
}

const editPost = async (req, res) => {
    try {

        // Get the id parameter from the request
        const rid = req.params.postid;

        // Get the type of post to get the corresponding collection
        const type = req.params.type;

        console.log("id: ", rid);
        console.log("type: ", type);

        let ref;
        let collection;

        // Get collection reference
        if (type == "lost"){
            ref = lostPostsRef;
            collection = "lost_pets";
        }
        if (type == "spotted"){
            ref = spottedPostsRef;
            collection = "spotted_pets";
        }

        // Find the post with the given id in the posts array
        let q = query(ref, where("__name__", "==", rid));

        const post = await getDocs(q);

        if (post.docs[0] == null) {
            return res.status(404).send("Post does not exist.");
        }

        const postData = post.docs[0].data();

        // Get document ref
        const postRef = doc(db, collection, rid);
        

        const updatePostData = req.body;

        console.log(req.body)


        Object.keys(updatePostData).forEach(
            (key) => updatePostData[key] == "" && delete updatePostData[key]
        )

        setDoc(postRef, updatePostData, {merge: true})

        const updatedPostSnap = await getDocs(q);
        const updatedPostData = updatedPostSnap.docs[0].data();

        return res.status(200).json(updatedPostData);
    }
    catch (error) {
        console.error("Error getting user post: ", error)
        return null
    }
}

const deletePost = async (req, res) => {
    try {

        console.log("delete post");
        
        // Get the id parameter from the request
        const rid = req.params.postid;

        // Get the type of post to get the corresponding collection
        const type = req.params.type;

        console.log("id: ", rid);
        console.log("type: ", type);

        let collection;

        // Get collection reference
        if (type == "lost"){
            collection = "lost_pets";
        }
        if (type == "spotted"){
            collection = "spotted_pets";
        }

        // Get document ref
        const postRef = doc(db, collection, rid);

        await deleteDoc(postRef);

        console.log("post deleted");

        return res.status(204).send("post deleted");

    }
    catch (error) {
        console.error("Error deleting post: ", error);
        return res.status(400).json("Error getting documents: " + error.message)
    }
}

const updatePostStatus = async (req, res) => {
    try{
        // Get the id parameter from the request
        const rid = req.params.postid;

        // Get the type of post to get the corresponding collection
        const type = req.params.type;

        // Setting reference to collection in firebase
        let ref;
        let collection;

        if (type == "lost"){
            ref = lostPostsRef;
            collection = "lost_pets";
        }
        if (type == "spotted"){
            ref = spottedPostsRef;
            collection = "spotted_pets";
        }

        // Find the post with the given id in the collection ref
        let q = query(ref, where("__name__", "==", rid));

        const post = await getDocs(q);

        // Check if post exists
        if (post.docs[0] == null) {
            return res.status(404).send("Post does not exist.");
        }

        // Get document ref
        const postRef = doc(db, collection, rid);

        // Just change status to found, no need to check for param

        const updated = await updateDoc(postRef, {status: "Found"});

        return res.status(200).send("Successfully updated post status");
    }
    catch(error){
        return res.status(400).send("Error getting documents: " + error.message)
    }
}


export { getLostPosts, getUserLostPosts, getSpottedPosts, getUserSpottedPosts, getLostPostByID, getSpottedPostByID, getFilteredPosts, editPost, deletePost, updatePostStatus };