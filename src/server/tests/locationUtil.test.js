import { getCoordinateFromLocation, getAddressFromCoordinates } from '../util/locationUtil.js';

describe("Location Utility Functions Test", () => {
    describe("Get Coordinates from Address", () => {
        afterEach(() => {
            jest.clearAllMocks()
        })

        beforeEach(() => {
            global.fetch = jest.fn()
        })

        it("should return coordinates and state for given address", async() => {
            const mockLocationString = 'Flagstaff Gardens, William Street, West Melbourne VIC, Australia'

            const mockFetchResponse = {
                status: 'OK',
                results: [
                  {
                    geometry: {
                      location: {
                        lat: -37.8105,
                        lng: 144.9544
                      }
                    },
                    address_components: [
                      {
                        types: ['administrative_area_level_1'],
                        short_name: 'VIC'
                      }
                    ]
                  }
                ]
            }

            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            })

            const result = await getCoordinateFromLocation(mockLocationString)

            expect(result).toEqual({
                lat: -37.8105,
                lng: 144.9544,
                state: 'VIC'
            })
        })

        
        it("should throw an error if Google API does not return an \"ok\" status", async() => {
            global.fetch.mockImplementationOnce(() =>
                Promise.resolve({
                  json: () => Promise.resolve({ status: 'ZERO_RESULTS' }),
                })
            )
            const location = 'Invalid Location'

    
            await expect(getCoordinateFromLocation(location)).rejects.toThrow('Unable to get coordinates for the location')

        })

        it("should handle missing state in response", async() => {
            const mockLocationString = 'Flagstaff Gardens, William Street, West Melbourne VIC, Australia'

            const mockFetchResponse = {
                status: 'OK',
                results: [
                  {
                    geometry: {
                      location: {
                        lat: -37.8105,
                        lng: 144.9544
                      }
                    },
                    address_components: []
                  }
                ]
            }

            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockFetchResponse)
            })

            const result = await getCoordinateFromLocation(mockLocationString)

            expect(result).toEqual({
                lat: -37.8105,
                lng: 144.9544,
                state: null
            })

        })
    }),

    describe("Get Address from Coordinates", () => {
        afterEach(() => {
            jest.clearAllMocks()
        })

        beforeEach(() => {
            global.fetch = jest.fn()
        })

        it("should return location for given coordinates", async() => {
            const mockLatLng = { lat: -37.8105, lng: 144.9544 }

            const mockFetchResponse = {
                status: 'OK',
                results: [
                  {
                    formatted_address: 'Flagstaff Gardens, William Street, West Melbourne VIC, Australia'
                  }
                ]
            }

            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockFetchResponse),
            })

            const result = await getAddressFromCoordinates(mockLatLng)

            expect(result).toEqual('Flagstaff Gardens, William Street, West Melbourne VIC, Australia')
        })

        it("should throw an error if Google API does not return an \"ok\" status", async() => {
            const mockLatLng = { lat: -37.8105, lng: 144.9544 }

            global.fetch.mockImplementationOnce(() =>
                Promise.resolve({
                  json: () => Promise.resolve({ status: 'ZERO_RESULTS' }),
                })
            )

            await expect(getAddressFromCoordinates(mockLatLng)).rejects.toThrow('Unable to get location for the coordinates')
        })

        it("should handle missing address in response", async() => {
            const mockLatLng = { lat: -37.8105, lng: 144.9544 }

            const mockFetchResponse = {
                status: 'OK',
                results: [
                  {
                    
                  }
                ]
            }

            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue(mockFetchResponse),
            })

            const result = await getAddressFromCoordinates(mockLatLng)
            expect(result).toEqual('Address not found')
        })

    })
})