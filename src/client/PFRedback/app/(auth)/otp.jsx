import { View, Text, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Alert, Pressable} from 'react-native'
import CustomButton from '../../components/CustomButton'
import React, { useEffect, useState } from 'react'
import { OtpInput } from "react-native-otp-entry"
import { router, useLocalSearchParams } from 'expo-router'

const OTP = () => {

    /**
     * Time in seconds until the current OTP expires
     */
    const timeToOtpExpiry = 60
    const [timerCount, setTimer] = useState(timeToOtpExpiry)
    const [isVerifying, setIsVerifying] = useState(false)
    const [canResend, setCanResend] = useState(false)

    const [otpEntered, setOtp] = useState(null)
    const otpEndpoint = '/api/account/register/verifyOTP'
    const resendEndpoint = '/api/account/register/sendOTP'

    const { userEmail } = useLocalSearchParams()

    /**
     * Handles the verification of otp input
     * 
     * @param {*} otpEntered -- 6 digit OTP
     */
    const handleOtpInput = async (otpEntered) => {
        setIsVerifying(true)
        try {
            const hostURL = process.env.HOST_URL
            const url = `${hostURL}${otpEndpoint}`
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    enteredOTP: otpEntered,
                    userEmail: userEmail
                })
            })

            setIsVerifying(false)
            if (response.ok) {
                console.log("OTP correct, can navigate to home page")
                router.replace("/home")
            } else {
                const result = await response.text()
                console.error("There is an error: ", result)

                if (result === 'No Existing OTP') {
                    Alert.alert('No Existing OTP', 'Please ensure email entered is accurate')
                } else if (result === 'OTP Expired') {
                    Alert.alert('OTP Expired', 'Please click on resend to have a new OTP sent to your email')
                } else if (result === 'OTP Previously Verified') {
                    Alert.alert('Existing User', 'Please log in instead')
                } else if (result === 'OTP Incorrect') {
                    Alert.alert('Incorrect OTP', 'Please ensure OTP entered matches the one you\'ve received in the email')
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Handles the resending of email
     */
    const handleResend = async () => {   
        console.log(`Sending email to ${userEmail}`)
        try {
            const hostURL = process.env.HOST_URL
            const url = `${hostURL}${resendEndpoint}`
            const response = await fetch(url, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userEmail: userEmail
                })
            })

            if (response.ok) {
                const result = await response.text()
                console.log(result)
            } else {
                const result = await response.text()
                
                console.error("There is an error: ", result)
                console.error("Email could not be sent")
                Alert.alert("", "Please try resending the email again")
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        countdownTimer()
    }, [])

    useEffect(() => {
        handleResend()
    }, [])

    /**
     * Converts the given number of seconds into a string formatted as "mm:ss" 
     * @param {*} initialSeconds - The number of seconds to convert
     * @returns The converted time in "mm:ss" format 
     */ 
    const convertSecondsToMinutes = (initialSeconds) => {
        let minutes = Math.floor(initialSeconds / 60)
        let seconds = initialSeconds - (minutes * 60)
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return `${minutes}:${seconds}`;
    }

    const formattedTime = convertSecondsToMinutes(timerCount)

    const countdownTimer = () => {
        let interval = setInterval(() => {
            setTimer((lastTimerCount) => {
                if (lastTimerCount <= 1) {
                    clearInterval(interval)
                    setCanResend(true)
                    return 0
                } 
                return lastTimerCount-1
            })
        }, 1000)
        return () => clearInterval(interval)
    }


    return (
        <KeyboardAvoidingView> 
            <SafeAreaView className="bg-tiff_blue h-full">
                <ScrollView>
                    <View className="w-full justify-between min-h-[85vh] px-4 my-6 flex-1">
                        <View className="justify-center items-center pt-5 gap-2 h-1/3"> 
                            
                            <Text className="justify-center font-extrabold text-moss text-2xl">
                                Verification
                            </Text>
                            <Text className="text-pretty text-moss font-light my-2 text-center w-48">
                                Enter the code we sent to your email to finish signing up
                            </Text>
                        </View> 

                        <View className="h-1/3 justify-center pb-10">
                            <OtpInput 
                                numberOfDigits={6}
                                onTextChange={(inputOTP) => setOtp(inputOTP)}
                                onFilled={(inputOTP) => {setOtp(inputOTP), handleOtpInput(inputOTP)}}
                                type="numeric"
                                disabled={isVerifying}
                                theme={{
                                    containerStyle: [
                                        styles.container, 
                                        isVerifying ? styles.containerDisabled : {}
                                    ],
                                    pinCodeContainerStyle: styles.pinCodeContainer,
                                    pinCodeTextStyle: styles.pinCodeText,
                                    focusStickStyle: styles.focusStick,
                                    filledPinCodeContainerStyle: styles.filledPinCodeContaine
                                }}
                            />
                        </View>
                    
                        <View className="justify-center h-1/3">
                            <CustomButton
                                title="Submit"
                                handlePress={() => handleOtpInput(otpEntered)}
                                containerStyles="bg-yellow_orange mt-7 border-black-200 focus:border-secondary bottom-0"
                                textStyles="text-white"
                                isLoading={isVerifying}
                            />

                            <View className="flex-row justify-center mt-6">
                                <Text className="text-moss font-light">
                                    I didn't receive the code!  
                                </Text>

                                <Pressable
                                    onPress={() => {canResend? handleResend() : null, setCanResend(false), setTimer(timeToOtpExpiry),countdownTimer()}}
                                    disabled={!canResend}
                                    className={`${!canResend ? 'text-gray-50 opacity-50' : ''}`}>
                                    <Text className="text-moss font-medium ml-2 underline">
                                        {canResend ?  'Resend' : `Resend in ${formattedTime}`}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
        width: 'auto',
        marginBottom: 8,
        marginHorizontal:8
    },
    pinCodeContainer: {
        backgroundColor: "#fff",
        marginTop: 4,
        width: 50,
        height: 50,
    },
    pinCodeText: {
        color: "#32a2aa",
        fontWeight: "light"
    },
    focusStick: {
        color: "#32a2aa"
    },
    filledPinCodeContainer: {
        backgroundColor: "#F7F9F9"
    },
    containerDisabled: {
        opacity: 0.8
    }
})

export default OTP