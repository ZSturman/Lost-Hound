
import * as Location from 'expo-location'
import * as MediaLibrary from 'expo-media-library';


const getLocationPermission = async () => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            return {msg: 'Permission not granted, use default location'}
        }
        let location = await Location.getCurrentPositionAsync({})

        return {location}
    } catch (error) {
        return {msg: 'Error fetching location'}
    }
}

const getSaveImagePermission = async () => {
    let { status } = await MediaLibrary.requestPermissionsAsync()
    if (status != 'granted') {
        return {msg: 'Permission not granted, unable to save QR Code to Photo Library'}
    }
}

export default { getLocationPermission, getSaveImagePermission }