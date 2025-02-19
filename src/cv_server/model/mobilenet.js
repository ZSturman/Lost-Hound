import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as tfn from '@tensorflow/tfjs-node';


import * as FileSystem from 'fs';
import util from 'util';
import * as path from 'path';
import { getStorage, ref, getStream, getBytes } from "firebase/storage";

// Create a reference with an initial file path and name
const storage = getStorage();


// Ensure TensorFlow is ready and set the backend
export const initializeTF = async () => {
    await tf.ready();  
    await tf.getBackend('rn-webgl'); 
    console.log('TensorFlow is ready with rn-webgl backend');
};

// Function to load the pre-trained MobileNet model and handle errors
let model = null;
let modelPromise = null;               // Keep track of the ongoing model loading process

export const loadMobileNetModel = async () => {
    if (model) {
        return model;                  // Return the already loaded model if available
    }

    if (modelPromise) {
        return modelPromise;           // If a model is already being loaded, return the same promise
    }

    try {

        // Load MobileNet V2 
        modelPromise = mobilenet.load({
            version: 2,  
            alpha: 1.0,               // Default width multiplier (adjustable for performance)
        });

        model = await modelPromise;   // Await the result and set the model

    } catch (error) {
        console.error('Error loading MobileNet model:', error);
    } finally {
        modelPromise = null;         // Reset the promise once the loading is complete
    }

    return model;                    // Return the loaded model
};




export const extractFeatures = async (imageUri, remote=false) => {
    try {
        const model = await loadMobileNetModel();       

        let imagePath;
        let imgB64;

        // Got promise {string} ----> need to get the string out
        if (remote == true){
            imagePath = await imageUri;               // Get the firebase/ remote URI to the image

            // Create a reference from an HTTPS URL
            const storageReference = ref(storage, imagePath);

            // Read the image as base64
            const imgBytes =  await getBytes(storageReference);
            const imgBytesBuffer = await Buffer.from(imgBytes);
            imgB64 = imgBytesBuffer.toString('base64');

        }
        else {
            imagePath = path.resolve(import.meta.dirname, imageUri);               // Get the local URI to the image
            // Read the image as base64
            imgB64 = FileSystem.readFileSync(imagePath).toString('base64');
        }

        // Convert base64 string (stored as text) ==> array buffer (binary data) ==> Uint8Array (for TensorFlow image processing, pixel values)

        const imgBuffer = await Buffer.from(imgB64, 'base64');

        const imageArray = await new Uint8Array(imgBuffer);   
       
        // Use tf.tidy() to clean up intermediate tensors, keeping only the returned "features" tensor
        const features = tf.tidy(() => {
            // Decode the images into a tensor (jpeg, png, gif, bmp)
            const imageTensor = tfn.node.decodeImage(imageArray);
            if (!imageTensor) {
                throw new Error("Failed to decode the image into a tensor.");
            }

            // Extract feature vector (`true` for skipping the classification layer)
            const features = model.infer(imageTensor, true);

            return features;                            // Return feature tensor, tf.tidy() will not dispose of this
        });

        return features;                                // Pass features back to the caller

    } catch (error) {
        console.error('Error extracting features:', error);
        return null;
    }
}; 

// Function to compute cosine similarity between two feature vectors
export const cosineSimilarity = (vectorA, vectorB) => {
    try {
        return tf.tidy(() => {
            const dotProduct = tf.sum(tf.mul(vectorA, vectorB));
            const normA = tf.sqrt(tf.sum(tf.pow(vectorA, 2)));
            const normB = tf.sqrt(tf.sum(tf.pow(vectorB, 2)));

            const similarity = dotProduct.div(normA.mul(normB));
            return similarity.dataSync();               // Return the similarity score as a number
        });
    } catch (error) {
        console.error('Error computing cosine similarity:', error);
        return null;
    }
}; 
 
