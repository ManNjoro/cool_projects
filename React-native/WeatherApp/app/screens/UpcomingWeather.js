import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const DATA = [
          
{
    dt_txt: "2023-02-18 12:00:00",
    main: {
        temp_max: 8.55,
        temp_min: 7.55,
    },
    weather: [
        {
            main: 'Clear'
        }
    ]
},
{
    dt_txt: "2023-02-18 15:00:00",
    main: {
        temp_max: 8.55,
        temp_min: 7.55,
    },
    weather: [
        {
            main: 'Clouds'
        }
    ]
},
{
    dt_txt: "2023-02-18 18:00:00",
    main: {
        temp_max: 8.55,
        temp_min: 7.55,
    },
    weather: [
        {
            main: 'Rain'
        }
    ]
},
          
      
]

const Item = (props) => {
    const { dt_txt, min, max, condition } = props
    return (
        <View>
            
            <Text>{dt_txt}</Text>
            <Text>{min}</Text>
            <Text>{max}</Text>
        </View>
    )
}

function UpcomingWeather(props) {
    return (
        <SafeAreaView>
           <Text>Upcoming Weather</Text>
           <FlatList
           data={DATA}
           renderItem={}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default UpcomingWeather;