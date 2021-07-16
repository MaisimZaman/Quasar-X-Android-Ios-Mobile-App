import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { auth, db } from '../../services/firebase';
import { CardItem, Left, Thumbnail, Body } from 'native-base';


export default function followingScreen(props) {

    const [followingList, setFollowingList ] = useState([])

    const [userData, setUserData] = useState([])

    const {userId} = props.route.params;

    useEffect(() => {
        const unsubscribe  = db.collection('following')
                .doc(userId).collection('userFollowing')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => setFollowingList(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
        }))))

        return unsubscribe
    }, [])


    

    function renderPerson(userid, point){
        
        
 
    

        db.collection("users").doc(userid).get().then((doc) =>  {
           setUserData(userData => [...userData, doc.data()])
            
            
        })

       

        var item = userData[point]

        

        return (
            <View>
                <Text>{item.uid}</Text>
                <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {
                            currentUser: userid
                        })}>
            <CardItem>
        <Left>
            <Thumbnail source={{uri: ''}} />

            <Body>
                <Text h5>{''} </Text>
                <Text>{''}</Text>
            </Body>
        </Left>
        </CardItem>
        </TouchableOpacity>
        </View>
        )


    }

   

    function renderFollowing(){

        return (
            followingList.map(({id, data}, index) => {
                return ( renderPerson(data.userId, index))  
            })
        )
    }

    return (
        <ScrollView>
            <Text h1>Follow page</Text>
            {renderFollowing()}
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({})
