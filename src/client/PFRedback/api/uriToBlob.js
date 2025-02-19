//IGNORE API. MAY OR NOT MAY NOT BE USED IN THE FUTURE
// Convert URI to Blob
export const uriToBlob = async (uri) => {
    const file = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    const byteCharacters = atob(file);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: 'image/jpeg' });
};