import * as React from 'react'
import {View, Dimensions} from 'react-native'
import Animated, {
	withTiming,
	useSharedValue,
	useAnimatedStyle
} from 'react-native-reanimated';


const {height, width} = Dimensions.get('screen')
export default function Animation({animate, leftItem}) {
	React.useEffect(() => {
		animate.current = (b) => {
			setShow(b)
		}
	},[]);
	const progress = useSharedValue(0);
  const rstyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: -320+(progress.value - 0.43)*-200,
    left: -79+(leftItem?10:0),
    transform: [{ scale: progress.value }],
  }));

	function setShow(b) {
		progress.value = withTiming(b?0.43:0, {duration: 1000})
	}

	return (
		<View style={{position: 'absolute'}}>
			<View
        style={{
          width: 200,
          height: 500,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            height: 190,
            width: 190,
          }}
        >
          <Animated.Image
            source={require("../assets/fire3.gif")}
            style={rstyle}
          />
        </View>
			</View>
		</View>
	)

}