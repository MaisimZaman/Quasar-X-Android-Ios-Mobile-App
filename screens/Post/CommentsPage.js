import React, {useState, useLayoutEffect, useEffect} from 'react'
import { View, TouchableOpacity, StyleSheet,SafeAreaView } from 'react-native'
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'
import { auth, db } from "../../services/firebase";
import Comment from '../../components/Comment';
import { KeyboardAvoidingView } from 'react-native'
import { Keyboard } from 'react-native';
import * as firebase from 'firebase'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-elements';



export default function CommentsPage(props) {

    const {posterProfilePic, posterUserName, posterCaption, postId, PosterId, image} = props.route.params;

    const [commentText, setCommentText] = useState('')

    const [comments, setComments] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('comments')
                .doc(postId).collection('postComments')
                .orderBy('timestamp')
                .onSnapshot((snapshot) =>  setComments(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                }))))

        return unsubscribe;
    }, [props.route])

    function makeComment(){
        //Keyboard.dismiss()

        db.collection('comments')
        .doc(postId)
        .collection('postComments')
        .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            comment: commentText,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
        })


        
        db.collection("notifications").doc(PosterId).set({null: "null"})

        db.collection("notifications")
        .doc(PosterId)
        .collection("userNotifications")
        .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            commenterId: auth.currentUser.uid,
            type: "comment",
            caption: posterCaption,
            postId: postId,
            comment: commentText,
            image: image,
            profilePicture: auth.currentUser.photoURL,
            commenterName: auth.currentUser.displayName,

        })

     

        setCommentText('')


    }

    function renderComments(){
        return (
            comments.map(({id, data}) => (
                <Comment
                    key={id}
                    ProfilePic={data.photoURL}
                    userName={data.displayName}
                    comment={data.comment}
                ></Comment>
            ))
        )
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white"}}>
            <KeyboardAvoidingView>
                <CardItem>
                <Left>
                <Thumbnail source={{uri: posterProfilePic}} />

                <Body>
                    <Text>{posterUserName} </Text>
                    <Text>{posterCaption}</Text>
                </Body>
                </Left>
            </CardItem>
            <Text>{`${comments.length} total comments`}</Text>
            <Text h3>Comments: </Text>
            <ScrollView>
            
                {renderComments()}

            </ScrollView>
            
            <View style={styles.footer}>
            <TextInput 
                value={commentText}
                style={styles.textInput}
                onChangeText={(text) => setCommentText(text)}
                onSubmitEditing={makeComment}
                placeholder="Comment.." 
                            
            ></TextInput>

            <TouchableOpacity 
                    onPress={() => {
                        if (commentText != ''){
                            makeComment()
                        }
                    }}
                    >
                <Ionicons name="send" size={24}  color="#2b68E6"></Ionicons>

            </TouchableOpacity>
            </View>


            

            

            
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
        padding: 3
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

    

    

})

