import React, {useEffect, useState} from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { auth, db } from '../../services/firebase';
import { CardItem, Left, Thumbnail, Body } from 'native-base';
import { Text } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { selectAllUsers } from '../../slices/navSlice';


export default function followingScreen(props) {

    const [followingList, setFollowingList ] = useState([])

    const [userData, setUserData] = useState([])

    const {userId, userName} = props.route.params;

    const allTheUsers = useSelector(selectAllUsers)

    useEffect(() => {
        const unsubscribe  = () => {

            db.collection('following')
                    .doc(userId).collection('userFollowing')
                    .orderBy('timestamp', 'desc')
                    .onSnapshot((snapshot) => setFollowingList(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
            }))))

            setUserData(allTheUsers)
    
    
        }

        unsubscribe()
    }, [])

    function getUserData(uid){
        if (userData.length > 0){
            var Info = userData.filter(function(value){
                return value.uid == uid
            })[0].data

            return Info
        }
        else {
            return 'null'
        }


    }


    

    function renderPerson(userid){
        
        
 


        

        return (
            <View>
                <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {
                            currentUser: getUserData(userid)
                        })}>
            <CardItem>
        <Left>
            <Thumbnail source={{uri: getUserData(userid).photoURL}} />

            <Body>
                <Text h5>{getUserData(userid).displayName} </Text>
                <Text>{getUserData(userid).email}</Text>
            </Body>
        </Left>
        </CardItem>
        </TouchableOpacity>
        </View>
        )


    }

   

    function renderFollowing(){


        return (
            followingList.map(({id, data}) => (
                 renderPerson(data.userId)  
            ))
        )
    }

    return (
        <View>
            <Text h4>{userName} Follows: </Text>
            <ScrollView>
                
                {renderFollowing()}
                
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
})
