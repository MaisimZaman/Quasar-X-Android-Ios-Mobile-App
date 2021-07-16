import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base'
import { auth, db } from '../services/firebase'

export default function Stories({userFollowing}) {

    const [profiles, setProfiles] = useState([])


    

    useEffect(() => {
        
        const unsubscribe = () => {
            userFollowing.forEach(({data, id}) =>{

                
                db.collection("users").doc(data.userId).get().then((doc) => {
                    var userInfo = {id: doc.id, data: doc.data().photoURL}
                    if (profiles.length < userFollowing.length){
    
                        setProfiles(profiles => [...profiles, userInfo])
    
                        
                        
                    } 
                    

                })
            })
        }

        return () => {
            unsubscribe()
        }
    }, [userFollowing])

   

    

    function renderStories(){
        return (
            profiles.map(({id, data}) => (
                <Thumbnail
                        key={id}
                        style={{ marginHorizontal: 5, borderColor: 'pink', borderWidth: 2 }}
                        source={{uri: data}} />

            ))
        )
    }



    return (
            <View style={{ height: 100 }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 7 }}>
                        <Text style={{ fontWeight: 'bold' }}>Stories</Text>

                        <View style={{ flexDirection: 'row', 'alignItems': 'center' }}>
                                <Icon name="md-play" style={{ fontSize: 14 }}></Icon>
                                <Text style={{ fontWeight: 'bold' }}> Watch All</Text>
                        </View>
                        </View>
                        <View style={{ flex: 3 }}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    alignItems: 'center',
                                    paddingStart: 5,
                                    paddingEnd: 5
                                }}

                            >
                                {renderStories()}

                            </ScrollView>
                        </View>
                    </View>
    )
}

const styles = StyleSheet.create({})
