import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import * as React from 'react'
import * as fs from 'expo-file-system'
import { Audio } from 'expo-av'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { List, Avatar } from 'react-native-paper'
import SeekBar from './SeekBar.js'


export default function Status({name, current, duration, progress, changeCurrent}) {
	return (
		<View style={{height: '12.5%',backgroundColor:'#444'}}>
			<View style={{padding:20}}>
				<SeekBar progress={progress} onChange={changeCurrent} />
			</View>
			<View style={styles.txt_container}>
				<Text style={styles.txt}>{convertTime(current)}</Text>
				<Text style={styles.txt}>-{convertTime(duration)}</Text>
			</View>
		</View>
	)
}

function convertTime(i) {
	return `${Math.floor(i / 60000)}:${Math.floor(i % 60000 / 1000) < 10 ? '0'+Math.floor(i%60000/1000):Math.floor(i%60000/1000)}`
}

const styles = StyleSheet.create({
	txt_container: {
		position: 'absolute',
		top: 45,
		width: '100%', 
		paddingLeft: 15, 
		paddingRight: 15, 
		flexDirection:'row', 
		justifyContent: 'space-between'
	},
	txt: {
		fontSize: 12,
		color: '#999',
		width: 35,
	}
})