import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const CustomButton = ({
  title,
  handlePress,
  handleImgDelete,
  containerStyles,
  textStyles,
  isLoading,
  isDisabled,
  showImage,
  imageUris, // Array of image URIs
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-xl min-h-[62px] flex flex-row justify-center border border-gray-200 py-5 px-8 items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isDisabled || isLoading}
      accessibilityRole="button" // To support frontend testing
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}

      {showImage &&
        (imageUris && imageUris.length > 0 ? (
          <View style={{ flexDirection: "row", gap: 10 }}>
            {imageUris.map((img, index) => (
              <View key={index} className="rounded-md overflow-hidden relative">
                <Image
                  source={{ uri: img.uri }}
                  className="w-[120px] h-[200px] rounded-md"
                />
                <TouchableOpacity
                  className="p-2 bg-red-500 rounded-md absolute top-0 right-0"
                  onPress={() => handleImgDelete(index)}
                >
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          // Render upload icon if no images are selected
          <View className="space-y-2 flex items-center justify-center">
            <Ionicons name="cloud-upload-outline" size={80} color="#6b7280" />
            <Text className="text-sm font-medium text-gray-500">
              Tap to upload image
            </Text>
          </View>
        ))}
    </TouchableOpacity>
  );
};

export default CustomButton;
