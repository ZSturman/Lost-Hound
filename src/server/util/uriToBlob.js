import fs from 'fs'

// Convert URI to Blob
export const uriToBlob = async (fileUri) => {
    const fileInfo = await fs.getInfoAsync(fileUri);
    console.log("File info:", fileInfo);

    // Read the file's binary data
    const fileData = await fs.readAsStringAsync(fileUri, {
      encoding: fs.EncodingType.Base64,
    });

    // Create a Blob from the Base64 string
    const byteCharacters = atob(fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });  // Adjust MIME type as needed
  };