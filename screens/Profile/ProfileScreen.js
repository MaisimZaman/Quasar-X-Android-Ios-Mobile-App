import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    //TouchableOpacity,
} from "react-native";
import ListImage from '../../components/ListImage'
import theme from '../../components/themes'
import firebase from 'firebase'
import {Avatar} from 'react-native-elements'
require('firebase/firestore')

import { auth, db } from '../../services/firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Container, Content, Icon, Header, Left, Body, Right, Segment, Button } from 'native-base'

var { height, width } = Dimensions.get('window');



export default function Profile(props) {
    const [userPosts, setUserPosts] = useState([]); 
    const [user, setUser] = useState("");
    const [followingMatch, setFollowing] = useState([]);
    const [followingLength, setFollowingLength] = useState([]);
    const [needToMake, setNeedToMake] = useState(true);
    const [followingCount, setFollowingCount] = useState(0);
    const navigation = props.navigation;
    const profile = props.route.params.currentUser;
    //const [profilePicture, setProfilePicture] = useState("") 

    const  currentUser  = props.route.params.currentUser.uid

    useEffect(() => {
        
        const  currentUser  = props.route.params.currentUser.uid



    
        setUser(profile)
        const unsubscribe1 = db.collection('posts')
                    .doc(currentUser).collection('userPosts')
                    .orderBy('creation', 'desc')
                    .onSnapshot((snapshot) => setUserPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
        }))))

        const unsubscribe2 =  db.collection('following')
                    .doc(currentUser).collection('userFollowing')
                    .orderBy('creation', 'desc')
                    .onSnapshot((snapshot) => setFollowingLength(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
        }))))

        const unsubscribe3 = () => {
            db.collection('following').onSnapshot(snapshot => snapshot.docs.map(doc => {
                doc.collection("userFollowing").onSnapshot(snapshot2 => snapshot2.docs.map(doc2 => {
                    if (doc2.data().userId == currentUser){
                        setFollowingCount(followingCount + 1)
                    }
                }))
            }))
        }

        return () => {
            unsubscribe1()
            unsubscribe2()
            unsubscribe3()
        }


    }, [])

    

    

    function signOutUser(){
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }


    if (user === null) {
        return <View />
    }


    function renderPosts(){
        if (userPosts.length == 0){
            if (currentUser == auth.currentUser.uid){
                return (
                    <View>
                        <Text>You have no posts yet</Text>
                    </View>
                )

            }
            else {
                return (
                    <View>
                        <Text>{profile.displayName} has no posts yet</Text>
                    </View>
                )
            }
            
        }
        return userPosts.map((image, index) => {
            return (
                <TouchableOpacity onPress={() => navigation.navigate("Post-Detail", {
                    id: image.id,
                    posterName: user.displayName,
                    PosterId: currentUser,
                    posterProfilePic: profile.photoURL,
                    image: image.data.downloadURL,
                    postDate: "idk",
                    caption: image.data.caption,
                    likes: image.data.likesCount,
                    
                })}>
                <View key={image.id} style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                        
                        <Image style={{
                            flex: 1,
                            alignSelf: 'stretch',
                            width: undefined,
                            height: undefined,

                        }}      
                            source={{uri: image.data.downloadURL}}>
                        </Image>    

                </View>
                </TouchableOpacity>
                
            )
        })

    }

    function follow(){
        db.collection('following')
        .doc(auth.currentUser.uid)
        .collection('userFollowing')
        .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: currentUser,

        })


    }

    function unFollow(){
        db.collection('following')
        .doc(auth.currentUser.uid)
        .collection('userFollowing')
        .doc(followingMatch[0].id)
        .delete()

    }

  
    function renderProfileEditButton(){

        db.collection('following').doc(auth.currentUser.uid).collection('userFollowing')
            .where('userId', '==', currentUser)
            .get()
            .then((snapshot) => {
                let fPeople = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setFollowing(fPeople);
        })
        

        if (currentUser == auth.currentUser.uid){
            return (
                <Button bordered dark onPress={() => navigation.navigate("Edit-Profile")}
                style={{ flex: 3, marginLeft: 10, justifyContent: 'center', height: 30 }}><Text>Edit Profile</Text></Button>

            )
            }
        else {
            if (followingMatch.length != 0){
                return (
                <Button bordered dark onPress={() => unFollow()}
                style={{ flex: 3, marginLeft: 10, justifyContent: 'center', height: 30 }}><Text>UnFollow</Text></Button>

                )
            }
            return (
                <Button bordered dark onPress={() => follow()}
                style={{ flex: 3, marginLeft: 10, justifyContent: 'center', height: 30 }}><Text>Follow</Text></Button>

            )
        }
    }

    function renderChatButton(){

        function createDms(){

            var firstClause = db.collection("chats").where("users", "==", [auth.currentUser.uid, currentUser])
            var secondClause = db.collection("chats").where("users", "==", [currentUser, auth.currentUser.uid])
            
            //var secondClause = db.collection("chats").where("users", "==", [currentUser, auth.currentUser.uid]).get()

            firstClause.get().then((snapshot) => {

                if (snapshot.size > 0){

                    snapshot.forEach((doc)=> {
                        navigation.navigate("Chat", {id: doc.id, chatName: profile.displayName, photo: profile.photoURL})
                        setNeedToMake(false)
        
                    

                    })
                }

                
                
            })

            secondClause.get().then((snapshot) => {

                if (snapshot.size > 0){

                    snapshot.forEach((doc)=> {
                        navigation.navigate("Chat", {id: doc.id, chatName: profile.displayName, photo: profile.photoURL})
                        setNeedToMake(false)
        
                    

                    })
                }
                else {
                    setNeedToMake(true)
                }

                
                
            })

        

            if (needToMake) {

                db.collection('chats').add({
                    chatName: '',
                    isDM: true,
                    users: [auth.currentUser.uid, currentUser]
        
                }).then(() => {
                    db.collection("chats").where("users", "==", [auth.currentUser.uid, currentUser]).get().then((snap) => {
                        snap.forEach((doc => {
                            navigation.navigate("Chat", {id: doc.id, chatName: profile.displayName, photo: profile.photoURL})

                        }))

                        
                        
                    })
                }).catch(error => alert(error))
            }

            

    
            
            
        }


        if (followingMatch.length != 0){
            if (currentUser != auth.currentUser.uid){
                return (
                
                    <Button bordered dark onPress={() => createDms()}
                    style={{ flex: 3, marginLeft: 10, justifyContent: 'center', height: 30 }}><Text>Chat</Text></Button>
                
                )
            }
        }
    }



    return (
        <Container style={styles.container}>
                

                <Content>

                    <View style={{ paddingTop: 10 }}>

                        {/** User Photo Stats**/}
                        <View style={{ flexDirection: 'row' }}>

                            {/**User photo takes 1/3rd of view horizontally **/}
                            <View
                                style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                                <TouchableOpacity onPress={() => navigation.navigate("Story-Screen", {userID: currentUser})}>
                                <Image source={{uri: profile.photoURL}}
                                    style={{ width: 75, height: 75, borderRadius: 37.5 }} />
                                </TouchableOpacity>

                            </View>

                            {/**User Stats take 2/3rd of view horizontally **/}
                            <View style={{ flex: 3 }}>

                                {/** Stats **/}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'flex-end'
                                    }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>{userPosts.length}</Text>
                                        <Text style={{ fontSize: 10, color: 'grey' }}>Posts</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>{followingCount}</Text>
                                        <Text style={{ fontSize: 10, color: 'grey' }}>Followers</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate("Following-Page", {
                                        userId: currentUser
                                    })}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>{followingLength.length}</Text>
                                        <Text style={{ fontSize: 10, color: 'grey' }}>Following</Text>
                                    </View>
                                    </TouchableOpacity>
                                </View>

                                {/**Edit profile and Settings Buttons **/}
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingTop: 10 }}>

                                    <View
                                        style={{ flexDirection: 'row' }}>

                                        {/** Edit profile takes up 3/4th **/}
                                        {renderProfileEditButton()}
                                        {renderChatButton()}


                                        {/** Settings takes up  1/4th place **/}
                                        <Button bordered dark style={{
                                            flex: 1,
                                            height: 30,
                                            marginRight: 10, marginLeft: 5,
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => signOutUser()}
                                        >
                                            <Icon name="settings" style={{ color: 'black' }}></Icon></Button>
                                    </View>
                                </View>{/**End edit profile**/}
                            </View>
                        </View>

                        <View style={{ paddingBottom: 10 }}>
                            <View style={{ paddingHorizontal: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{user.displayName}</Text>
                                <Text>{user.biography}</Text>
                                <Text>{user.email}</Text>
                            </View>
                        </View>


                    </View>


                    <View >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#eae5e5' }}>
                            <Button

                                
                                transparent
                               

                            >
                                <Icon name="ios-apps-outline"
                                    style={{ color: 'grey' }} >
                                </Icon>
                            </Button>
                            <Button
                                
                                transparent >
                                <Icon name="ios-list-outline" style={{ fontSize: 32, color: 'grey' }}></Icon>
                            </Button>
                            <Button
                                
                                transparent >
                                <Icon name="ios-bookmark-outline" style={{ color: 'grey' }}></Icon>
                            </Button>
                            <Button
                                
                                transparent last >
                                <Icon name="ios-people-outline" style={{ fontSize: 32,  color: 'grey' }}></Icon>
                            </Button>
                        </View>



                        {/** Height =width/3 so that image sizes vary according to size of the phone yet remain squares **/}

                        
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {renderPosts()}
                        </View>
                       

                    </View>
                </Content>
            </Container >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    
    containerInfo: {
        margin: 10,
        marginTop: 0.1,
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    

    galleryContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.l,
      },
    galleryText: {
        ...theme.textVariants.body3,
        color: theme.colors.gray,
      },
    galleryImage: {
        height: theme.imageHeight.l,
        width: theme.imageHeight.l,
        margin: 2,
      }
   
})
