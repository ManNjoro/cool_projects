import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

function UpcomingWeather(props) {
    return (
        <SafeAreaView>
           <Text>Upcoming Weather</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default UpcomingWeather;