import React, {useEffect, useState, useLayoutEffect} from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native'
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base'
import { auth, db } from '../services/firebase'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Story from 'react-native-story'
import { Button } from 'react-native-elements/dist/buttons/Button'

export default function Stories({userFollowing, navigation}) {

    const [profiles, setProfiles] = useState([])



    

    

    

    useEffect(() => {
        
        const unsubscribe = () => {
            userFollowing.forEach(({data, id}) =>{

                
                db.collection("users").doc(data.userId).get().then((doc) => {
                    var userInfo = {
                                    id: doc.id, 
                                    source: {uri:"https://i.pinimg.com/originals/9f/78/0c/9f780caa86235d71dcf456abb9cd4e5c.png" },
                                    user: doc.data().displayName,
                                    avatar: {uri: doc.data().photoURL},
                                }
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
                <TouchableOpacity onPress={() => navigation.navigate("Story-Screen", data.uid)}>

                
                <Thumbnail
                        key={id}
                        style={{ marginHorizontal: 5, borderColor: 'pink', borderWidth: 2 }}
                        source={{uri: data.photoURL}} />

                </TouchableOpacity>

            ))
        )
    }


    return (
    
        <Story 
            unPressedBorderColor="#e95950"
            pressedBorderColor="#ebebeb"
        
            stories={profiles}
            animationDuration={800}
            footerComponent={

                
                <TextInput
                    placeholder="Send message"
                    placeholderTextColor="white"
                    //style={styles.footerInput}
                />
              
            }

        ></Story>
        
    )

   



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
