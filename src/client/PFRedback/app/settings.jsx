import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { logoutAccount, deleteAccount } from '../api/accountApi';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const handleLogoutAccount = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout your account?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deactivation Button Cancelled"),
          style: "cancel",
          role: "cancel"
        },
        { text: "Logout", onPress: () => logoutAccount() },
      ],
      { cancelable: true }
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "This feature is not implemented yet.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Change Password Button Cancelled"),
          style: "cancel",
          role: "cancel"
        }
      ],
      { cancelable: true }
    );
  };


  const handleDeactivateAccount = (event) => {
    Alert.alert(
      "Confirm Deactivation",
      "Are you sure you want to deactivate your account?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deactivation Button Cancelled"),
          style: "cancel",
          role: "cancel"
        },
        { text: "Deactivate", 
          onPress: () => {
            console.log("Deactivation Button Pressed");
            deleteAccount();
            logoutAccount()
          }
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView>

        {/** Notifications Section */}
        <View className="px-6 ">
            <Text className="py-6 text-xl font-bold">Notifications</Text>
            <View className="pl-6 pr-3 py-5 my-2 flex-row justify-between items-center bg-white rounded-xl">
            <Text className="text-base">Allows notifications</Text>
            <Switch
                value={notificationsEnabled}
                onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                testID="notifications-switch"
            />
            </View>
        </View>

        {/** Permission Section */}
        <View className="px-6">
            <Text className="py-6 text-xl font-bold">Permission</Text>

            {/** Location Access */}
            <View className="pl-6 pr-3 py-5 my-2 flex-row justify-between items-center bg-white rounded-xl">
            <Text className="text-base">Location Access</Text>
            <Switch
                value={locationEnabled}
                onValueChange={() => setLocationEnabled(!locationEnabled)}
                testID="location-switch"
            />
            </View>
            
            {/** Camera Access */}
            <View className="pl-6 pr-3 py-5 my-2 flex-row justify-between items-center bg-white rounded-xl">
            <Text className="text-base">Camera access</Text>
            <Switch
                value={cameraEnabled}
                onValueChange={() => setCameraEnabled(!cameraEnabled)}
                testID="camera-switch"
            />
            </View>
           
        </View>
        
        {/** Privacy Section */}
        <View className="px-6">
            <Text className="py-6 text-xl font-bold">Privacy</Text>

            {/** Log Out */}
            <TouchableOpacity 
                className="mt-2 py-2 bg-gray-300 rounded-lg justify-center items-center"
                onPress={handleLogoutAccount}
            >
                <Text className="text-base">Log Out</Text>
            </TouchableOpacity>

            {/** Reset Password */}
            <TouchableOpacity 
                className="mt-2 py-2 bg-gray-300 rounded-lg justify-center items-center"
                onPress={handleChangePassword}
            >
                <Text className="text-base">Reset password</Text>
            </TouchableOpacity>

            {/** Deactivate Account */}
            <TouchableOpacity 
                className="mt-2 py-2 bg-red-400 rounded-lg justify-center items-center"
                onPress={handleDeactivateAccount}
            >
                <Text className="text-base">Deactivate Account</Text>
            </TouchableOpacity>

           
        </View>

      
    </SafeAreaView>
  );
};


export default SettingsScreen;
