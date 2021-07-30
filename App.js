import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/authentication/LoginScreen';
import RegisterScreen from './screens/authentication/RegisterScreen';
import HomeScreen from './screens/Chat/HomeScreen';
import AddChat from './screens/Chat/AddChat';
import ChatScreen from './screens/Chat/ChatScreen';
import CammaraScreen from './screens/Post/CammaraScreen';
import Save from './screens/Post/SaveImage';
import Profile from './screens/Profile/ProfileScreen';
import MainScreen from './main/Main';
import EditProfile from './screens/Profile/EditProfile';
import PostDetail from './components/PostDetail';
import UpdateProfilePic from './screens/Profile/UpdateProfilePic';
import CommentsPage from './screens/Post/CommentsPage';
import VideoScreen from './screens/Video/VideosScreen';
import AddVideo from './screens/Video/AddVideo';
import followingScreen from './screens/Profile/followingScreen';
import StoryScreen from './screens/Profile/StoryScreen';
import SaveVideo from './screens/Video/SaveVideo';
import MyVideoScreen from './screens/Video/MyVideos';
import RecVideo from './screens/Video/RecVideo';
import NotificationScreen from './screens/Profile/NotificationScreen';
import VideoComments from './components/VideoComponents/VideoComments';
import chatMembers from './screens/Chat/ChatMembers';
import AddMore from './screens/Chat/AddMore';
import VideoExplore from './screens/Video/VideoExplore';
import { Icon } from 'native-base';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer for a long period of time'])


const Stack = createStackNavigator();

var globalScreenOptions = {
  //headerLeft: () => ( <Icon name="ios-camera-outline" style={{ paddingLeft: 10 }} />),
  title: "Quasar X",

}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        
        <Stack.Screen name="Login" component={LoginScreen} sc></Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen}></Stack.Screen>
        <Stack.Screen name="Main" component={MainScreen} options={({ navigation }) => ({
        title: "Quasar X",

        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Image style={{ paddingLeft: 20, width: 25, height: 25 }} source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcXrDYIdCrdQoXJZCETkOEUsuKoAo-DfJ14A&usqp=CAU"}} />
          </TouchableOpacity>

        ),
  
        headerRight: () => ( 
        
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon style={{ paddingRight: 10 }} name="ios-send-outline" />
          </TouchableOpacity>
         
        
        ),

      })}></Stack.Screen>
        <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
        <Stack.Screen name="AddChat" component={AddChat}></Stack.Screen>
        <Stack.Screen name="Chat" component={ChatScreen}></Stack.Screen>
        <Stack.Screen name="Cammara" component={CammaraScreen} options={({ navigation }) => ({
          title: 'Post Something',
          headerTintColor: '#ffffff',
          headerTransparent: true,
      })}></Stack.Screen>
        <Stack.Screen name="Save" component={Save}></Stack.Screen>
        <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
        <Stack.Screen name="Following-Page" component={followingScreen}></Stack.Screen>
        <Stack.Screen name="Edit-Profile" component={EditProfile}></Stack.Screen>
        <Stack.Screen name="Update-Profile-Pic" component={UpdateProfilePic}></Stack.Screen>
        <Stack.Screen name="Post-Detail" component={PostDetail}></Stack.Screen>
        <Stack.Screen name="Comments" component={CommentsPage}></Stack.Screen>
        <Stack.Screen name="Video-Comments" component={VideoComments}></Stack.Screen>
        <Stack.Screen name="Story-Screen" component={StoryScreen}></Stack.Screen>
        <Stack.Screen name="Chat-Members" component={chatMembers}></Stack.Screen>
        <Stack.Screen name="Videos" component={VideoScreen} options={({ navigation }) => ({
          title: 'Reels',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Add-Video")}>
              <Icon name="ios-camera-outline" style={{ paddingLeft: 10 }} />
            </TouchableOpacity> 
            ),  
          headerTintColor: '#ffffff',
    
          headerTransparent: true,
      })}></Stack.Screen>
        <Stack.Screen name="Add-Video" component={AddVideo}></Stack.Screen>
        <Stack.Screen name="Save-Video" component={SaveVideo}></Stack.Screen>
        <Stack.Screen name="Add-More" component={AddMore}></Stack.Screen>
        <Stack.Screen name="Record-Video" component={RecVideo} options={({ navigation }) => ({
          title: 'Record',

      })}></Stack.Screen>
        <Stack.Screen name="My-Videos" component={MyVideoScreen} options={({ navigation }) => ({
          title: 'Your Reels',
          headerTintColor: '#ffffff',
          headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Add-Video")}>
            <Icon name="ios-camera-outline" style={{ paddingLeft: 10 }} />
          </TouchableOpacity> 
          ),
          headerTransparent: true,
      })}></Stack.Screen>

    <Stack.Screen name="Explore-Videos" component={VideoExplore} options={({ navigation }) => ({
          title: 'Explore Reels',
          headerTintColor: '#ffffff',
          headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Add-Video")}>
            <Icon name="ios-camera-outline" style={{ paddingLeft: 10 }} />
          </TouchableOpacity> 
          ),
          headerTransparent: true,
      })}></Stack.Screen>
      <Stack.Screen name="Notifications" component={NotificationScreen} options={({ navigation }) => ({
          title: 'Your Notifications',
         
      })}/>
        
      </Stack.Navigator>

    </NavigationContainer>
  );

}


