import React, {useEffect, useLayoutEffect, useState} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import CustomListItem from '../../components/CustomListItem'
import { auth, db } from '../../services/firebase';
import {SimpleLineIcons} from '@expo/vector-icons'
import { Button } from 'react-native';


export default function HomeScreen({ navigation }) {

    const [chats, setChats] = useState([]);
    const [userInfo, setUserInfo] = useState([])
    const [isDms, setIsDms] = useState(true);
    const [userInfoLoaded, setUserInfoLoaded] = useState(false)
    
  

    

    useEffect(() => {
        function unsubscribeDms(){ 
            db.collection('chats').onSnapshot(snapshot => {
            snapshot.docs.map(doc => {
                if (doc.data().isDM){
                    if (doc.data().users[0] == auth.currentUser.uid){
                        setChats(chats => [...chats, {id: doc.id, data: doc.data(), otherUser: doc.data().users[1]}])

                        
                        
                    }

                    else if (doc.data().users[1] == auth.currentUser.uid){
                        
                        setChats(chats => [...chats, {id: doc.id, data: doc.data(), otherUser: doc.data().users[0]}])

                    
                    }
                }

            })


            
        })

        db.collection('users')
        .onSnapshot((snapshot) => setUserInfo(snapshot.docs.map(doc => ({
            uid: doc.id,
            data: doc.data()
        }))))    
        }

        function unsubscribeGcs(){
            
            
            db.collection('chats').onSnapshot(snapshot => {
                snapshot.docs.map(doc => {
                    if (!doc.data().isDM){
                        
                        var allUsers  = doc.data().chatMembers
                        //console.warn(allUsers)
                       
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

        

        

    }, [isDms])

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

    function enterChat(id, chatName, photo, isDm, members, admin){
        navigation.navigate("Chat", {
            id: id,
            chatName: chatName,
            photo: photo,
            isDm: isDm,
            members: members,
            admin: admin

        })
    }

    function switchChat(){
        if (isDms){
            setChats([])
            setIsDms(false)
        }
        else {
            setChats([])
            setIsDms(true)
        }

    }

    function chatTypeLogic(){
        if (isDms){
            return (
                chats.map(({id, data, otherUser}) => (
                    <CustomListItem key={id} 
                    id={id} 
                    enterChat={enterChat} 
                    photo={getphotoUrl(otherUser)} 
                    userName={getDisplayName(otherUser)} 
                    isDM={true}
                    members={[auth.currentUser.uid, otherUser]}
                    admin={auth.currentUser.uid}
                    />
                ))
            )
        }
        else {
            return (
                chats.map(({id, data}) => (
                
                    <CustomListItem 
                        id={id}
                        enterChat={enterChat}
                        photo={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4apNLOP0befEKu609F8yvMt_f-f7DVjNElhfMU2svKwmHjTCv7l-FNuor2rnCw33By5s&usqp=CAU"}
                        userName={data.chatName}
                        isDM={false}
                        members={data.chatMembers}
                        admin={data.admin}
                    />
                ))

            )
            

        }
    }

    
    function ButtonName(){
        if (isDms){
            return "Groups chats"
        }
        else {
            return "Direct Messages"
        }
    }
   

    return (
        <SafeAreaView>
            
            <Button title={ButtonName()} onPress={switchChat}/>
            <ScrollView style={styles.container}>
                {chatTypeLogic()}
            </ScrollView>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%"
    }

})


