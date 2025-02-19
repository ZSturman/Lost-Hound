import { View, Text, SafeAreaView, ScrollView, GestureHandlerRootView } from 'react-native'
import React from 'react'
import ImgRecogGridView from '../components/img-recog-gridview'

export default function ImgRecogFeed() {
  return (
    <SafeAreaView className="h-full bg-[#FFFFFD]">
      <View className="flex-1">
          <SafeAreaView className="flex-1">

          <View className="px-4 py-2">
                  <Text className="text-left text-xs text-gray-600">
                    * The feed is sorted by similarity score, showing the most similar spotted pets to the lost pet first
                  </Text>
                  
                  <Text/>
                  <Text className="text-left text-xs text-gray-600">
                  ** The filter has been applied to show spotted pets within a 20km radius of your lost pet's last known location.
                  </Text>

          </View>

            <ScrollView className="flex-1 ">
              <View className="justify-center flex-row">



                <ImgRecogGridView/>
              </View>
            </ScrollView>
          </SafeAreaView>
          </View>
          </SafeAreaView>
  )
}