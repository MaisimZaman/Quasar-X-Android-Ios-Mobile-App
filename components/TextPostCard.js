import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";

import { ListItem } from "react-native-elements/dist/list/ListItem";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'




export default function TextPostCard({id,posterName, PosterId, posterProfilePic, image, caption, navigation, email}){



    return (
        <TouchableOpacity onPress={() => navigation.navigate("Post-Detail", {
            id: id,
            posterName: posterName,
            PosterId: PosterId,
            posterProfilePic: posterProfilePic,
            image: image,
            caption: caption,
            navigation: navigation,
            email: email

        })}>
            <Card style={{width: 230, height: 230}}>
            <CardItem>
            <Left>
                <TouchableOpacity onPress={ () => navigation.navigate("Profile", {currentUser: {
                    displayName: posterName,
                    email: email,
                    photoURL: posterProfilePic,
                    uid: PosterId
                }})}>
                <Thumbnail source={{uri: posterProfilePic}} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <Body>
                    <Text>{posterName} </Text>
                
                </Body>
            </Left>
        </CardItem>
        <CardItem cardBody>
            <Image source={{uri: image}} style={{ height: 200, width: null, flex: 1 }} />
        </CardItem>

        <CardItem>
            <Body>
                <Text>
                    <Text style={{ fontWeight: "900" }}>
                    </Text>
                    {caption}
                </Text>
            </Body>
        </CardItem>
    </Card>
</TouchableOpacity>
         

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});