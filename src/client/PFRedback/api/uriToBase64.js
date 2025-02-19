//IGNORE FUNCTION. MAY OR NOT MAY NOT BE USED IN THE FUTURE
// Function for converting URI to base64
import * as FileSystem from 'expo-file-system';

export const uriToBase64 = async (uri) => {
    try {
        const base64String = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Return the base64 string with prefix depending on file type
        // TODO: Determine/limit file type on FE?
        return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
        console.error('Error converting URI to base64:', error);
        throw error;
    }
};
