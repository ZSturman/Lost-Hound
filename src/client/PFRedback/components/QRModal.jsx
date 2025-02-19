import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useRef } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import permission from '../api/permission';
import Toast from 'react-native-toast-message';


const QRModal = ({ visible, onClose, link }) => {
    const qrCodeRef = useRef()

    const handleDownload = async(link) => {
        try {
            permission.getSaveImagePermission()

            // capture QR code view and save as image/png
            const uri = await captureRef(qrCodeRef, {
                format: 'png',
                quality: 1.0,
            })

            await MediaLibrary.saveToLibraryAsync(uri)
            console.log("Saved qr code")
            console.log("link when downloaded: ", link)

            // show success toast 
            Toast.show({
                type: 'success',
                text1: 'QR Code Saved Successfully!',
                position: 'top',
                topOffset: 60,
            })

            // close the modal
            setTimeout(() => {
                onClose()  
            }, 1500)

        } catch (error) {
             console.log("Permission not granted, image not saved")
             // show error toast 
            Toast.show({
                type: 'error',
                text1: 'Photo Album Permission Not Granted',
                position: 'top',
                topOffset: 60,
            })

            // close the modal
            setTimeout(() => {
                onClose()  
            }, 2000)
        }
    }


    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 justify-center items-center" >
                <View className="w-72 pt-4 pb-6 bg-[#A9E0E2] rounded-lg border-2 border-slate-400">
                    
                    <View className="flex-row items-center justify-between pb-4 pr-5 pl-4">
                        <View className="items-center absolute left-0 right-0 bottom-2">
                            <Text className="text-2xl font-bold text-white">
                                    Share Your Post
                            </Text>
                        </View>
                        <Pressable onPress={onClose} className="ml-auto">
                            <Ionicons name='close-outline' size={28} color={"#236468"}/>
                        </Pressable>
                    </View>
                    
                    <View className=" bg-[#A9E0E2] items-center mt-4" >
                        <View ref={qrCodeRef}>
                            <QRCode
                                value = {link}
                                size={150}
                                quietZone={5}
                                color={'white'}
                                backgroundColor={'#A9E0E2'}
                            />
                        </View>
                        
                        <Pressable onPress={() => handleDownload(link)} 
                        className="flex-row justify-center gap-2 items-center pl-2 pr-5 pb-2 mt-6 ml-1">
                            <Ionicons name='download-outline' size={20} color={"#FFFFFD"}/>
                            <Text className="text-[#FFFFFD] text-xl">
                                Download
                            </Text>
                        </Pressable>
                    </View>
                    
                </View>
                <Toast/>
            </View>
        </Modal>
    )
}

export default QRModal;