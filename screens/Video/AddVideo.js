import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
//import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import VideoPlayer from '../../components/VideoComponents/VideoPlayer';


export default function AddVideo({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);


  
  const [video, setVideo] = useState(null);
  const [duration ,setDuration] = useState(0)
 

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();

  }, []);


  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setVideo(result.uri);
      setDuration(Math.floor(result.duration / 100));
    }
  };


  function videoLogic(){

    

    if (video != ''){
          return (
              <VideoPlayer
                video={video}
                isPlay={true}
              ></VideoPlayer>
          )
      }
      else {
          return (
              <View>
                  <Image
                    source={{uri: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/23.Videos-512.png'}}
                  >

                  </Image>
              </View>
          )
      }
  }
  
  return (
    <View style={{ flex: 1 }}>

      
      <Button title="Pick Video From Gallery" onPress={() => pickVideo()} />
      <Button title="Record Video" onPress={() => navigation.navigate("Record-Video")} />
      <Button title="Save" onPress={() => navigation.navigate("Save-Video", {video: video})} />
      {videoLogic()}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }

})
