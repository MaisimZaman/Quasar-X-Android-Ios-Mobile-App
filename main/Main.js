import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform, 
    Image
} from "react-native";


import Feed from "../screens/Post/Feed";
import SearchScreen from "../screens/Search/SearchScreen";
import CammaraScreen from '../screens/Post/CammaraScreen'

import LikesScreen from "../screens/Profile/LikesScreen";



import Profile from "../screens/Profile/ProfileScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//import { TabNavigator } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/Chat/HomeScreen'
import VideosScreen from "../screens/Video/VideosScreen";





import { Icon } from 'native-base'

import { auth, db } from "../services/firebase";

const Tab = createBottomTabNavigator();




class MainScreen extends Component {

    

    static navigationOptions = {

        eaderLeft: <Icon name="ios-camera-outline" style={{ paddingLeft: 10 }} />,
        title: "Instagram",
        headerRight: <Icon style={{ paddingRight: 10 }} name="ios-send-outline" />
    }

    

    render() {

        
        const navigationOptions = {
            headerLeft: () => ( <Icon name="ios-camera-outline" style={{ paddingLeft: 10 }} />),
            title: "Quasar X",
            headerRight: () => ( 
            <TouchableOpacity>
            <Icon style={{ paddingRight: 10 }} name="ios-send-outline" />
            </TouchableOpacity>
  
  )
           
        }


        

        

        return (
            <Tab.Navigator initialRouteName="Feed" >
                <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            title: 'Feed',
            tabBarIcon: ({size,focused,color}) => {
              return (
                <Image
                  style={{ width: size, height: size }}
                  source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8tGTHWbVwg_QkkiPZgpOultJVzewuWHW7h0zoGf8yOKbhG3fw0yUILkVLdTbgkwPrdiA&usqp=CAU"}}
                />
              );
            },
          }}
        />
            <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Search',
            tabBarIcon: ({size,focused,color}) => {
              return (
                <Image
                  style={{ width: size, height: size }}
                  source={{uri: "https://icon-library.com/images/search-512_113822.png"}}
                />
              );
            },
          }}
        />
            <Tab.Screen
          name="Add-Post"
          component={CammaraScreen}
          options={{
            title: 'Add Post',
            tabBarIcon: ({size,focused,color}) => {
              return (
                <Image
                  style={{ width: size, height: size }}
                  source={{
                    uri:
                      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
                  }}
                />
              );
            },
          }}
        />
            <Tab.Screen name="VideoPage" component={VideosScreen} listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Explore-Videos")
                    }})}  options={{
                        title: 'Reels',
                        tabBarIcon: ({size,focused,color}) => {
                          return (
                            <Image
                              style={{ width: size, height: size }}
                              source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhyKmCqytnpEQ1FCnDtlYN0iaxbvzQs00oTA&usqp=CAU"}}
                            />
                          );
                        },
                      }}/>
            <Tab.Screen name="ProfileScreen" component={Profile} listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("ProfileScreen", {currentUser: auth.currentUser })
                    }})} options={{
                        title: 'Profile',
                        tabBarIcon: ({size,focused,color}) => {
                          return (
                            <Image
                              style={{ width: size, height: size }}
                              source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhW94rFDtZYbBPiRpNq67CABGAlY1mmNmZWA&usqp=CAU"}}
                            />
                          );
                        },
                      }}/>
            </Tab.Navigator>
            
        );
    }
}
export default MainScreen;

