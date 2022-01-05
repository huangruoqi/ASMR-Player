
import React, {useState} from 'react';
import {Text, View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Settings(){
  const [date, setDate] = useState(new Date(0));
  const [mode, setMode] = useState('date');

  React.useEffect(() => {
    AsyncStorage.getItem('stop_time').then((res) => {
      setDate(new Date(JSON.parse(res)));
    })
  },[])

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    try{
    	AsyncStorage.setItem('stop_time', JSON.stringify(currentDate)).then(()=>{setDate(currentDate);console.log(currentDate)})
    } catch (e) {
    	console.log(e)
    }
  };

  return (
    <View style={{height:"100%", padding:10,flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
    	<Text style={{fontSize:18}}>  Stop Time: </Text>
    	<View style={{flex:1}}>
	        <DateTimePicker
        		testID="dateTimePicker"
        		value={date}
        		mode={'time'}
        		display="default"
        		onChange={onChange}
	        />
        </View>
        <Button title="stop time" onPress={()=>{AsyncStorage.getItem('stop_time').then(res => console.log(JSON.parse(res)))}}/>
    </View>
  );
};
