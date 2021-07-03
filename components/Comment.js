import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'

export default function Comment({ProfilePic, userName, comment}) {
    return (
        <View>
            <CardItem>
        <Left>
            <Thumbnail source={{uri: ProfilePic}} />

            <Body>
                <Text h5>{userName} </Text>
                <Text>{comment}</Text>
            </Body>
        </Left>
        </CardItem>
        </View>
    )
}

const styles = StyleSheet.create({})
