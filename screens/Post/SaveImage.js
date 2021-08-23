import React, { useState } from 'react'
import { View, TextInput, Image, Button,  Text, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native'
//import { Button } from "@ui-kitten/components"

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
		<View style={styles.container}>
			<TextInput
				value={caption}
                placeholder="Write Your Caption...."
				onChangeText={(caption) => setCaption(caption)}
				style={{ color: "black", fontSize: 22 }}
				multiline={true}
				autoFocus
				selectionColor="#fff"
			/>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.bottom}>
				<Button title="Post" style={styles.button} appearance="filled" onPress={() => uploadImage(false)}>
				</Button>
                <Button title="Set as Story" style={styles.button} appearance="filled" onPress={() => uploadImage(true)}>
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
