import React, {useEffect, useState} from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { auth, db } from '../../services/firebase';
import { CardItem, Left, Thumbnail, Body } from 'native-base';
import { Text } from 'react-native-elements';
import  Icon  from 'react-native-vector-icons/FontAwesome' ;
import { Button, Input } from 'react-native-elements';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';


export default function chatMembers(props) {

    const {navigation, membersList, isDms, chatName, chatId, photo} = props.route.params;

 

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

    async function updateGroupPhoto(){
    

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1.7, 1],
            quality: 1,
            
        });
    
        if (!result.cancelled) {
            const image =   result.uri;
            const uri = image;
            const childPath = `group-chat-image/${chatId}/${Math.random().toString(36)}`;
        

            const response = await fetch(uri);
            const blob = await response.blob();

            const task = firebase
                .storage()
                .ref()
                .child(childPath)
                .put(blob);

            const taskProgress = snapshot => {
                console.log(`transferred: ${snapshot.bytesTransferred}`)
            }

            const taskCompleted = () => {
                task.snapshot.ref.getDownloadURL().then((snapshot) => {
                
                saveGroupImage(snapshot);
                console.log(snapshot)
            })
            }

            const taskError = snapshot => {
                console.log(snapshot)
            }

            task.on("state_changed", taskProgress, taskError, taskCompleted);
        }


        function saveGroupImage(downloadURL){
            db.collection("chats")
            .doc(chatId)
            .update({
                groupPhoto: downloadURL

            })

        }
    }

    
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
        

        const thisInfo = getUserData(userid)
    

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
                
                <Text h4>{thisInfo.displayName}</Text>
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
                <View style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 50, paddingRight: 50}}>
                    <Button  title="Add more friends? " onPress={() => navigation.navigate("Add-More", {
                        addedUsers: membersList,
                        chatName: chatName,
                        chatId: chatId
                    })}></Button>
                </View>

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
                <View>
                <Input 
                placeholder='Update Chat Name'
                value={newchatName}
                onChangeText={(text) => setNewChatName(text)}
                onSubmitEditing={updateChatName}
                leftIcon={
                    <Icon name="wechat" type="antdesign" size={24} color="black"/>
                }/>

                <View>
                <Button disabled={newchatName==''} title="Update Chat Name" onPress={updateChatName}></Button>
                </View>
                </View>
                


            )
        }
    }

    function renderLeaveButton(){
        function deleteUser(){

            //const UpdatedList = membersList.splice(membersList.indexOf(auth.currentUser.uid))
            db.collection("chats")
                    .doc(chatId)
                    .update({
                        chatMembers: membersList.splice(membersList.indexOf(auth.currentUser.uid))
                    })
            navigation.replace("Home")

            

            
        }


        if (!isDms){
            return (
                <Button title="Leave Chat" onPress={deleteUser}></Button>
            )
        }
    }

    function renderGroupIcon(){
        if (!isDms){
            return (
                <TouchableOpacity onPress={updateGroupPhoto}>
                    <Avatar 
                    rounded
                    style={{
                        height: 100,
                        width: 100
                    }}
                    source={{
                        uri: photo
                    }}
                    />
                </TouchableOpacity>
            )
        }
    }


    return (
        <View>
            <View style={{flexDirection: "row"}}>
                {renderGroupIcon()}
                {editChatName()}
            </View>
            {renderAddMorePeople()}
            <ScrollView>
                <Text h3>{isDms ? 'Direct Messages with' : 'Group Members'}</Text>
                {rendermembers()}
                
            </ScrollView>
            {renderLeaveButton()}
            
        </View>
    )
}

const styles = StyleSheet.create({})
