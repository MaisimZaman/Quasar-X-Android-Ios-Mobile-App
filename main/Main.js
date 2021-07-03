import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform
} from "react-native";


import Feed from "../screens/Feed";
import SearchScreen from "../screens/SearchScreen";
import CammaraScreen from '../screens/CammaraScreen'

import LikesScreen from "../screens/LikesScreen";



import Profile from "../screens/ProfileScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//import { TabNavigator } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen'
import VideosScreen from "../screens/VideosScreen";




import { Icon } from 'native-base'

import { auth, db } from "../firebase";

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
            <TouchableOpacity onPress={() => console.log("Send message")}>
            <Icon style={{ paddingRight: 10 }} name="ios-send-outline" />
            </TouchableOpacity>
  
  )
           
        }


        const home = {
            navigationOptions: {
                tabBarLabel:"Home Page",
                tabBarIcon: ({ tintColor }) => (
                  <Icon name="home" size={30} color="#900" />
                )
            }
        }

        

        return (
            <Tab.Navigator initialRouteName="Feed" >
            <Tab.Screen name="Feed" component={Feed} navigationOptions={home}/>
            <Tab.Screen name="search" component={SearchScreen} />
            <Tab.Screen name="Add post" component={CammaraScreen} />
            <Tab.Screen name="VideoPage" component={VideosScreen} listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Videos")
                    }})} />
            <Tab.Screen name="ProfileScreen" component={Profile} listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("ProfileScreen", {currentUser: auth.currentUser })
                    }})} />
            </Tab.Navigator>
            
        );
    }
}
export default MainScreen;

const AppTabNavigator = ({

    HomeTab: {
        screen: Feed
    },
    SearchTab: {
        screen: SearchScreen

    },
    AddMediaTab: {
        screen: CammaraScreen
    },
    LikesTab: {
        screen: LikesScreen
    },
    ProfileTab: {
        screen: Profile
    }

}, {
        animationEnabled: true,
        swipeEnabled: true,
        tabBarPosition: "bottom",
        tabBarOptions: {
            style: {
                ...Platform.select({
                    android: {
                        backgroundColor: 'white'
                    }
                })
            },
            activeTintColor: '#000',
            inactiveTintColor: '#d1cece',
            showLabel: false,
            showIcon: true
        }
    })

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});