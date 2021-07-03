import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';


import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddChat from './screens/AddChat';
import ChatScreen from './screens/ChatScreen';
import CammaraScreen from './screens/CammaraScreen';
import Save from './screens/SaveImage';
import Profile from './screens/ProfileScreen';
import MainScreen from './main/Main';
import EditProfile from './screens/EditProfile';
import PostDetail from './components/PostDetail';
import UpdateProfilePic from './screens/UpdateProfilePic';
import CommentsPage from './screens/CommentsPage';
import VideoScreen from './screens/VideosScreen';
import AddVideo from './screens/AddVideo';
import { Icon } from 'native-base';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer for a long period of time'])


const Stack = createStackNavigator();

var globalScreenOptions = {
  //headerLeft: () => ( <Icon name="ios-camera-outline" style={{ paddingLeft: 10 }} />),
  title: "Quasar X",
  
  headerRight: () => ( 
  
    <TouchableOpacity onPress={() => console.log("Send message")}>
    <Icon style={{ paddingRight: 10 }} name="ios-send-outline" />
    </TouchableOpacity>
   
  
  )

}





export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        
        <Stack.Screen name="Login" component={LoginScreen} sc></Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen}></Stack.Screen>
        <Stack.Screen name="Main" component={MainScreen} options={({ navigation }) => ({
        title: "Quasar X",
  
        headerRight: () => ( 
        
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon style={{ paddingRight: 10 }} name="ios-send-outline" />
          </TouchableOpacity>
         
        
        ),
      })}></Stack.Screen>
        <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
        <Stack.Screen name="AddChat" component={AddChat}></Stack.Screen>
        <Stack.Screen name="Chat" component={ChatScreen}></Stack.Screen>
        <Stack.Screen name="Cammara" component={CammaraScreen}></Stack.Screen>
        <Stack.Screen name="Save" component={Save}></Stack.Screen>
        <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
        <Stack.Screen name="Edit-Profile" component={EditProfile}></Stack.Screen>
        <Stack.Screen name="Update-Profile-Pic" component={UpdateProfilePic}></Stack.Screen>
        <Stack.Screen name="Post-Detail" component={PostDetail}></Stack.Screen>
        <Stack.Screen name="Comments" component={CommentsPage}></Stack.Screen>
        <Stack.Screen name="Videos" component={VideoScreen} options={({ navigation }) => ({
        title: 'Reels',
        headerTransparent: true,
      })}></Stack.Screen>
        <Stack.Screen name="Add-Video" component={AddVideo}></Stack.Screen>
      </Stack.Navigator>

    </NavigationContainer>
  );
}


