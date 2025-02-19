import { View, Text, TextInput, TouchableOpacity, Image, Button, Platform, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants"
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '@env'


const FormField = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    required,
    isDateField = false,                                                // To handle date picker
    isTimeField = false,                                                // To handle time picker
    isLocationField = false,                                            // To handle google map api
    isNumeric = false,
    isLoading = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);     
    const [dateValue, setDateValue] = useState(value);  
    const [locationValue, setLocationValue] = useState(value || '');  

    // For limitting users selecting future date & time in DateTimePicker
    const today = new Date();

    let globalChosenDate = new Date();

    
    const handleDateChange = (event, selectedDate) => {
        const chosenDate = selectedDate || dateValue;
        console.log("Here:", chosenDate)
        setIsDatePickerVisible(false);

        // Remove time components from both dates for comparison
        const chosenDateOnly = new Date(chosenDate.setHours(0, 0, 0, 0));
        const todayOnly = new Date(today.setHours(0, 0, 0, 0));
  
        // Restrict future date selection
        if (chosenDateOnly > todayOnly) {
            console.log("chosenDateOnly > todayOnly")
            Alert.alert("Invalid Date", "You cannot select a future date.");
            setDateValue(today);             // Set to current date if future date is selected
            console.log("dateValue: ", dateValue)
            handleChangeText(today);
            // globalChosenDate = today;
            console.log("today: ", today)
            
        } else {
            setDateValue(chosenDate);       // Update with selected date
            console.log("dateValue chosenDate: ", dateValue)
            handleChangeText(chosenDate);
            // globalChosenDate = chosenDate;
            console.log("chosenDate: ", chosenDate)

        }
    
        if (Platform.OS === 'android') {
            setIsTimePickerVisible(true);   // Show time picker after selecting date on Android
        }
    };
    

    // Handle time changes
    const handleTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            const updatedTime = new Date(dateValue);
            updatedTime.setHours(selectedTime.getHours());
            updatedTime.setMinutes(selectedTime.getMinutes());
            setDateValue(updatedTime);
            handleChangeText(updatedTime);                              // Update the date after time is selected
        }
        setIsTimePickerVisible(false);  
    };

    const handleDateTimeCancel = () => {
        setIsDatePickerVisible(false); 
        setIsTimePickerVisible(false);  
    };

    const isMultiline = title === "Additional Details";

    
    const formattedDateOrTime = isDateField                                  // Format the value based on whether it's a date or time field
        ? dateValue.toLocaleDateString()       
        : isTimeField
        ? dateValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })  // Show only the time part
        : value;


    return (
        <View className={`space-y-2 block ${otherStyles}`}>
            <Text className="text-base text-moss">{title}{required === true && ('*')}</Text>

            <View className={`w-full ${isMultiline ? 'h-32' : 'h-16'} px-4 bg-white rounded-2xl focus:border-secondary items-center flex-row ${isLoading ? 'bg-gray-100 opacity-80' : 'bg-black-100'}`}>


                {!isLocationField ? (
                    // Regular TextInput for non-location fields
                    <TextInput
                        className="flex-1 text-dark_grey selection:text-base"
                        value={isDateField || isTimeField ? formattedDateOrTime : value}
                        placeholder={placeholder}
                        placeholderTextColor="#A9A9AC"
                        onChangeText={handleChangeText}
                        secureTextEntry={title === "Password" && !showPassword}
                        required={required}
                        multiline={isMultiline}                             // Enable multiline if it's the "Additional Details" field
                        textAlignVertical={isMultiline ? "top" : "center"}  // Align text to the top if multiline
                        style={[
                            isMultiline ? { height: '100%' } : {},          // TextInput expands fully for multiline
                            isLoading ? { opacity: 0.5, backgroundColor: '#f0f0f0' } : {},
                        ]}
                        editable={!isDateField && !isTimeField && !isLoading}  // Make the TextInput non-editable for date fields, and if form is being submitted
                        keyboardType={isNumeric ? "number-pad" : "default"}
                        accessibilityLabel={title}                          // Use the title as the accessibility label
                    />
                ) : (
                    // GooglePlacesAutocomplete for location field
                    <>
                        <GooglePlacesAutocomplete
                            disableScroll={true}
                            placeholder={'Enter a location'}
                            minLength={2}                               // Min length of text to trigger suggestions
                            fetchDetails={false}                        // Do not fetch place details to avoid extra charges
                            query={{
                                key: GOOGLE_API_KEY,
                                language: 'en',
                                components: 'country:aus'               // Make the query Australia-specific
                            }}
                            onPress={(data) => {
                                setLocationValue(data.description);          // Update the input field with the selected location
                                handleChangeText(data.description);
                            }}
                            textInputProps={{
                                value: locationValue,
                                placeholderTextColor: '#A9A9AC', 
                                onChangeText: (text) => {
                                    setLocationValue(text);
                                    if (text === '' && text !== locationValue) {
                                        handleChangeText('');  // Clear the form's state if the input is cleared
                                    }
                                },
                            }}
                            styles={{
                                textInputContainer: {
                                    backgroundColor: 'transparent',  
                                },
                                textInput: {
                                    flex: 1,
                                    color: '#4a4a4a',     // Match the dark grey color
                                    fontSize: 16,         // Equivalent to `text-base`
                                    height: 30,           // Match the height of other input fields
                                    borderWidth: 0,
                                    paddingLeft: 1,      
                                    borderRadius: 5,
                                    marginTop: 9
                                },
                                listView: {
                                    position: 'absolute',
                                    zIndex: 2000,                    
                                    top: 40,                        
                                    backgroundColor: 'white',        
                                    borderRadius: 5,
                                    elevation: 5,
                                },
                                description: {
                                    color: '#4a4a4a',  // Match the text color with the rest of the form
                                },
                            }}
                            nearbyPlacesAPI='GooglePlacesSearch'       
                            debounce={200}                             // Delay the request for better performance
                            enablePoweredByContainer={false}
                        />
                    </>
                )}

                {isDateField && (
                    <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
                        <Ionicons name="calendar-outline" size={24} />
                    </TouchableOpacity>
                )}

                {isTimeField && (
                    <TouchableOpacity onPress={() => setIsTimePickerVisible(true)}>
                        <Ionicons name="time-outline" size={24} />
                    </TouchableOpacity>
                )}

                {title === "Password" && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image source={!showPassword ? icons.eye : icons.eyehide} className="w-6 h-6 resizeMode='contain"/>
                    </TouchableOpacity>
                )}
            </View>

            {isDateField && isDatePickerVisible && (
                <View>
                    <DateTimePicker
                        value={dateValue}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                    />
                    <Button title="Cancel" onPress={handleDateTimeCancel} />
                </View>
            )}

            {isTimeField && isTimePickerVisible && (
                <View>
                    <DateTimePicker
                        value={dateValue}
                        mode="time"
                        display="spinner"
                        onChange={handleTimeChange}
                    />
                    {Platform.OS === 'ios' && (
                        <Button title="Cancel" onPress={handleDateTimeCancel} />
                    )}
                </View>
            )}
        </View>
    );
};

export default FormField;
