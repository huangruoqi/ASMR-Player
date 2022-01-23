import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, FlatList, View, SafeAreaView, Button, Dimensions, Pressable} from 'react-native';
import * as React from 'react'
import * as fs from 'expo-file-system'
import { Audio } from 'expo-av'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { List, Avatar } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Status from './Status.jsx'
import Animation from './Animation.jsx';
import Animated,{
	withTiming,
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons'


const BLANK_SPACE = 20
const {height, width} = Dimensions.get('screen');

export default function Player({route}) {
  const [sound, setSound] = React.useState(new Audio.Sound());
	const [list, setList] = React.useState([]);
	const [isRefreshing, setIsRefreshing] = React.useState(false);
	const [progress, setProgress] = React.useState(0);
	const [colors, setColors] = React.useState(new Array(100).fill(0).map(() => ({
			r : Math.random()*128 + 128,
			g : Math.random()*128 + 100,
			b : Math.random()*128 + 128,
		})))
	const [refs, setRefs] = React.useState(new Array(100).fill(0).map(() => React.useRef(null)))
	
	const [duration, setDuration] = React.useState(1)
	const [current, setCurrent] = React.useState(0)
	const [songName, setSongName] = React.useState("")

	async function refreshLocalList() {
	  const result = [];
	  const filenames = await fs.readDirectoryAsync(df)
 		for (let i = 0; i < filenames.length; i++) {
 			if (filenames[i].slice(-4) != '.mp3') continue;
 			result.push({filename:filenames[i], id:i, func: startAnimation})
 		}
 		setList(result)
		setColors(new Array(filenames.length).fill(0).map(() => ({
			r : Math.random()*128 + 128,
			g : Math.random()*128 + 100,
			b : Math.random()*128 + 128,
		})))
 	}

 	const stop = async () => {
 		await sound.unloadAsync();
 	}

 	React.useEffect(() => {
		refreshLocalList();
 	  const id = setInterval(() => {
 	    const checkTime = async () => {
 	      const res = await AsyncStorage.getItem('stop_time')
 	      const stopTime = new Date(JSON.parse(res));
 	      const currentTime = new Date();
 	      const sh = stopTime.getUTCHours();
 	      const sm = stopTime.getUTCMinutes();
 	      const ch = currentTime.getUTCHours();
 	      const cm = currentTime.getUTCMinutes();
 	      if(sh == ch && sm == cm) { 
 	      	stop()
 	      }
 	    }
 	    const updateCurrent = async () => {
 	    	const res = await sound.getStatusAsync();
 	  		if (res.positionMillis == undefined) return;
 	    	setCurrent(res.positionMillis)
 	    	setProgress(res.positionMillis / res.durationMillis)
 	    }
 	    checkTime();
 	    updateCurrent();
 	  }, 995)
 	  return () => { clearInterval(id)}
 	},[])

	const df = fs.documentDirectory;

	async function playmp3(filename) {
		stop()
		const url = (df + filename)
		await sound.loadAsync({uri:url});
		await sound.playAsync();
		const res = await sound.getStatusAsync()
		setSongName(filename)
		setDuration(res.durationMillis)
	}

	async function setCurrentPosition(progress) {
		const res = await sound.getStatusAsync();
		const position = Math.floor(progress * res.durationMillis);
		await sound.playFromPositionAsync(position);
		setCurrent(res.positionMillis)
	}

	const o_progress = useSharedValue(0);
	const x_progress = useSharedValue(0);
	const y_progress = useSharedValue(0);
	const t_progress = useSharedValue(0);
	const rStyle = useAnimatedStyle(() => {
		const h = height - 286;
		const a = 800;
		const c = 0.25;
		const k = y_progress.value - 50;
		let y_pos = a*(t_progress.value-c)**2 + k;
		const t0 = Math.sqrt((h - k)/a) + c;
		if (t_progress.value <= t0) {
			return (
				{
					opacity: o_progress.value,
					transform:[
						{translateX: x_progress.value},
						{translateY: y_pos},
					]
				}
			)
		}
		const vf = 2*a*(t0-c);
		const time_intervals = [t0, vf/a/2 + t0];
		for (let i = 0; i < 5; i++) {
			time_intervals.push((time_intervals[i + 1] - time_intervals[i])/2 + time_intervals[i + 1])
		}
		for (let i = 1; i < 7; i++) {
			if (t_progress.value <= time_intervals[i]) {
				const _k = -a*((time_intervals[i] - time_intervals[i - 1])/2)**2;
				y_pos = a*((t_progress.value-time_intervals[i-1]) -(time_intervals[i] - time_intervals[i - 1])/2)**2 + _k + h;
				break;
			}
		}
		return (
			{
				opacity: o_progress.value,
				transform:[
					{translateX: x_progress.value},
					{translateY: y_pos},
				]
			}
		)
	})

	function startAnimation(x,y) {
		x_progress.value = x;
		y_progress.value = y;
		o_progress.value = 0;
		t_progress.value = 0;
		o_progress.value = withTiming(1, {duration:500})
		x_progress.value = withTiming(x>width/2? 30 : width - 50, {duration:2000});
		t_progress.value = withTiming(3, {duration:3000});
	}

	function render(props){
		const {item} = props;
		const {r,g,b} = colors[item.id];


		return(
			<View style={{
				padding: BLANK_SPACE / 2,
				paddingLeft: item.id%2==0?BLANK_SPACE: BLANK_SPACE / 2, 
				paddingRight: item.id%2==1?BLANK_SPACE: BLANK_SPACE / 2, 
				height: width / 2, 
				width: width / 2,
				zIndex: 1,
			}}>
				<Animation animate={refs[item.id]} leftItem={item.id%2==0}></Animation>
				<Pressable style={{padding: 20, flex: 1 ,backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`, borderRadius: 50}}
				onLongPress={() => refs[item.id].current(false)}
				onPress={({nativeEvent}) => {
					item.func(nativeEvent.pageX-20,nativeEvent.pageY-100);
					playmp3(item.filename);
					refs[item.id].current(true);
				}}>
					<View style={{flex:1, }}>
						<Text style={{fontSize:20, fontFamily: 'Bomb', color: `rgb(${r - 120}, ${g - 100}, ${b - 120})`}}>Nature</Text>
						<View style={{height:5, backgroundColor: `rgba(${r-64}, ${g-64}, ${b-64}, 150)`, borderRadius: 3}}></View>
						<Text style={{margin:5,fontFamily: 'Bomb'}}>{item.filename}</Text>
					</View>
				</Pressable>
			</View>
		)
	}
	return (
		<SafeAreaView>
			<FlatList 
			onRefresh={() => {
				setIsRefreshing(true);
				refreshLocalList().then(setIsRefreshing(false));
			}}
			refreshing={isRefreshing}
			contentContainerStyle={styles.list}
			data={list}
			keyExtractor={item => item.id}
			renderItem = {render}
			horizontal={false}
			numColumns={2}
			/>
			<Status duration={duration} name={songName} current={current} progress={progress} changeCurrent={setCurrentPosition} />
			<Animated.View style={[{position: 'absolute'}, rStyle]}>
				<Ionicons name='musical-notes' size={40}></Ionicons>
			</Animated.View>
		</SafeAreaView>
	)
}



function render2({item}){
	return(
		<View style={styles.item}>
			<List.Item
			title={item.filename}
			description="ASMR audio blahblahblah...."
			left={
				props => 
				<View style={{ justifyContent: 'center', alignItems: 'center'}}>
					<Avatar.Image size={64} source={{uri:'https://quranicquizzes.com/Content/QuizImages/wuhoxos2.e12.png'}} />
				</View>
			}
			right={
				props => 
				<View style={{ justifyContent: 'center', alignItems: 'center'}}>
					<Button title ={"Play " + item.filename} onPress={()=>{playmp3(item.filename)}} />
				</View>
			}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
  list: {
  	height: "87.5%",
		paddingTop: BLANK_SPACE / 2
  },
  item: {
  	borderRadius: 5,
  	borderWidth: 1,
  	margin: 5, 
  	borderColor: '#e0e0e0',
		zIndex:100
  }
});