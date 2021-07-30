import React, {useLayoutEffect, useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { Button, Input } from 'react-native-elements'
import  Icon  from 'react-native-vector-icons/FontAwesome' ;
import { auth, db } from '../../services/firebase';
import { CardItem, Thumbnail, Body, Left, Right, Container} from 'native-base'


export default function AddMore(props) {

    const navigation = props.navigation

    const {addedUsers, chatName, chatId} = props.route.params

    const [searchUsers, setSearchUsers] = useState('')
    const [users, setUsers] = useState([]);
    const [chatMembers, setChatMembers] =  useState(addedUsers);



    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add More friends to "  + chatName,
            
        })
        
    }, [navigation])

    function updateChatMembers(){
        db.collection("chats")
            .doc(chatId)
            .update({
                chatMembers: chatMembers
            })

        navigation.goBack()
    }


    function addChatMember(personInfo){
        if (chatMembers.includes(personInfo.uid) == false){
            setChatMembers(chatMembers => [...chatMembers, personInfo.uid])
        }
        else {
            for( var i = 0; i < chatMembers.length; i++){ 
                                   
                if ( chatMembers[i] === personInfo.uid) { 
                    setChatMembers(chatMembers => [...chatMembers].splice(i))
                }
            }
            

        }
    }

    function fetchUsers(search){
        //console.warn("Function was called")
        db.collection('users')
            .where('displayName', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
        })

 
       
    }

    function renderPerson(item){

        function itemStyle(){
            if (chatMembers.includes(item.uid)){
                return {backgroundColor:'green'} 
                
            }
            else {
                return {backgroundColor:'white'}
            }
        }



                        
        return (
            <View>

            <TouchableOpacity onPress={() => addChatMember(item)}> 
                <CardItem style={itemStyle()}>
            <Left>
                <Thumbnail source={{uri: item.photoURL}} />

                <Body>
                    <Text h5>{item.displayName} </Text>
                    <Text>{item.email}</Text>
                </Body>
            </Left>
            </CardItem>
            </TouchableOpacity> 
        
            </View>
        )


    }

    fetchUsers(searchUsers)

    

    

    return (
        <View style={styles.container}>
            

            <Button  title="Add More Users" onPress={updateChatMembers}></Button>

            <TextInput
                    style={styles.textInput}
                    placeholder="Seach for User..."
                    onChangeText={(searchUsers) => setSearchUsers(searchUsers)} />


            <FlatList
                style={styles.userBox}
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                   renderPerson(item)

                )}/>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 30,
        height: "100%",

    },
    textInput: {
        bottom: -20,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding:25,
        color: "grey",
        borderRadius: 30,

    },
    userBox: {
        bottom: -80,
    }

})


