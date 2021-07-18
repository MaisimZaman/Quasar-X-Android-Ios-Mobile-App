import React, {useEffect, useLayoutEffect, useState} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import CustomListItem from '../../components/CustomListItem'
import { auth, db } from '../../services/firebase';
import {SimpleLineIcons} from '@expo/vector-icons'


export default function HomeScreen({ navigation }) {

    const [chats, setChats] = useState([]);
    const [userInfo, setUserInfo] = useState([])
    const [isDms, setIsDms] = useState(true);
    
  

    

    useEffect(() => {
        function unsubscribeDms(){ 
            db.collection('chats').onSnapshot(snapshot => {
            snapshot.docs.map(doc => {
                if (doc.data().isDM == true){
                    if (doc.data().users[0] == auth.currentUser.uid){
                        setChats(chats => [...chats, {id: doc.id, data: doc.data(), otherUser: doc.data().users[1]}])
                        db.collection("users").doc(doc.data().users[1]).get().then((doc) => {
                            setUserInfo(userInfo => [...userInfo, {uid: doc.id,  data: doc.data()}]
                            )
                            
                        })
                        
                    }

                    else if (doc.data().users[1] == auth.currentUser.uid){
                        setChats(chats => [...chats, {id: doc.id, data: doc.data(), otherUser: doc.data().users[0]}])
                        db.collection("users").doc(doc.data().users[0]).get().then((doc) => {
                            setUserInfo(userInfo => [...userInfo, {uid: doc.id,  data: doc.data()}]
                            )
                            
                        })
                    }
                }

            })


            
        })}


        async function unsubscribeGcs(){
            await db.collection('chats').onSnapshot(snapshot => {
                snapshot.docs.forEach(doc => {
                    if (doc.data().isDM == false){
                        var allUsers  = doc.data().users
                        if (allUsers.includes(auth.currentUser.uid)){
                            setChats(chats => [...chats, {id: doc.id, data: doc.data()}])

                        }
                    }
                })
            })
        }

        if (isDms){
            unsubscribeDms()

        }

        else {
            unsubscribeGcs()
        }

        

        

    }, [])

    function getphotoUrl(uid){

        //return JSON.stringify(userInfo[0])


        if (userInfo.length > 0){
            var picInfo = userInfo.filter((value) =>{
                return value.uid == uid
            })[0].data.photoURL

            
    
    
    
            
         
            return picInfo

        }
        else {
            return 'null'
        }
    }

    function getDisplayName(uid){

        //return JSON.stringify(userInfo[0])

     
    
        if (userInfo.length > 0){
            var nameInfo = userInfo.filter((value) =>{
                return value.uid == uid
            })[0].data.displayName


            console.log("this is the display name" + nameInfo)




            return nameInfo
        }
        else {
            return 'null'
        }


    }
    
    

    function signOutUser(){
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }


    


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chats",          

            

            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 80,
                    marginRight: 20

                }}>
                    
                <View style={{marginLeft: 20}}>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile", {currentUser: auth.currentUser})} activeOpacity={0.5}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }}/>
                    </TouchableOpacity>
                </View>

                    <TouchableOpacity onPress={() => navigation.navigate("AddChat")}>
                        <SimpleLineIcons name="pencil" size={24} color="black"></SimpleLineIcons>
                    </TouchableOpacity>

                </View>
            )

            


        });
    }, [navigation])

    function enterChat(id, chatName, photo){
        navigation.navigate("Chat", {
            id: id,
            chatName: chatName,
            photo: photo

        })
    }

    return (
        <SafeAreaView>
           
            <ScrollView style={styles.container}>
                {chats.map(({id, data, otherUser}) => (
                    <CustomListItem key={id} id={id} enterChat={enterChat} photo={getphotoUrl(otherUser)} userName={getDisplayName(otherUser)}/>
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


