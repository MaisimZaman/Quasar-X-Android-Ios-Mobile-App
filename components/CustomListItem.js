import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { auth, db } from '../firebase'

export default function CustomListItem({ id, chatName, enterChat}){

    const [chatMessages, setChatMessages] = useState(['yo'])



    useEffect(() => {
        const unsubscribe = db.collection('chats')
                            .doc(id).collection('messages')
                            .orderBy('timestamp')
                            .onSnapshot((snapshot) => setChatMessages(snapshot.docs.map(doc => ({
                                id: doc.id,
                                data: doc.data()
                            }))))

        return unsubscribe;
        
    }, [])



    function uriLogic(){
        const defaultImage = 'https://d1w8cc2yygc27j.cloudfront.net/-2291064301122165519/-6907002593267796194.jpg'

        if (chatMessages != []){
            //const final = chatMessages[0].photoURL
            return defaultImage
        }
        else {
            return defaultImage
        }
    }

    function subTextLogic(){
        if (chatMessages[0].message){
            return `${chatMessages[0].displayName}: ${chatMessages[0].message}`
        }
        else {
            return "No messages yet"
        }

    }


    return (
        <ListItem key={id} onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
            <Avatar 
                rounded
                source={{
                    uri: uriLogic()
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "800"}}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {subTextLogic()}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}


const styles = StyleSheet.create({})
