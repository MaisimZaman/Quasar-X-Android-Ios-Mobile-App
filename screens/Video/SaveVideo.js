import React, { useState } from 'react'
import { View, TextInput, Image, Button, Text, StyleSheet, KeyboardAvoidingView, Dimensions } from 'react-native'


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
            }).then((()  => {
                props.route.params.navigation.replace("My-Videos")
            }))
    }

    

    return (
		<View style={styles.container}>
			<TextInput
				value={caption}
                placeholder="Write Your Caption...."
				onChangeText={(caption) => setCaption(caption)}
				style={{ color: "black", fontSize: 22 }}
				multiline={true}
				autoFocus
				selectionColor="black"
			/>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.bottom}>
				<Button title="Post Reel" style={styles.button} appearance="filled" onPress={uploadVideo}>
				</Button>
			</KeyboardAvoidingView>
		</View>
	)

}

const styles = StyleSheet.create({
    textInput: {
        bottom: 0,
        flex: 1,
        marginRight: 15,
       
        padding: 10,
        color: "grey",
        borderRadius: 30,

    },
    container: {
		flex: 1,
		//backgroundColor: "#222B45",
		color: "white",
		padding: 30,
		paddingTop: 80,

		width: Dimensions.get("window").width
	},
	bottom: {
		flex: 1,
		justifyContent: "flex-end",
		marginBottom: 36
	},
	button: {
		marginBottom: 30
	}
})
