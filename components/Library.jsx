import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, SafeAreaView, Button, FlatList} from 'react-native';
import * as React from 'react'
import { Audio } from 'expo-av'
import * as fs from 'expo-file-system'
import { initializeApp } from 'firebase/app'
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage'
import Ionicons from '@expo/vector-icons';
import { List, Avatar } from 'react-native-paper'


// Initialize Firebase


export default function Library({url}) {
	const [isRefreshing, setIsRefreshing] = React.useState(false);
 	const [list, setList] = React.useState([]);

 	const firebaseConfig = {
 	    apiKey: "AIzaSyBp2KKZwRWbXpeqXMXgOKhpeMzWmSfKv7A",
 	    authDomain: "schedule-1aa61.firebaseapp.com",
 	    databaseURL: "https://schedule-1aa61.firebaseio.com",
 	    projectId: "schedule-1aa61",
 	    storageBucket: "schedule-1aa61.appspot.com",
 	    messagingSenderId: "627663326398",
 	    appId: "1:627663326398:web:f918846c5aed74c50562ef",
 	    measurementId: "G-6DD53KKLHR"
 	};
 	const firebaseApp = initializeApp(firebaseConfig);
 	const storage = getStorage(firebaseApp)
 	const storageRef = ref(storage, 'files/')

 	async function refreshOnlineList() {
 		const res = await listAll(storageRef);
 		const filenames = res.items;
 		const result = [];
 		for (let i = 0; i < filenames.length; i++) {
 			const p = filenames[i]._location.path_;
 			if (p.slice(-4) != '.mp3') continue;
 			result.push({filename:p.slice(6), id:i})
 		}
 		setList(result)
 	}
 	
 	React.useEffect(() => {
 		refreshOnlineList();
	}, [])

	async function download(filename){
 		const url = await getDownloadURL(ref(storage, 'files/'+filename));
		const df = fs.documentDirectory;
		const arr = (await fs.readDirectoryAsync(df))
		if (arr.includes(filename)) {
			console.log("repeat")
			return
		}
		if (arr.length > 4) return
		await fs.downloadAsync(url, df + filename)
		console.log(filename)
		console.log("Done.")
	}

	return (
		<SafeAreaView>
			<FlatList 
			onRefresh={() => {
				setIsRefreshing(true);
				refreshOnlineList().then(setIsRefreshing(false));
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
							<Button title ={"Download " + item.filename} onPress={()=>{download(item.filename)}} />
						</View>
					}
					/>
				</View>
			}
			/>
		</SafeAreaView>
	)
}


const styles = StyleSheet.create({
  list: {
  	height: "100%",
  },
  item: {
  	borderRadius: 5,
  	borderWidth: 1,
  	margin: 5, 
  	borderColor: '#e0e0e0'
  }
});