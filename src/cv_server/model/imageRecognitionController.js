import { FIREBASE_DB, FIREBASE_APP } from "../config/firebase.js";
import { initializeTF, extractFeatures,cosineSimilarity} from "../model/mobilenet.js";
import * as path from "path";
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
import loadData from './loadData.js';

const db = FIREBASE_DB;
const lostPostsRef = collection(db, "lost_pets");
const spottedPostsRef = collection(db, "spotted_pets");

console.log("Image Recognition Controller loaded.");

// TODO: need to check for new spotted image, if it hasn't already been compared with the lost pet

const getSpottedImagesFromDB = async (species) => {
	console.log(species)
	const data = await loadData(species);
	return data;
}


// Function to retrieve lost pet image from received post id
const getLostPetImage = async (id) => {
  try {
		// Find the post with the given id in the posts array
		let q = query(lostPostsRef, where("__name__", "==", id));

		const post = await getDocs(q);
		
		const postData = post.docs[0].data();

		const uri = postData.photo[0];      // Get 1st image for feature matching
		const species = postData.species

		console.log(uri)

		return {"uri": uri, "species": species}
  }
  catch(error){
		console.error("Error getting documents: " + error.message)
		return res.status(400).json("Error getting documents: " + error.message)
  }
};

// Function to perform feature extraction and compare the lost pet with spotted pets
const findMatches = async (photoUri, species) => {
  const topMatches = [];
  if (photoUri) {
	const lostPetFeatures = await extractFeatures(photoUri, true); // Extract features from the lost pet
	const spottedImages = await getSpottedImagesFromDB(species); // Load spotted pet images

	console.log("Images: " + spottedImages);

	const spottedFeatures = await Promise.all(
	  spottedImages.map(async (image) => await extractFeatures(image.uri, true))
	);

	const similarityScores = await Promise.all(
	  spottedImages.map(async (image, index) => {
		const similarity = cosineSimilarity(lostPetFeatures, spottedFeatures[index]);
		const breed = image.breed;
		const species = image.species
		return {
		  postId: image.postId,
		  similarity,
			species
			};
		})
	);

    similarityScores.sort((a, b) => b.similarity - a.similarity);
    topMatches.push(...similarityScores.slice(0, 10)); // Get the top 10 matches
  }
  return topMatches;
};

// This simulates calling the Image Recognition controller logic
const runImageRecognition = async (id) => {

  const {uri, species} = await getLostPetImage(id);

	console.log(uri, species)
  
  console.log('Initialising TensorFlow and finding matches');
  await initializeTF();

  const startTime = Date.now();
  const topMatches = await findMatches(uri, species);
  const endTime = Date.now();

  const timeTaken = (endTime - startTime) / 1000;
  console.log(`Model processed in ${timeTaken.toFixed(2)} seconds`);

  console.log(topMatches);

  return topMatches; // Return the top 10 matches
};

export default { runImageRecognition, getSpottedImagesFromDB, findMatches};
