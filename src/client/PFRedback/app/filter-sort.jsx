import { View, Text, KeyboardAvoidingView, SafeAreaView, ScrollView, Pressable, Modal, TouchableOpacity } from 'react-native'
import React, { useMemo, useState, useEffect } from 'react'
import RadioGroup from 'react-native-radio-buttons-group'
import CustomButton from '../components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import Checkbox from 'expo-checkbox';
import moment from "moment";
import { Calendar } from 'react-native-calendars';
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';


const FilterSort = () => {
    const { isLostFeed, location } = useLocalSearchParams()
    const todayDate = moment().format('YYYY-MM-DD')
    const oneMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD')

    const [selectedSort, setSelectedSort] = useState(null)
    const [selectedSpecies, setSelectedSpecies] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [dates, setDates] = useState({
        startDate: oneMonthAgo,
        endDate: todayDate,
    })
    const [showCalendar, setShowCalendar] = useState(false)
    const [rangeValue, setRangeValue] = useState(20)

    const resendEndpoint = '/api/posts/filter'
    
    var markedDates = {}

    const getFilterStorageKey = (isLostFeed) => {
        return isLostFeed === 'true' ? 'prevFilterLost' : 'prevFilterSpotted'
    }

    useEffect(() => {
        const fetchPrevFilter = async () => {
            console.log("is it lost feed? before ", isLostFeed)
            const key = getFilterStorageKey(isLostFeed)

            const previousFilter = await AsyncStorage.getItem(key)
            if (previousFilter && previousFilter !== undefined) {
                filters = JSON.parse(previousFilter)

                setSelectedSort(filters.sortOption)
                setSelectedSpecies(filters.speciesOption)
                setSelectedSize(filters.sizeOption)
                setRangeValue(filters.range)
                setDates({
                    startDate: filters.dates.startDate || oneMonthAgo,
                    endDate: filters.dates.endDate || todayDate,
                })
                const defaultColours = setDefaultCheckbox(colourOptions)
                filters.colourOptions.forEach(colour => {
                    if (defaultColours.hasOwnProperty(colour)) {
                        defaultColours[colour] = true
                    }
                })
                setSelectedColours(defaultColours)

                await AsyncStorage.removeItem(key)
            }
        }
        fetchPrevFilter()  
    }, [isLostFeed])
    
    /**
     * Options for sorting feed 
     */
    const radioButtonsSort = useMemo(() => ([
        {
            id: 'distAsc',
            label: 'Nearest First',
            value: 'distAsc',
            size: 16,
            color: "#236468",

        }, 
        {
            id: 'distDesc', 
            label: 'Furthest First',
            value: 'distDesc',
            size: 16,
            color: "#236468",
        },
        {
            id: 'bestMatched',
            label: 'Best Match',
            value: 'bestMatched',
            size: 16,
            color: "#236468",
        }
    ]), []);

    /**
     * Options for filtering feed by species
     */
    const radioButtonsFilterSpecies = useMemo(() => ([
        {
            id: 'Dog',
            label: 'Dog',
            value: 'Dog',
            size: 16,
            color: "#236468",

        }, 
        {
            id: 'Cat', 
            label: 'Cat',
            value: 'Cat',
            size: 16,
            color: "#236468",
        },
        {
            id: 'Bird',
            label: 'Bird',
            value: 'bird',
            size: 16,
            color: "#236468",
        },
        {
            id: 'Others',
            label: 'Others',
            value: 'Others',
            size: 16,
            color: "#236468",
        }
    ]), []);

    /**
     * Options for filtering feed by colour
     */
     const colourOptions = [
        'White / Cream',
        'Black',
        'Brown',
        'Golden / Yellow',
        'Red',
        'Orange',
        'Grey / Blue'
    ];

    /**
     * Options for filtering feed by pet size
     */
    const radioButtonsFilterSize = useMemo(() => ([
        {
            id: 'Small',
            label: 'Small',
            value: 'Small',
            size: 16,
            color: "#236468",

        }, 
        {
            id: 'Medium', 
            label: 'Medium',
            value: 'Medium',
            size: 16,
            color: "#236468",
        },
        {
            id: 'Large',
            label: 'Large',
            value: 'Large',
            size: 16,
            color: "#236468",
        }
    ]), []);

    /**
     * Sets all colour checkboxes to false
     * @param {*} colourOptions all colour options available to be selected
     * @returns
     */
    const setDefaultCheckbox = (colourOptions) => {
        return colourOptions.reduce((options, colour) => {
            options[colour] = false
            return options
        }, {})

    }

    /**
     * Initially sets all selected colour options to false 
     */
    const [selectedColours, setSelectedColours] = useState(
        setDefaultCheckbox(colourOptions)
    )

    /**
     * Retrieves all selected pet colours
     */
    const selectedColourOptions = Object.keys(selectedColours).filter(colour => selectedColours[colour]);


    /**
     * Handles the selection/unselection of the checkbox
     */
    const handleColourCheckboxSelection = (colour) => {
        setSelectedColours((prevState) => ({
            ...prevState,
            [colour]: !prevState[colour]
        }))
    }

    /**
     * Set to show/hide calendar when user presses on either Start Date or End Date boxes
     */
    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    /**
     * Handle when user select a date on the calendar 
     * 
     * If the user selects a date before the current start date and/or before the end date, it becomes the new start date
     * but if the user selects a date after the current end date
     * 
     * Assumption: user clicks on start date first before end date 
     */
    const handleDateSelection = (date) => {
        if (date.dateString < dates.startDate || date.dateString > dates.startDate && date.dateString <= dates.endDate) {
            setDates({ ...dates, startDate: date.dateString})
        } else {
            updateBothDates(dates.startDate, date.dateString)
        }
    }

    /**
     * Update the start and end dates
     * @param {*} start -- what the startDate will be updated to
     * @param {*} end -- what the endDate will be updated to
     */
    const updateBothDates = (start,  end) => {
        setDates({ startDate: start, endDate: end })
    }

    /**
     * Clear all current highlighted dates
     */
    const resetMarkedDateColours = () => {
        
        Object.keys(markedDates).forEach((date) => {
            markedDates[date] = {
                selected: false,
                color: null,
                textColor: null
            }
        })
        
        return markedDates
    }

    /**
     * 
     * @returns all dates that are highlighted on the calendar 
     */
    const getMarkedDates = () => {
        const {startDate, endDate} = dates
        if (startDate == endDate) {
            markedDates[startDate] = {
                startingDay: true,
                endingDay: true,
                selected: true,
                color: '#F79525',
                textColor: 'white'
            }

        } else {
            let current = moment(startDate)

            while (current.isSameOrBefore(moment(endDate))) {
                const date = current.format('YYYY-MM-DD')
                markedDates[date] = {
                    selected: true,
                    color:  '#F79525',
                    textColor: 'white'
                }

                if (date == startDate) {
                    markedDates[date].startingDay = true
                } else if (date == endDate) {
                    markedDates[date].endingDay = true
                }

                current = current.add(1, 'day');
            }
        }
        return markedDates
    }

    /**
     * Clears all selected options for sorting
     */
    const clearSortOptions = () => {
        setSelectedSort(null); 
    }

    /**
     * Clears all selected options for filtering
     */
    const clearFilterOptions = () => {
        setSelectedSpecies(null); 
        setSelectedSize(null); 
        setSelectedColours(setDefaultCheckbox(colourOptions))
        updateBothDates(oneMonthAgo, todayDate)
        resetMarkedDateColours()
        setShowCalendar(false)
        setRangeValue(20)
    }

    const handleConfirm = async (event) => {
        const hostURL = process.env.HOST_URL

        const selectedOptions = {
            sortOption: selectedSort,
            speciesOption: selectedSpecies,
            sizeOption: selectedSize,
            colourOptions: selectedColourOptions,
            dates: dates,
            range: rangeValue
        }
        console.log(selectedOptions)

        try {
            const url = `${hostURL}${resendEndpoint}`
            const key = getFilterStorageKey(isLostFeed)
            console.log(url)
            event.preventDefault()
            console.log(JSON.stringify(selectedOptions))
            console.log("From lost feed? ", isLostFeed)
            console.log("location: ", JSON.parse(location))

            await AsyncStorage.setItem(key, JSON.stringify(selectedOptions))

            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    selectedOptions,
                    isLostFeed: isLostFeed,
                    location: JSON.parse(location)
                })
            })

            if (response.ok) {
                const result = await response.json()
                console.log("===================================================================")
                console.log("response from handling filter confirm (json): ", JSON.stringify(result))
                await AsyncStorage.setItem('filteredPosts', JSON.stringify(result))
                console.log("=======================Saved to async storage=======================")
                router.back()
            } else {
                const result = await response.text()
                console.error("Some error occurred: ", result)
            }
        } catch(error) {
            console.error(error)
            Alert.alert('', 'An error occurred. Please try again.')
        }
    }

    return (
        <KeyboardAvoidingView>
            <SafeAreaView className="h-full bg-tiff_blue">
                <ScrollView className="bg-slate-50 p-4 gap-4 flex-1">
                    <View>
                        <View className="flex-row items-end">
                            <Text className="text-moss text-2xl font-semibold">
                                Sort By
                            </Text>
                            <Pressable onPress={clearSortOptions}>
                                <Text className="text-moss ml-2 mb-1 font-light underline">
                                    Clear All
                                </Text>
                            </Pressable>
                        </View>
                        
                        <RadioGroup
                            radioButtons={radioButtonsSort} 
                            onPress={setSelectedSort}
                            selectedId={selectedSort}   
                            containerStyle={{alignItems: 'flex-start', flexWrap: 'wrap', paddingTop: 12, marginLeft:9}}
                            labelStyle={{fontSize: 16, color: '#236468'}}
                        />
                    </View>

                    <View className="border-t border-gray-300"/>

                    <View>
                        <View className="flex-row items-end">
                            <Text className="text-moss text-2xl font-semibold">
                                Filter
                            </Text>
                            <Pressable onPress={clearFilterOptions}>
                                <Text className="text-moss ml-2 mb-1 font-light underline">
                                    Clear All
                                </Text>
                            </Pressable>
                        </View>

                        <Text className="text-moss text-xl mt-2">
                            Species
                        </Text>
                            
                        <RadioGroup
                            radioButtons={radioButtonsFilterSpecies} 
                            onPress={setSelectedSpecies}
                            selectedId={selectedSpecies}
                            layout='row'   
                            containerStyle={{alignItems: 'flex-start', flexWrap: 'wrap', paddingTop: 12}}
                            labelStyle={{fontSize: 16, color: '#236468'}}
                        />

                        <View className="border-t border-gray-200 mt-2"/>


                        <Text className="text-moss text-xl mt-2">
                            Colour
                        </Text>

                        <View className="flex-row flex-wrap gap-3 ml-0 my-1">
                            {colourOptions.map(colour => (
                                <View className="flex-row ml-2 items-center w-1/3 mx-8" key={colour}>
                                <Checkbox
                                    color={'#236468'}
                                    value={selectedColours[colour]}
                                    onValueChange={() => handleColourCheckboxSelection(colour)}
                                />
                                <Text className="ml-2 text-moss text-base">{colour}</Text>
                                </View>
                            ))}
                            </View>

                        <View className="border-t border-gray-200 mt-2"/>


                        <Text className="text-moss text-xl mt-3">
                            Size
                        </Text>
                        <RadioGroup
                            radioButtons={radioButtonsFilterSize} 
                            onPress={setSelectedSize}
                            selectedId={selectedSize}
                            layout='row'   
                            containerStyle={{alignItems: 'flex-start', flexWrap: 'wrap', paddingTop: 12}}
                            labelStyle={{fontSize: 16, color: '#236468'}}
                        />
                        <View className="border-t border-gray-200 mt-2"/>


                        <Text className="text-moss text-xl mt-2">
                            Date Range
                        </Text>

                        <View className="flex-row w-full my-2 justify-evenly">
                            <TouchableOpacity onPress={toggleCalendar} style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(35, 100, 104, 0.2)', borderRadius: 6, height: 36, paddingHorizontal: 6}}>
                                <Text className="text-moss">{dates.startDate ? `${dates.startDate}` : 'Start Date'}</Text>
                                <Ionicons name='calendar-outline' size={24} color='#236468' style={{marginLeft: 50}}/>   
                            </TouchableOpacity>

                            <TouchableOpacity onPress={toggleCalendar} style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(35, 100, 104, 0.2)', borderRadius: 6, height: 36, paddingHorizontal: 6}}>
                            <Text className="text-moss">{dates.endDate ? `${dates.endDate}` : 'End Date'}</Text>
                                <Ionicons name='calendar-outline' size={24} color='#236468' style={{marginLeft: 50}}/>   
                            </TouchableOpacity>
                        </View>

                        {showCalendar && (
                            <Calendar
                                theme={{calendarBackground: '#f8fafc', backgroundColor:'#f8fafc', arrowColor: '#236468', monthTextColor: '#236468'}}
                                minDate={oneMonthAgo}
                                maxDate={todayDate}
                                enableSwipeMonths={true}
                                hideExtraDays={true}
                                disableAllTouchEventsForDisabledDays={true}
                                markingType={'period'}
                                markedDates={getMarkedDates()}
                                onDayPress={handleDateSelection}
                            />
                        )}

                        <View className="border-t border-gray-200 mt-2"/>


                        <Text className="text-moss text-xl mt-2">
                            Geographic Range
                        </Text>
                        {/* <Text className="text-moss mt-2 ml-2">
                            Lead to a new page that has the map thing (similar to facebook marketplace)
                        </Text> */}
               
                        <View className="flex-row items-center w-max mt-4">
                            <Slider
                                    style={{width: 'max', height: 40, marginHorizontal: 10, flex: 1}}
                                    minimumValue={1}
                                    maximumValue={50}
                                    minimumTrackTintColor='#236468'
                                    maximumTrackTintColor='rgba(35, 100, 104, 0.2)'
                                    thumbTintColor='#F79525'
                                    value={rangeValue}
                                    step={1}  
                                    onValueChange={setRangeValue} 
                            />
                            <Text className="text-moss mr-2">
                                {rangeValue} km
                            </Text>
                        </View>
                        

                        

                        <View className="h-20">
                        </View>
                    </View>
                </ScrollView>

                <View className="h-24 border-t-2 border-tiff_blue items-center justify-center flex-row w-full">

                    <CustomButton
                        title="Confirm"
                        containerStyles="bg-yellow_orange mx-4 my-4 border-black-200 focus:border-secondary bottom-0 w-2/5"
                        textStyles="text-white"
                        handlePress={handleConfirm}
                    />
                    <CustomButton
                        title="Cancel"
                        containerStyles="bg-slate-50 mx-4 my-4 border-yellow_orange border-2 focus:border-secondary bottom-0 w-2/5"
                        textStyles="text-moss"
                        handlePress={() => router.dismiss()}
                    />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default FilterSort