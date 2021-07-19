import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { auth, db } from '../../services/firebase';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon, Container} from 'native-base'

export default function NotificationScreen({navigation}) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('notifications')
                    .doc(auth.currentUser.uid)
                    .collection('userNotifications')
                    .orderBy('timestamp', 'desc')
                    .onSnapshot((snapshot) => setNotifications(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
        }))))

        return unsubscribe

        
    }, [])

    function renderNotification(item){

        

        console.log(item)

        if (item.data.type == "comment"){
            return (
                <View>
                    <TouchableOpacity
                            onPress={() => navigation.navigate("Post-Detail", {
                                id: item.data.postId,
                                posterName: auth.currentUser.displayName,
                                PosterId: auth.currentUser.uid,
                                posterProfilePic: auth.currentUser.photoURL,
                                image: item.data.image,
                                caption: item.caption

                            })}>
                <CardItem>
            <Left>
                <Thumbnail source={{uri: item.data.profilePicture }} />
    
                <Body>
                    <Text h5>{item.data.commenterName + " commented: "} </Text>
                    <Text>{item.data.comment}</Text>
                </Body>
            </Left>

            <Right>
                <Image style={{paddingRight: 10, height: 70, width: 70}} source={{uri: item.data.image}} />
            </Right>
            </CardItem>
            </TouchableOpacity>
            </View>
            )

        }

        else if (item.data.type == "like"){
            return (
                <View>
                    <TouchableOpacity
                            onPress={() => navigation.navigate("Post-Detail", {
                                id: item.data.postId,
                                posterName: auth.currentUser.displayName,
                                PosterId: auth.currentUser.uid,
                                posterProfilePic: auth.currentUser.photoURL,
                                image: item.data.image,
                                caption: item.caption

                            })}>
                <CardItem>
            <Left>
                <Thumbnail source={{uri: item.data.profilePicture }} />
    
                <Body>
                    <Text h5>{item.data.displayName + " has liked your post"} </Text>
                 
                </Body>
            </Left>

            <Right>
                <Image style={{paddingRight: 10, height: 70, width: 70}} source={{uri: item.data.image}} />
            </Right>
            </CardItem>
            </TouchableOpacity>
            </View>
            )

        }
        


    }

    if (notifications.length == 0){
        return (
            <View>
                <Text>You have no notifications yet</Text>
               
            </View>
        )
    }


    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={notifications}
                renderItem={({ item }) => (
                  
                   renderNotification(item)

                )}
                //onEndReached={endReached}
            />
        </View>
    )
}

const styles = StyleSheet.create({})
