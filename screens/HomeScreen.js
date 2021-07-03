import React, {useEffect, useLayoutEffect, useState} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import CustomListItem from '../components/CustomListItem'
import { auth, db } from '../firebase';
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons'


export default function HomeScreen({ navigation }) {

    const [chats, setChats] = useState([]);

    

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
            setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),

            })))
        })

        return unsubscribe;

    }, [])
    
    

    function signOutUser(){
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }


    


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chats",
            headerLeft: () => (
                <View style={{marginLeft: 20}}>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile", {currentUser: auth.currentUser})} activeOpacity={0.5}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }}/>
                    </TouchableOpacity>
                </View>
            ),

            

            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 80,
                    marginRight: 20

                }}>
                    
                    <TouchableOpacity>
                        <AntDesign name="camerao" onPress={() => navigation.navigate("Main")} size={24} color="black"></AntDesign>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("AddChat")}>
                        <SimpleLineIcons name="pencil" size={24} color="black"></SimpleLineIcons>
                    </TouchableOpacity>

                </View>
            )

            


        });
    }, [navigation])

    function enterChat(id, chatName){
        navigation.navigate("Chat", {
            id: id,
            chatName: chatName,

        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({id, data: {chatName}}) => (
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%"
    }

})


