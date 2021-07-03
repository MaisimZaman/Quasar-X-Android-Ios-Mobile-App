import React, {useLayoutEffect, useState} from 'react'
import {View, Text, StyleSheet } from 'react-native'
import { Button, Input } from 'react-native-elements'
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { auth, db } from '../firebase';

export default function AddChat({ navigation }) {

    const [input, setInput] = useState('');



    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a new chat",
            
        })
        
    }, [navigation])

    async function createChat(){
        await db.collection('chats').add({
            chatName: input,

        }).then(() => {
            navigation.goBack()
        }).catch(error => alert(error))

        
        
    }

    

    

    return (
        <View style={styles.container}>
            <Input 
                placeholder='Enter a chat name'
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={createChat}
                leftIcon={
                    <Icon name="wechat" type="antdesign" size={24} color="black"/>
                }

            />

            <Button disabled={input==''} title="Create New Chat" onPress={createChat}></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 30,
        height: "100%",

    }

})


