import React, {useEffect, useLayoutEffect, useState} from 'react'
import {View,  StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import CustomListItem from '../../components/CustomListItem'
import { auth, db } from '../../services/firebase';
import {SimpleLineIcons} from '@expo/vector-icons'
import { Button } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import { CardItem } from 'native-base';
import { Text } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { selectAllUsers } from '../../slices/navSlice';



export default function SendPostMessageScreen(props) {

    const navigation = props.navigation 

    const {id,posterName, PosterId, posterProfilePic, image,caption,  email} = props.route.params;

    const [chats, setChats] = useState([]);
    const [userInfo, setUserInfo] = useState([])
    const [isDms, setIsDms] = useState(true);
    const [selectedChats, setSelectedChats] = useState([])

    const allTheUsers = useSelector(selectAllUsers)

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
  

        setUserInfo(allTheUsers)
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
    
    

    


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Share Post",          
        });
    }, [navigation])


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

    function addChatToShareBox(chatId){
        if (!selectedChats.includes(chatId)){
            setSelectedChats(selectedChats => [...selectedChats, chatId])

        }
        else {
            for( var i = 0; i < selectedChats.length; i++){ 
                                   
                if ( selectedChats[i] === chatId) { 
                    setSelectedChats(selectedChats => [...selectedChats].splice(i))
                }
            }
        }

    }


    function sendPostMessage(){
        
        function sharePost(chatId){
            db.collection('chats')
            .doc(chatId)
            .collection('messages')
            .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                isSharePost: true,
                postInfo: {id: id, posterName: posterName, PosterId: PosterId, posterProfilePic: posterProfilePic, image: image,caption: caption, email: email},
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL,
            })

        }

        selectedChats.forEach(sharePost)

        navigation.goBack()
        

    }

    

    function chatTypeLogic(){
        if (isDms){
            return (
                chats.map(({id, data, otherUser}) => (
                    <TouchableOpacity onPress={() => addChatToShareBox(id)}>
                        <View>
                            <CardItem key={id} bottomDivider style={selectedChats.includes(id) ? {backgroundColor: "#00FF00"} : {backgroundColor: "white"}}>
                                <Avatar 
                                    rounded
                                    source={{
                                        uri: getphotoUrl(otherUser)
                                    }}
                                />
                                <ListItem.Content >
                                    <ListItem.Title style={{fontWeight: "800"}}>
                                        {getDisplayName(otherUser)}
                                    </ListItem.Title>
                
                                </ListItem.Content>
                                
                            </CardItem>
                        </View>


                    </TouchableOpacity>

                
                ))
            )
        }
        else {
            return (
                chats.map(({id, data}) => (
                
                    <TouchableOpacity >
                        <View style={{backgroundColor: "green"}}>
                            <ListItem key={id} bottomDivider>
                                <Avatar 
                                    rounded
                                    source={{
                                        uri: data.photo
                                    }}
                                />
                                <ListItem.Content>
                                    <ListItem.Title style={{fontWeight: "800"}}>
                                        {data.userName}
                                    </ListItem.Title>
                
                                </ListItem.Content>
                            </ListItem>
                        </View>


                    </TouchableOpacity>
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

            <Text h3>Pick a Chat to share with</Text>
            
            <Button title="Send" onPress={sendPostMessage} disabled={selectedChats.length == 0}></Button>
            
            <ScrollView style={styles.container}>
                {chatTypeLogic()}
            </ScrollView>

            <Button title={ButtonName()} onPress={switchChat}/>

            

            
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%"
    }

})


