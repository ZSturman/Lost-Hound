/**
 * Converts given address into its coordinates, and also returns the state of the given address
 * @param {String} locationString -- address
 * @returns latitude, longitude, state
 */
export const getCoordinateFromLocation = async (locationString) => { 
    try {
        console.log("location" , locationString)
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationString)}&key=${process.env.GOOGLE_API_KEY}`)
        
        const data = await response.json()
        console.log(data)
        
        if (data.status === 'OK') {
            const { lat, lng } = data.results[0].geometry.location;
            const addressComponents = data.results[0].address_components;
            
            // Extract state
            let state = null;
            for (const component of addressComponents) {
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                    break;
                }
            }
            return {lat, lng, state}
        } else {
            throw new Error('Unable to get coordinates for the location')
        }
    } catch (error) {
        console.error("Error: ", error.message)
        throw error
    }
}

/**
 * Converts given coordinates into its address
 * @param {} latlng 
 * @returns address
 */
export const getAddressFromCoordinates = async (latlng) => {
    const {lat, lng} = latlng

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`)
        const data = await response.json()
    
        if (data.status === "OK") {
            const address = data.results[0].formatted_address
            console.log("ADDRESS FROM COORDINATE: ", address)
            return address || 'Address not found'
        } else {
            throw new Error('Unable to get location for the coordinates')
        }
    } catch (error) {
        console.error("Error: ", error.message)
        throw error
    }
}

export default { getCoordinateFromLocation, getAddressFromCoordinates };