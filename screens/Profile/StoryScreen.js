import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { Image } from 'react-native-elements/dist/image/Image';
import { auth, db } from '../../services/firebase';
import VideoPlayer from '../../components/VideoComponents/VideoPlayer';
import Story from 'react-native-story'



export default function StoryScreen(props) {
    const {userID, type} = props.route.params;

    const [storyImage, setStoryImage] = useState('')

    const [stage, setStage] = useState(0)

    useEffect(() => {

        const unsubscribe = () =>  {
            db.collection("stories")
            .where("user", "==", userID).get()
            .then((snap) => {

                snap.forEach(doc => {
                    setStoryImage(doc.data().downloadURL)
                });

                
                

            })
            .catch(e => {
                alert(e)
            }
        )}

        unsubscribe()

    }, [])

    function renderChoice(){
        if (type == "image"){
            return (
                <View>
                    <Text>{storyImage}</Text>
        
                    <Image
                        source={{ uri: storyImage}}
                    >
                    </Image>
                </View>
            )

        }

        else {
            return (
                <View>
                    <VideoPlayer
                        video={storyImage}
                    ></VideoPlayer>

                </View>
            )
        }
    }

    const stories = [
        {
          id: "4",
          source: {uri: "https://cdn.wallpapersafari.com/15/82/ZsdCJm.jpg"},
          user: "Ugur Erdal",
          avatar: {uri: auth.currentUser.photoURL}
        },
        {
          id: "2",
          source: {uri: "https://i.pinimg.com/originals/b2/92/5e/b2925e76fd4f217be5dfe1b300cedfbd.jpg"},
          user: "Mustafa",
          avatar: {uri: auth.currentUser.photoURL}
        },
        {
          id: "5",
          source: {uri: "https://wallpapercave.com/wp/wp5459301.jpg"},
          user: "Emre Yilmaz",
          avatar: {uri: auth.currentUser.photoURL}
        },
        {
          id: "3",
          source: {uri: "https://i.pinimg.com/originals/9f/78/0c/9f780caa86235d71dcf456abb9cd4e5c.png"},
          user: "Cenk Gun",
          avatar: {uri: auth.currentUser.photoURL}
        },
      ];

    

    return (
        <Story 
            unPressedBorderColor="#e95950"
            pressedBorderColor="#ebebeb"
            stories={stories}
            isOpen={true}
            useNativeDriver={true}
            footerComponent={
                <TextInput
                    placeholder="Send message"
                    placeholderTextColor="white"
                    //style={styles.footerInput}
                />
            }

        ></Story>
    )
}

const styles = StyleSheet.create({})
