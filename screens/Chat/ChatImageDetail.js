import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'

export default function ChatImageDetail(props) {

    const {image} = props.route.params

    return (
        <View >
            <Image source={{uri: image}} style={{width: 320, height: 300, top: 200, left: 10}}></Image>
        </View>
    )
}

const styles = StyleSheet.create({})
