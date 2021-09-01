
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import { Audio } from "expo-av";
import { Button } from "react-native";
import { ImageEditor } from 'expo-image-editor';
import * as ImagePicker from 'expo-image-picker';
const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);


export default function AddVideo({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
 
  

  
  const cameraRef = useRef();
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      await Audio.requestPermissionsAsync();
      setHasPermission(status === "granted");

      const {status2 } = await ImagePicker.requestCameraRollPermissionsAsync();
      setHasGalleryPermission(status2 === "granted")
      


      
    })();
  }, []);


  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true
      
    });
    //console.log(result);

    if (!result.cancelled) {
      setIsPreview(true)
      setVideoSource(result.uri);
      
    }
      
      
  
};


  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            setIsPreview(true);
            console.log("video source", source);
            setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };


  const stopVideoRecording = () => {
    if (cameraRef.current) {
      setIsPreview(false);
      setIsVideoRecording(false);
      cameraRef.current.stopRecording();
    }
  };
  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const cancelPreview = async () => {
    //await cameraRef.current.resumePreview();
    setVideoSource(null);
    setIsPreview(false);
    
  };

  const goBackToOrig = async () => {
      await navigation.navigate("Save-Video", {video: videoSource})
  }

  
  const renderCancelPreviewButton = () => (
    <>
    <TouchableOpacity onPress={cancelPreview} style={styles.closeButton}>
      <View style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} />
      <View
        style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
      />
    </TouchableOpacity>

    {renderCancelDoneButton()}
    </>
  );

  const renderCancelDoneButton = () => {

    if (videoSource != null){
      return (
        <Button title="Upload video" onPress={goBackToOrig}>

      </Button>

      )
    }

    
    
    
  };
  const renderVideoPlayer = () => (
    <Video
      source={{ uri: videoSource }}
      shouldPlay={true}
      style={styles.media}
    />
  );


  const renderVideoRecordIndicator = () => (
    <View style={styles.recordIndicatorContainer}>
      <View style={styles.recordDot} />
      <Text style={styles.recordTitle}>{"Recording..."}</Text>
    </View>
  );


  const renderCaptureControl = () => (
    <View style={styles.control}>
      <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
        <Text style={styles.text}>{"Flip"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onPress={isVideoRecording ? stopVideoRecording : recordVideo}
        style={styles.capture}
      />
      <TouchableOpacity  onPress={pickVideo}>
        <Image style={{width: 40, height: 40}} source={require("../../services/assets/icons/gallary.png")}></Image>
      </TouchableOpacity>
    </View>
  );


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  function loadCammara(){
    if (videoSource == null){
      return (
        <Camera
        ref={cameraRef}
        style={styles.container}
        type={cameraType}
        //flashMode={Camera.Constants.FlashMode.on}
        onCameraReady={onCameraReady}
        onMountError={(error) => {
          console.log("cammera error", error);
        }}
      />
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {loadCammara()}
      <View style={styles.container}>
        {isVideoRecording && renderVideoRecordIndicator()}
        {videoSource && renderVideoPlayer()}
        {isPreview && renderCancelPreviewButton()}
        {!videoSource && !isPreview && renderCaptureControl()}
      </View>
    
      
    
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: "absolute",
    top: 35,
    left: 15,
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c4c5c4",
    opacity: 0.7,
    zIndex: 2,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
    
  },
  closeCross: {
    width: "68%",
    height: 1,
    backgroundColor: "black",
  },
  control: {
    position: "absolute",
    flexDirection: "row",
    bottom: 38,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  capture: {
    backgroundColor: "#f5f6f5",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },
  text: {
    color: "#fff",
  },
});





