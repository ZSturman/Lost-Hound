import { useState } from "react";
import { View, Text, Dimensions, StyleSheet, Image, InteractionManager } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PAGE_WIDTH = Dimensions.get('window').width;

// fix spaces between carousel slides

const list = [
    {
        id: '1',
        img: require('./1.jpg')
    },
    {
        id: '2',
        img: require('./2.jpg')
    },
    {
        id: '3',
        img: require('./3.jpeg')
    }
];

/**
 * 
 * isFeed argument checks if the PostCarousel is used for a feed. 
 * The sizing will differ accordingly.
 */
function PostCarousel({postList = [], isFeed = true}) {
  const [isVertical, setIsVertical] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [pagingEnabled, setPagingEnabled] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const progressValue = useSharedValue(0);
  const baseOptions = isVertical
    ? {
      vertical: true,
    }
    : 
    {
      vertical: false,
      width: PAGE_WIDTH * 0.9,
      height: PAGE_WIDTH * 0.5,
    };

  return (
    <View className= {`${isFeed ? "items-start pl-3 pr-3 pb-0" : "items-start pl-1 pr-2 pb-0"}`}>
      <Carousel 
            width={isFeed ? PAGE_WIDTH * 0.85 : 350}
            height={isFeed ? PAGE_WIDTH * 0.5 : 300}
            vertical={false}
            pagingEnabled={pagingEnabled}
            snapEnabled={snapEnabled}
            autoPlay={autoPlay}
            autoPlayInterval={1500}
            onProgressChange={(_, absoluteProgress) =>
                (progressValue.value = absoluteProgress)
            }
            mode="parallax"

            // Configure these parameter for gap between slides and the relative size between focus and out of focus slides
            modeConfig={{
                parallaxScrollingScale: 1,
                parallaxScrollingOffset: isFeed ? 170 : -20,
                parallaxAdjacentItemScale: 1,
            }}
            defaultIndex={0}

            data={postList.photo}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
                <View className=" justify-center items-end ml-[2%] mb-[-5px] w-fit" style={{backgroundColor: item?.color}}>
                    <Image 
                    source={ item && item.length > 0
                      ? { uri: item}
                      : list.img}
                    className={`${isFeed ? "h-[90%] w-[48%] rounded-md" : "w-[350px] h-[300px] rounded-xl"}`}
                    />
                </View>
            )}
        /> 
    </View>
  );
}


export default PostCarousel;