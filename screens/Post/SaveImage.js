import React, { useState } from 'react'
import { View, TextInput, Image, Button, Text, StyleSheet } from 'react-native'

import firebase from 'firebase'
import {auth, db} from '../../services/firebase'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function Save(props) {
    const [caption, setCaption] = useState("")

    const picture = props.route.params.image;

    

    async function uploadImage(isStory){
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)

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
                if (isStory){
                    saveStoryData(snapshot)

                }
                else {
                    savePostData(snapshot);

                }
                
                
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    async function saveStoryData(downloadURL){
        await db.collection("stories").add({
            user: auth.currentUser.uid,
            downloadURL: downloadURL,
            creation: firebase.firestore.FieldValue.serverTimestamp()

        })

    }

    const savePostData = async (downloadURL)  => {

        await db.collection('posts')
            .doc(auth.currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.goBack()
            }))
        props.navigation.goBack()
    }

    



    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: picture }} />
            
            <TextInput
                style={styles.textInput}
                placeholder="Write a Caption . . ."
                onChangeText={(caption) => setCaption(caption)}
            />

            <Button title="Save" onPress={() => uploadImage(false)} />

            <Button title="Add to Story" onPress={() => uploadImage(true)} />

            <Image source={{ uri: picture }} />

            
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        bottom: 0,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,

    },
})
