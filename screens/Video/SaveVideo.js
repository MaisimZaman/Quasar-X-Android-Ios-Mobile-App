import React, { useState } from 'react'
import { View, TextInput, Image, Button, Text, StyleSheet } from 'react-native'

import firebase from 'firebase'
import {auth, db} from '../../services/firebase'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function SaveVideo(props) {
    const [caption, setCaption] = useState("")

    const video = props.route.params.video;

    

    async function uploadVideo(){
        const uri = props.route.params.video;
        const childPath = `videos/${auth.currentUser.uid}/${Math.random().toString(36)}`;
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
                
                saveVideoData(snapshot)

                
                
                
                
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }


    const saveVideoData = (downloadURL) => {

        db.collection('videos')
            .doc(auth.currentUser.uid)
            .collection("userVideos")
            .add({
                downloadURL,
                caption,
                profilePic: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.goBack()
            }))
    }

    



    return (
        <View style={{ flex: 1 }}>
            
            <TextInput
                style={styles.textInput}
                placeholder="Write a Caption . . ."
                onChangeText={(caption) => setCaption(caption)}
            />

            <Button title="Save" onPress={() => uploadVideo()} />


            

            
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,

    },
})
