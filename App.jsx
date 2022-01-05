import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import * as React from 'react'
import { Audio } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Player from './components/Player.jsx'
import Library from './components/Library.jsx'
import Settings from './components/Settings.jsx'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

Audio.setAudioModeAsync({ staysActiveInBackground: true })

function TabScreen({navigation}) {
  const getOption = ({route}) => ({
    tabBarIcon: ({ focused, color, size}) => {
      let iconName;
      if (route.name == 'Play') {
        iconName = 'musical-notes-outline'
      } else if (route.name == 'Library') {
        iconName = 'ios-list'
      }

      return <Ionicons name={iconName} size = {size} color = {color} />
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
    headerShown:false
  })

  
  return (
    <Tab.Navigator screenOptions={getOption}  >
      <Tab.Screen
        name="Play"
        component={Player}
      />
      <Tab.Screen
        name="Library"
        component={Library}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={TabScreen} options={({navigation}) => ({
                  headerTitle: () => (<Text style={{fontSize:20}}>ASMR_Player</Text>),
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                      <Ionicons name='settings-outline' size={24} />
                    </TouchableOpacity>
                  )
                })} />
        <Stack.Screen name='Settings' component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}