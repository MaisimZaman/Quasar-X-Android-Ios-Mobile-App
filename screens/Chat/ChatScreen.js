import React, {useLayoutEffect, useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { Keyboard } from 'react-native'
import { auth, db } from '../../services/firebase'
import * as firebase from 'firebase'


export default function ChatScreen({ navigation, route}) {

    const {chatName, id, photo} = route.params

    const [input, setInput] = useState("")

    const [messages, setMessages] = useState([])

    


    useLayoutEffect(() => {
        navigation.setOptions({
            title: chatName,
            headerBackTitleVisible: true,
            headerTitleAlgin: "left",
            headerTitle: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <Avatar rounded source={{
                        uri: photo
                    }}></Avatar>
                    <Text
                        style={{ color: "black", marginLeft: 10, fontWeight: "700"}}
                    >{chatName}</Text>
                </View>
            ),

            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 10}}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft" size={24} color="black"></AntDesign>
                </TouchableOpacity>
            ),

            headerRight: () => (
                <View 
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 80,
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="black"></FontAwesome>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="black"></Ionicons>
                    </TouchableOpacity>
                </View>
            )

        })

    }, [navigation, messages])

    function sendMessage(){
        Keyboard.dismiss()

        db.collection('chats')
        .doc(id)
        .collection('messages')
        .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
        })

        setInput('')


    }

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats')
                            .doc(id).collection('messages')
                            .orderBy('timestamp')
                            .onSnapshot((snapshot) => setMessages(snapshot.docs.map(doc => ({
                                id: doc.id,
                                data: doc.data()
                            }))))

        return unsubscribe;
    }, [route])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white"}}>
            <StatusBar style="light"></StatusBar>
        
            
            
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding": "height"}
                style={styles.container}
                keyboardVerticalOffset={100}
            >
                <>
                    <ScrollView contentContainerStyle={{ paddingTop: 20}}>
                        {messages.map(({id, data}) => (
                            data.email === auth.currentUser.email ? (
                                <View key={id} style={styles.reciver}>
                                    <Avatar 
                                        position="absolute"
                                        rounded
                                        bottom={-15}
                                        right={-5}
                                        size={30}
                                        source={{uri: data.photoURL}}
                                    ></Avatar>
                                    <Text style={styles.reciverText}>{data.message}</Text>
                                </View>
                            ): (
                                <View key={id} style={styles.sender}>
                                    <TouchableOpacity onPress={() => navigation.navigate("Profile", {currentUser: data})}>
                                    <Avatar 
                                        position="absolute"
                                        rounded
                                        bottom={-15}
                                        right={-5}
                                        size={30}
                                        source={{uri: data.photoURL}}

                                    ></Avatar>
                                    </TouchableOpacity>
                                    <Text style={styles.senderText}>{data.message}</Text>
                                    <Text style={styles.senderName}>{data.displayName}</Text>
                                </View>

                            )
                        ))}

                    </ScrollView>

                    <View style={styles.footer}>
                        <TextInput 
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        onSubmitEditing={sendMessage}
                        placeholder="Message.." 
                        style={styles.textInput}
                        
                        ></TextInput>

                        <TouchableOpacity 
                        onPress={sendMessage}
                        >
                            <Ionicons name="send" size={24}  color="#2b68E6"></Ionicons>

                        </TouchableOpacity>

                    </View>
                </>
                


            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    textInput: {
        bottom: 0,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,

    },

    reciverText: {
        color: "black",
        fontWeight: "500",
        marginLeft: 10,


    },

    senderText: {
        color: "white",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15,

    },

    reciver: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative",

    },

    sender: {
        padding: 15,
        backgroundColor: "#2B68E6",
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: "relative",

    },

    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "white",
        

    },

    

})
