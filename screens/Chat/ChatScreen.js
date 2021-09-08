import React, {useLayoutEffect, useState, useEffect} from 'react'
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native'
import { Text } from 'react-native-elements'
import { Avatar } from 'react-native-elements'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { Keyboard } from 'react-native'
import { auth, db } from '../../services/firebase'
import firebase from 'firebase'
import * as ImagePicker from 'expo-image-picker';
import TextPostCard from '../../components/TextPostCard'



export default function ChatScreen({ navigation, route}) {

    const {chatName, id, photo, isDm, members, admin, otherUser} = route.params

    const [input, setInput] = useState("")

    const [messages, setMessages] = useState([])

  

    const [isblocked, setIsBlocked] = useState(false)

    useEffect(() => {

        if (isDm){
           
            db.collection('blockLists')
            .doc(auth.currentUser.uid)
            .collection('userBlocked')
            .doc(otherUser)
            .get().then((doc) => {
                if (doc.exists){
                    setIsBlocked(true)
    
                }
                else {
                    setIsBlocked(false)
                }
            })

        }
       

    }, [isblocked])



    


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
                    <TouchableOpacity onPress={clickChatInfo}>
                        <Avatar rounded source={{
                            uri: photo
                        }}></Avatar>
                    </TouchableOpacity>
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


    async function sendPictureImage(){
    

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1.7, 1],
            quality: 1,
            
        });
    
        if (!result.cancelled) {
            const image =   result.uri;
            const uri = image;
            const childPath = `chat-images/${id}/${auth.currentUser.uid}/${Math.random().toString(36)}`;
        

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
                
                saveImageMessage(snapshot);
                console.log(snapshot)
            })
            }

            const taskError = snapshot => {
                console.log(snapshot)
            }

            task.on("state_changed", taskProgress, taskError, taskCompleted);
        }


        function saveImageMessage(downloadURL){
            db.collection("chats")
            .doc(id)
            .collection('messages')
            .add({
                isPicture: true,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: downloadURL,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL,

            })

        }
    }

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


    function clickChatInfo(){
        if (isDm){
            navigation.navigate("Chat-Members", { navigation: navigation, membersList: members, isDms: true, chatName: '', chatId: id, admin: auth.currentUser.uid, photo: photo})
        }

        else {
            navigation.navigate("Chat-Members", { navigation: navigation, membersList: members, isDms: false, chatName: chatName, chatId: id, admin: admin, photo: photo})

        }
    }


    function renderChatMessageOrImage(id, data){
        if (data.isPicture == true && data.message != ''){

            

            return (
                <>
                <Avatar 
                        position="absolute"
                        rounded
                        bottom={-15}
                        right={-5}
                        size={30}
                        source={{uri: data.photoURL}}
                    ></Avatar>
                <TouchableOpacity onPress={() => navigation.navigate("Chat-Image", {image: data.message})}>

                    <View style={{ width: 200, height: 118}}>
                        <Image source={{uri: data.message}} style={{ width: 200, height: 118}}></Image>
                    </View>
                </TouchableOpacity>

                </>

            )
            

        }

        else if (data.isSharePost == true){
            return (
                <>
                <Avatar 
                        position="absolute"
                        rounded
                        bottom={-15}
                        right={-5}
                        size={30}
                        source={{uri: data.photoURL}}
                ></Avatar>
                <View style={{width: 230, height: 300}}>
                    <TextPostCard
                    id={data.postInfo.id}
                    posterName={data.postInfo.posterName}
                    posterProfilePic={data.postInfo.posterProfilePic}
                    image={data.postInfo.image}
                    caption={data.postInfo.caption}
                    navigation={navigation}
                    email={data.postInfo.posterProfilePic.email}

                    />
                </View>
                </>
            )
        }

        else {

            return (
                <>
                <Avatar 
                    position="absolute"
                    rounded
                    bottom={-15}
                    right={-5}
                    size={30}
                    source={{uri: data.photoURL}}
                ></Avatar>
                <Text style={styles.reciverText}>{data.message}</Text>
            </>

            )
            
        
            
        }
    }

    function renderFooter(){
        if (isblocked){
            return (
                <Text h4>You will not be able to message eachother since you have blocked this user</Text>
            )
        }

        else {
            return (
                <>
                <TouchableOpacity onPress={sendPictureImage}>
                            <Avatar source={{uri: "https://static.thenounproject.com/png/17840-200.png"}} style={{width: 35, height: 35}} />
                        </TouchableOpacity>
                        <TextInput 
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        onSubmitEditing={sendMessage}
                        placeholder="Message.." 
                        style={styles.textInput}
                        
                        ></TextInput>

                        <TouchableOpacity 
                        disabled={input == ""}
                        onPress={sendMessage}
                        >
                            <Ionicons name="send" size={24}  color="#2b68E6"></Ionicons>

                </TouchableOpacity>
                </>
            )
        }
    }

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
                                    {renderChatMessageOrImage(id, data)}
                                </View>
                                ): (
                                <View key={id} style={styles.sender}>
                                    {renderChatMessageOrImage(id, data)}
                                </View>

                            )
                        ))}

                    </ScrollView>

                    <View style={styles.footer}>
                        {renderFooter()}
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
