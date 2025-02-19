import { createContext, useEffect, useState } from 'react'
import permission from '../api/permission'

const LocationContext = createContext()

const LocationProvider = ({ children }) => {
    // default location: ERC Library
    const [location, setLocation] = useState({
        lat: -37.7993,
        lng: 144.9628
    })
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        (async () => {
          const result = await permission.getLocationPermission();
          if (result.msg) {
            setErrorMsg(result.msg)
            console.log("Default location: ERC Library")
            
          } else {
            const { latitude, longitude } = result.location.coords
            setLocation({ lat: latitude, lng: longitude })
          }
        })()
    }, [])

    return (
        <LocationContext.Provider value={{location, errorMsg}}>
            {children}
        </LocationContext.Provider>
    )

}

export default {LocationContext, LocationProvider}