import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, FlatList, View, SafeAreaView, Button } from 'react-native';
import * as React from 'react'
import * as fs from 'expo-file-system'
import { Audio } from 'expo-av'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { List, Avatar } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Status from './Status.jsx'


export default function Player({route}) {
  const [sound, setSound] = React.useState(new Audio.Sound());
	const [list, setList] = React.useState([]);
	const [isRefreshing, setIsRefreshing] = React.useState(false);
	const [progress, setProgress] = React.useState(0);
	
	const [duration, setDuration] = React.useState(1)
	const [current, setCurrent] = React.useState(0)
	const [songName, setSongName] = React.useState("")

	async function refreshLocalList() {
	  const result = [];
	  const filenames = await fs.readDirectoryAsync(df)
 		for (let i = 0; i < filenames.length; i++) {
 			if (filenames[i].slice(-4) != '.mp3') continue;
 			result.push({filename:filenames[i], id:i})
 		}
 		setList(result)
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

	React.useEffect(() => {
	}, [])
	
	return (
		<SafeAreaView>
			<FlatList 
			onRefresh={() => {
				setIsRefreshing(true);
				refreshLocalList().then(setIsRefreshing(false));
			}}
			refreshing={isRefreshing}
			style={styles.list}
			data={list}
			keyExtractor={item => item.id}
			renderItem = {({item}) =>
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
			}
			/>
			<Status duration={duration} name={songName} current={current} progress={progress} changeCurrent={setCurrentPosition} />
		</SafeAreaView>
	)
}


const styles = StyleSheet.create({
  list: {
  	height: "87.5%",
  },
  item: {
  	borderRadius: 5,
  	borderWidth: 1,
  	margin: 5, 
  	borderColor: '#e0e0e0'
  }
});