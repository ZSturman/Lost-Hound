import React from "react";
import { Alert } from "react-native";

// Define the endpoint for starting the image recognition
const recognitionEndpoint = "/cv/start";

const startImageRecog = async (uuid) => {
  try {
    
    const CV_HOST_URL = process.env.CV_HOST_URL; 
    const url = `${CV_HOST_URL}${recognitionEndpoint}/${uuid}`;
    console.log(`Sending request to: ${url}`);

    const response = await fetch(url, { method: "POST" });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error starting image recognition: ", error);
    Alert.alert("Error", "There was a problem starting the image recognition.");
  }
};

export { startImageRecog };
