import { Image, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import Screen from './Screen';
import Icon from './Icon';
import colors from '../config/colors';
import { useState } from 'react';

export default function Test() {
  const [imageUri, setImageUri] = useState([])
  const selectImage = async()=> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync()
      if (!result.canceled)
        setImageUri([...imageUri, result.assets[0].uri])
    } catch (error) {
      console.log('Failed to select image',error);
      
    }
  }

  console.log(imageUri);
  
return (
<Screen>
  <View style={styles.main}>
  {
    imageUri.map((uri, index) => (
      <Image key={index} source={{uri: uri}} style={styles.image} />

    ))
  }
  <View style={styles.container}>
    <Icon name='camera' size={80} iconColor='gray' backgroundColor='transparent' onPress={selectImage} />
  </View>
  </View>
</Screen>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.light,
      alignItems: 'center',
      justifyContent:'center',
      width: 100,
      height: 100,
      borderRadius: 10,
      marginHorizontal: 10
    },
    image: {
      width: 100,
      height: 100,
      marginHorizontal: 10,
      borderRadius: 10,
      overflow: 'hidden'
    },
    main:{
      flex: 1,
      flexDirection: 'row'
    }
});