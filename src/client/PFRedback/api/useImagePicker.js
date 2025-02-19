import { useState } from "react";
import { Alert, Platform } from "react-native";
import * as ExpoImagePicker from "expo-image-picker";

/* Upload Images Condition (postType):
    -  postType
        - undefined (didnt select) / spotted: can upload photos taken last 24 hours only but see condition below
        - lost pet: no restriction
*/

export const useImagePicker = (postType) => {
  const [imageUris, setImageUris] = useState(null);

  /*
        Note: Only images taken with the camera app can be uploaded. 
        We cannot accommodate the following types of images:

            - Images that were taken with apps other than the iPhone camera app (e.g., Messenger)
            - Images from the internet
            - Images taken with the camera but with annotations
    */

  const pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: 2,
      quality: 1,
      exif: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const currentTime = new Date().getTime(); // Current timestamp in milliseconds

      let allImagesValid = true; // Track if all images are valid (within 24 hours)

      console.log("post type: ", postType);

      // Apply the 24-hour filter only for "Spotted Pet" posts
      if (postType === "Spotted Pet" || !postType) {
        const selectedImageUris = result.assets.filter((asset) => {
          const takenTime =
            asset.exif?.DateTimeOriginal ||
            asset.exif?.DateTimeDigitized ||
            asset.exif?.DateTime;

          if (!takenTime) {
            allImagesValid = false;
            return true;
          }

          const takenDateUTC = new Date(
            takenTime.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3")
          );

          const takenDateAEST = new Date(
            takenDateUTC.getTime() + 10 * 60 * 60 * 1000
          );
          const timeDifference = currentTime - takenDateAEST.getTime();

          if (timeDifference > 24 * 60 * 60 * 1000) {
            allImagesValid = false;
            console.log("At least one image is older than 24 hours");
          }

          return timeDifference <= 24 * 60 * 60 * 1000;
        });

        // Show alert if at least one image is invalid
        if (!allImagesValid) {
          Alert.alert(
            "Invalid Images",
            "Make sure your images were taken within the last 24 hours.",
            [{ text: "OK" }]
          );
        } else {
          setImageUris(selectedImageUris);
        }
      } else {
        // If postType is not "Spotted Pet", just return selected images
        // const selectedImageUris = result.assets.map((asset) => asset.uri);
        const selectedImageUris = result.assets;
        setImageUris(selectedImageUris);
      }
    }
  };

  return [imageUris, setImageUris, pickImage];
};
