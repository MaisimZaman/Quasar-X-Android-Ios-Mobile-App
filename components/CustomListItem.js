import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { auth, db } from '../services/firebase'

export default function CustomListItem({ id, enterChat, photo, userName, isDM, members, admin }){

    //const [chatMessages, setChatMessages] = useState([''])

    const [lastMessage, setLastMessage] = useState('')



    useEffect(() => {
        const unsubscribe = db.collection('chats')
                .doc(id).collection('messages')
                .orderBy('timestamp')
                .onSnapshot((snapshot) => setLastMessage(snapshot.docs.map(doc => ({
                                id: doc.id,
                                data: doc.data()
                }))))

        return unsubscribe;
        
        
    }, [])



    

    function subTextLogic(){
        
        if (lastMessage.length == 0){
            return "No messages yet"

        }
        else {

            if (lastMessage[lastMessage.length-1].data.email == auth.currentUser.email){
                return "You:" + lastMessage[lastMessage.length-1].data.message

            }
            else {
                return `${lastMessage[lastMessage.length-1].data.displayName}:` + lastMessage[lastMessage.length-1].data.message

            }
            
        }
        

    }


    return (
        <ListItem key={id} onPress={() => enterChat(id, userName, photo, isDM, members, admin)} key={id} bottomDivider>
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
                <ListItem.Subtitle  numberOfLines={1} ellipsizeMode="tail">
                    {subTextLogic()}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}


const styles = StyleSheet.create({})
