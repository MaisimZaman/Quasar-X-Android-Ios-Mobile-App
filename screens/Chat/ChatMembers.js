import React, {useEffect, useState} from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { auth, db } from '../../services/firebase';
import { CardItem, Left, Thumbnail, Body } from 'native-base';
import { Text } from 'react-native-elements';
import  Icon  from 'react-native-vector-icons/FontAwesome' ;
import { Button, Input } from 'react-native-elements';
import * as firebase from 'firebase';


export default function chatMembers(props) {

    const {navigation, membersList, isDms, chatName, chatId, admin} = props.route.params;

 

    const [userData, setUserData] = useState([])
    const [newchatName, setNewChatName] = useState(chatName)

    

    useEffect(() => {
        const unsubscribe = db.collection('users')
        .onSnapshot((snapshot) => setUserData(snapshot.docs.map(doc => ({
            uid: doc.id,
            data: doc.data()
        }))))    

        return unsubscribe
    }, [])


    function getUserData(uid){
        if (userData.length > 0){
            var Info = userData.filter(function(value){
                return value.uid == uid
            })[0].data

            return Info
        }
        else {
            return 'null'
        }


    }


    

    function renderPerson(userid, point){
        
        //var item = userData[point]

        const thisInfo = getUserData(userid)

        //{thisInfo.displayName} {admin === thisInfo.uid ? '(Admin)' : ''}

        return (
            <View>
                <TouchableOpacity
                        onPress={() => navigation.navigate("Profile", {
                            currentUser: thisInfo
                        })}>
            <CardItem>
        <Left>
            <Thumbnail source={{uri: thisInfo.photoURL}} />

            <Body>
                
                <Text h4>{thisInfo.displayName} {admin === thisInfo.uid ? '(Admin)' : ''}</Text>
                <Text>{thisInfo.email}</Text>
            </Body>
        </Left>
        </CardItem>
        </TouchableOpacity>
        </View>
        )


    }

   

    function rendermembers(){

        return (
            membersList.map((userId, index) => {
                return ( renderPerson(userId, index))  
            })
        )
    }

    function renderAddMorePeople(){
        if (!isDms){
            return (
                <Icon name="wechat" type="antdesign" size={24} color="black"/>

            )
        }
    }

    function updateChatName(){
        db.collection("chats")
            .doc(chatId)
            .update({
                chatName: newchatName
            })

        db.collection("chats")
            .doc(chatId)
            .collection("messages")
            .add({
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                message: "changed the name to " + newchatName,
                photoURL: auth.currentUser.photoURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()

            })
            


    }

    function editChatName(){
        if (!isDms){
            return (
                <>
                <Input 
                placeholder='Update Chat Name'
                value={newchatName}
                onChangeText={(text) => setNewChatName(text)}
                onSubmitEditing={updateChatName}
                leftIcon={
                    <Icon name="wechat" type="antdesign" size={24} color="black"/>
                }/>

                <Button disabled={newchatName==''} title="Update Chat Name" onPress={updateChatName}></Button>
                </>


            )
        }
    }

    function renderDeleteButton(){
        function deleteChat(){
            db.collection("chats")
                .doc(chatId)
                .delete()

            navigation.replace("Home")
        }


        if (auth.currentUser.uid == admin){
            return (
                <Button title="Delete chat" onPress={deleteChat}></Button>
            )
        }
    }


    return (
        <View>
            {editChatName()}
            <ScrollView>
                <Text h3>{isDms ? 'Direct Messages with' : 'Group Members'}</Text>
                {rendermembers()}
                
            </ScrollView>
            {renderDeleteButton()}
        </View>
    )
}

const styles = StyleSheet.create({})
