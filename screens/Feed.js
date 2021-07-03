import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base'
import PostCard from '../components/PostCard'
import { auth, db } from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import Stories from '../components/Stories'



export default function Feed({ navigation }) {

    const [posts, setPosts] = useState([]);
    const [userFollowing, setUserFollowing] = useState([])

    

    const postsFor = auth.currentUser.uid;

    useEffect(() => {    

        

        const unsubscribe  = db.collection('following')
                .doc(postsFor).collection('userFollowing')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => setUserFollowing(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
        }))))

    
        

        return unsubscribe
    }, [])



    useEffect(() => {
            userFollowing.forEach(({data, id}) => {
                db.collection('posts')
                .doc(data.userId).collection('userPosts')
                .orderBy('creation', 'desc')
                .onSnapshot((snapshot) =>  {
                    var thisPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                user: data.userId,
                data: doc.data()
                })
                )
                setPosts(posts => [...posts].concat(thisPosts))
                
                
            
            })
            })

        

       
    }, [])

    

    const [name, setName] = useState('')
    const [picUrl, setPicUrl] = useState('')

    function getphotoUrl(uid){
        
        db.collection("users")
        .doc(uid)
        .get()
        .then((doc) =>  {
            setPicUrl(doc.data().photoURL)
            
        })

        return picUrl


    }
    

    function getDisplayName(uid){
        
        db.collection("users")
        .doc(uid)
        .get()
        .then((doc) =>  {
            setName(doc.data().displayName)
            
        })

        return name


    }



 

    function renderPosts(){
      

        if (posts.length == 0){
            return (
                <View>
                    <Text >Nothing on your feed yet</Text>
                </View>
            )
        }
    
        
        return (
            posts.map(({id, user, data}) => (
                <TouchableOpacity onPress={() => navigation.navigate("Post-Detail", {
                    id: id,
                    posterName: getDisplayName(user),
                    PosterId: user,
                    posterProfilePic: getphotoUrl(user),
                    image: data.downloadURL,
                    postDate: "idk",
                    caption: data.caption,
                    likes: data.likesCount,
                    
                })}>
                <PostCard
                //key={id}
                key={id}
                id={id}
                posterName={getDisplayName(user)}
                posterProfilePic={getphotoUrl(user)}
                PosterID={user}
                image={data.downloadURL}
                postDate={data.creation}
                caption={data.caption}
                likes={data.likesCount}
                navigation={navigation}
                
                />
                </TouchableOpacity>
            ))
        )
    }

    

    
    return (
        <Container style={styles.container}>
            <Container>
            <ScrollView>
                <Stories
                userFollowing={userFollowing}
                />
           
                {renderPosts()}
            </ScrollView>
            </Container>
            
        </Container>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"

    }
})
