import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, KeyboardAvoidingView } from 'react-native'
import firebase from 'firebase'
import {auth, db } from '../../services/firebase'
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon, Container} from 'native-base'
import { useSelector } from 'react-redux'
import { selectAllUsers } from '../../slices/navSlice'

var { height, width } = Dimensions.get('window');



require('firebase/firestore');

export default function SearchScreen(props) {
    const [usersList, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [allPosts, setAllposts] = useState([])
    const [page, setPage] = useState(15);

    const allTheUsers = useSelector(selectAllUsers)
    

    


    useEffect(() => {

        
            const unsubscribe2 = async () => {


                async function addPostToState(item, index, arr){
                    //console.log(index)
                    await db.collection("posts")
                    .doc(item.uid)
                    .collection("userPosts")
                    .orderBy('creation', 'desc')
                    .onSnapshot((snapshot) => {
                        setAllposts(allPosts => [...allPosts].concat(
                            snapshot.docs.map(doc => ({
                                id: doc.id,
                                user: item.data,
                                data: doc.data()

                            }))


                        ))
                    })
                

                }

                function exectuueOrder(arr){
                    if (allPosts < 16){
                        arr.forEach(addPostToState)

                    }
        
                }

                
   


                exectuueOrder(allTheUsers)
                  
            
            }
                
            
            

        
        unsubscribe2()
        
        
    
    }, [])

    
    
    
    

    function renderAllposts(){
        var aposts = 15
        var qPosts = allPosts.slice(0, aposts)
        return qPosts.map(({id, user, data}, index) => {

            
            return (
                <TouchableOpacity onPress={() => props.navigation.navigate("Post-Detail", {
                    id: id,
                    posterName: user.displayName,
                    PosterId: user.uid,
                    posterProfilePic: user.photoURL,
                    image: data.downloadURL,
                    caption: data.caption
                })}>
                <View key={id} style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                        
                        <Image style={{
                            flex: 1,
                            alignSelf: 'stretch',
                            width: undefined,
                            height: undefined,

                        }}      
                            
                            source={{uri: data.downloadURL}}>
                        </Image>    

                </View>
                </TouchableOpacity>
             
                
            )
        })

    }

    function fetchUsers(search){
        //console.warn("Function was called")
        db.collection('users')
            .where('displayName', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
        })

 
       
    }

    function renderPerson(item){
        return (
            <View>
                <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {
                            currentUser: item
                        })}>
            <CardItem>
        <Left>
            <Thumbnail source={{uri: item.photoURL}} />

            <Body>
                <Text h5>{item.displayName} </Text>
                <Text>{item.email}</Text>
            </Body>
        </Left>
        </CardItem>
        </TouchableOpacity>
        </View>
        )


    }


    function renderMain(){

        if (search == ''){
            return (
                
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {renderAllposts()}
                    </View>
                
            )
        }



        else if (usersList.length == 0){
            return (
                <View>
                    <Text>No users found</Text>
                </View>
            )
        }

        function endReached(){
            setPage(page +6)

        }

        if (usersList.length < 10){
            var paginatedList = usersList
        }
        else {
            var paginatedList = usersList.slice(0, 10)
        }

        return (

            <FlatList
                numColumns={1}
                horizontal={false}
                data={paginatedList}
                renderItem={({ item }) => (
                   renderPerson(item)

                )}
                onEndReached={endReached}
            />
        )
    }

    fetchUsers(search)
   

    return (

        <Container>
            <ScrollView>
                <TextInput
                    style={styles.textInput}
                    placeholder="Seach for User..."
                    onChangeText={(search) => setSearch(search)} />

                {renderMain()}

            </ScrollView>
            
        </Container>
    )
}

const styles = StyleSheet.create({
    textInput: {
        bottom: 0,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,

    },
})