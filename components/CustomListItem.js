import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { auth, db } from '../services/firebase'

export default function CustomListItem({ id, enterChat, photo, userName}){

    //const [chatMessages, setChatMessages] = useState([''])



    useEffect(() => {
        
        
    }, [])



    

    function subTextLogic(){
        
        
            return "No messages yet"

    }


    return (
        <ListItem key={id} onPress={() => enterChat(id, userName, photo)} key={id} bottomDivider>
            <Avatar 
                rounded
                source={{
                    uri: photo
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "800"}}>
                    {userName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {subTextLogic()}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}


const styles = StyleSheet.create({})
