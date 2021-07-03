import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";

import { ListItem } from "react-native-elements/dist/list/ListItem";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'
import { auth, db } from "../firebase";
import firebase from 'firebase'



export default function PostDetail(props){

    const {id,posterName, PosterId, posterProfilePic, image, postDate, caption, likes} = props.route.params;

    const [likesCount, setLikes] = useState([]);
    const [inLikes, setInLikes ] = useState([]);
    const [removeLike, setRemoveLike ] = useState([])


    useEffect(() => {
        db.collection('postLikes')
            .doc(id).collection('usersLiked')
            .onSnapshot((snapshot) => setLikes(snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
            }))))

    }, [inLikes])


    useEffect(() => {
    
        db.collection('postLikes').doc(id).collection('usersLiked')
            .where('userId', '==', auth.currentUser.uid)
            .get()
            .then((snapshot) => {
                let likers = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
            });
            setInLikes(likers)
            
        })

        

        
    }, [inLikes])

    function addLike(){
        db.collection('postLikes')
        .doc(id)
        .collection('usersLiked')
        .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: auth.currentUser.uid,

        })

    }

    function deleteLike(){
        db.collection('postLikes')
        .doc(id)
        .collection('usersLiked')
        .doc(inLikes[0].id)
        .delete()


    }


    function likesRender(){
        if (inLikes.length == 0){
            return (
                <Button transparent onPress={() => addLike()}>
                <Icon name="ios-heart-outline" style={{ color: 'black' }} />
                </Button>
            )
        }
        else {
            return (
                <Button transparent onPress={() => deleteLike()}>
                <Icon  name="ios-heart" style={{ color: 'red' }} />
                </Button>
            )
        }
    }


    return (
        
        <Card>
        <CardItem>
        <Left>
            <TouchableOpacity onPress={() => props.navigation.navigate("Profile", {currentUser: PosterId})}>
            <Thumbnail source={{uri: posterProfilePic}} />
            </TouchableOpacity>
            <Body>
                <Text>{posterName} </Text>
                <Text note>21</Text>
            </Body>
        </Left>
    </CardItem>
    <CardItem cardBody>
        <Image source={{uri: image}} style={{ height: 300, width: null, flex: 1 }} />
    </CardItem>
    <CardItem style={{ height: 45 }}>
        <Left>
                {likesRender()}
        
            <Button transparent onPress={() => props.navigation.navigate("Comments", {
                posterProfilePic: posterProfilePic,
                posterUserName: posterName,
                posterCaption: caption,
                postId: id,
            })}>
                <Icon name="ios-chatbubbles-outline" style={{ color: 'black' }} />
            </Button>
            <Button transparent>
                <Icon name="ios-send-outline" style={{ color: 'black' }} />
            </Button>


        </Left>
    </CardItem>

    <CardItem style={{ height: 20 }}>
        <Text>{likesCount.length}</Text>
    </CardItem>
    <CardItem>
        <Body>
            <Text>
                <Text style={{ fontWeight: "900" }}>
                </Text>
                {caption}
            </Text>
        </Body>
    </CardItem>
</Card>
         

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});