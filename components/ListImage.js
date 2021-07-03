
import React from 'react';
import {View, Text, StyleSheet, Image,TouchableOpacity} from 'react-native';
//import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import theme from './themes/index';
import { ListItem, Avatar } from 'react-native-elements'



export default function ListImage({image}){

    console.log("Under this is image")
    console.log(image)


    return (
        <View> 
        <Image 
            source={{uri: image.data.downloadURL}}
            style={styles.galleryImage}
        />

        <Text>{image.data.caption}</Text>

        
        </View>
      
        
  
      
    )
}


const styles = StyleSheet.create({
    galleryContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.l,
    },
    galleryText: {
      ...theme.textVariants.body3,
      color: theme.colors.gray,
    },
    galleryImage: {
      height: theme.imageHeight.l,
      width: theme.imageHeight.l,
      margin: 1,
    }
  })