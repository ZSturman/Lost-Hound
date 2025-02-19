/**
 * Converts lat lng coordinates to an address
 * @param {*} latlng 
 * @returns address
 */
const getAddressFromCoordinates = async (latlng) => {
    const {lat, lng} = latlng

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`)
        const data = await response.json()
    
        if (data.status === "OK") {
            const address = data.results[0].formatted_address
            console.log("ADDRESS FROM COORDINATE: ", address)
            return address || 'Address not found'
        } else {
            throw new Error(`Geocoding API error: ${data.status}`)
        }
    } catch (error) {
        console.error("Unable to get location from coordinate, ", error)
    }
}

const getCoordinateFromLocation = async (locationString) => { 
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationString)}&key=${process.env.GOOGLE_API_KEY}`)
        const data = await response.json()
        
        if (data.status === 'OK') {
            const { lat, lng } = data.results[0].geometry.location;
            return {lat, lng}
        } else {
            throw new Error('Unable to get coordinates for the location');
        }
    } catch (error) {
        console.error("Unable to get coordinate from location, ", error)
    }
}

const defaultLocations = {
    'NSW': { lat: -33.8688, lng: 151.2093 }, // Sydney
    'VIC': { lat: -37.8136, lng: 144.9631 }, // Melbourne
    'QLD': { lat: -27.4698, lng: 153.0251 }, // Brisbane
    'SA': { lat: -34.9285, lng: 138.6007 },  // Adelaide
    'WA': { lat: -31.9505, lng: 115.8605 },  // Perth
    'TAS': { lat: -42.8821, lng: 147.3272 }, // Hobart
    'ACT': { lat: -35.2809, lng: 149.1300 }, // Canberra
    'NT': { lat: -12.4634, lng: 130.8456 }   // Darwin
}

/**
 * Gets the default location of the user in the state the user entered (if provided during signup)
 * If state is not provided, it uses the default address in VIC
 * @returns address of the default location
 */
const useDefaultLocation = async () => {
    const endPoint = "/api/account/"
    const hostURL = process.env.HOST_URL
    const url = `${hostURL}${endPoint}`

    const response = await fetch(url)
    const data = await response.json();
    const state = data.state
    console.log(data)
    const defaultLocation = defaultLocations[state] || defaultLocations['VIC'];

    console.log(defaultLocation)
    const address = await getAddressFromCoordinates(defaultLocation)
    console.log(address)
    return address
    
}

export default { getAddressFromCoordinates, getCoordinateFromLocation, useDefaultLocation }