import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    Modal,
    Pressable
} from "react-native";

import { ListItem } from "react-native-elements/dist/list/ListItem";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'
import { auth, db } from "../services/firebase";
import firebase from 'firebase'
import { Avatar } from "react-native-elements/dist/avatar/Avatar";



export default function PostDetail(props){

    const {id,posterName, PosterId, posterProfilePic, image, postDate, caption, navigation, email} = props.route.params;

    const [likesCount, setLikes] = useState([]);
    const [inLikes, setInLikes ] = useState([]);
    const [removeLike, setRemoveLike ] = useState([])
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        db.collection('postLikes')
            .doc(id).collection('usersLiked')
            .onSnapshot((snapshot) => setLikes(snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        }))))

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

    function loadDeleteButton(){
        if (auth.currentUser.uid = PosterId){
            return (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Avatar source={{uri: "https://cdn1.iconfinder.com/data/icons/jumpicon-basic-ui-glyph-1/32/-_Dot-More-Vertical-Menu-512.png"}} style={{ color: 'black', width: 25, height: 25 }} />
                </TouchableOpacity>
            )
        }
    }

    //navigation.navigate("Profile", {currentUser: PosterId})
    return (
        <View>
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Would you like to delete this post? </Text>
            <Pressable
              style={[styles.button, styles.buttonDelete]}
              onPress={() => {
                  db.collection("posts")
                  .doc(PosterId)
                  .collection("userPosts")
                  .doc(id)
                  .delete()

                  //navigation.navigate("Profile", {currentUser: auth.currentUser})
                  props.navigation.goBack()
              }}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


            <Card>
            <CardItem>
            <Left>
                <TouchableOpacity onPress={() => navigation.navigate("Profile", {currentUser: {
                    displayName: posterName,
                    email: email,
                    photoURL: posterProfilePic,
                    uid: PosterId
                }})}>
                <Thumbnail source={{uri: posterProfilePic}} />
                </TouchableOpacity>
                <Body>
                    <Text>{posterName} </Text>
                    
                </Body>

                
            </Left>
            <Right>
                
                {loadDeleteButton()}
                
            </Right>
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
                    PosterId: PosterId,
                    image: image,
                })}>
                    <Icon name="ios-chatbubbles-outline" style={{ color: 'black' }} />
                </Button>
                <Button transparent onPress={() => props.navigation.navigate("Share-Post", {
                    id: id,
                    posterName: posterName,
                    PosterId: PosterId,
                    posterProfilePic: posterProfilePic,
                    image: image,
                    caption: caption,
                    email: email

                })}>
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
    </View>
         

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      buttonDelete: {
        backgroundColor: "#FF0000",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
});