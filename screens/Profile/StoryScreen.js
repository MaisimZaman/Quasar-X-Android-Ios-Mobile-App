import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'react-native-elements/dist/image/Image';
import { auth, db } from '../../services/firebase';

export default function StoryScreen(props) {
    const {userID} = props.route.params;

    const [storyImage, setStoryImage] = useState('')


    useEffect(() => {

        const unsubscribe = () =>  {
            db.collection("stories")
            .where("user", "==", userID).get()
            .then((doc) => {

                console.warn(userID)
                setStoryImage(doc.downloadURL)

            })
            .catch(e => {
                alert(e)
            }
        )}

        unsubscribe()

    }, [])

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

const styles = StyleSheet.create({})
