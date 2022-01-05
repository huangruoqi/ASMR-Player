import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import * as React from 'react'
import * as fs from 'expo-file-system'
import { Audio } from 'expo-av'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { List, Avatar } from 'react-native-paper'
import SeekBar from './SeekBar.js'


export default function Status({name, current, duration, progress, changeCurrent}) {
	return (
		<View>
			<SeekBar progress={progress} onChange={changeCurrent} />
			<View>
				<Text>{name}</Text>
				<Text>{current}/{duration}</Text>
			</View>
		</View>
	)
}
