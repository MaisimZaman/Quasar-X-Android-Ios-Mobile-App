import React, {useState, useEffect, useLayoutEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput} from 'react-native'
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base'
import PostCard from '../../components/PostCard'
import { auth, db } from '../../services/firebase'
import { ScrollView } from 'react-native-gesture-handler'
import Stories from '../../components/Stories'
import Story from 'react-native-story'



export default function Feed({ navigation }) {

    const [posts, setPosts] = useState([]);
    const [userFollowing, setUserFollowing] = useState([])
    const [userInfo, setUserInfo] = useState([])
    const [scrollEnd, setScrollEnd] = useState(false);
    const [page, setPage] = useState(5)
    const [storyOn, setStoryOn] = useState(false)

    

    const postsFor = auth.currentUser.uid;

    


    useLayoutEffect(() => {
        if (storyOn){
            navigation.setOptions({
                headerTransparent: true,
            })

        }
        

    }, [storyOn])




    useEffect(() => {    


        async function main(){

        
            await db.collection('following')
                    .doc(postsFor).collection('userFollowing')
                    .orderBy('timestamp', 'desc')
                    .onSnapshot((snapshot) => executeLoop(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()

            }))))
            

            async function userLoop(item, index, arr){
                    await db.collection("users").doc(item.data.userId).get().then((doc) => {
                        setUserFollowing([...userFollowing, item])
                        setUserInfo(userInfo => [...userInfo, {uid: doc.data().uid, index: index, data: doc.data()}]
                        )
                        
                    })

            }

            async function executeLoop(array){
                array.forEach(userLoop)
                array.forEach(mainloop)
                
            }

            async function mainloop(item, index, arr){
                await db.collection('posts')
                .doc(item.data.userId).collection('userPosts')
                .orderBy('creation', 'desc')
                .onSnapshot((snapshot) =>  {
                    var thisPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                user: item.data.userId,
                data: doc.data()
                })
                )
                setPosts(posts => [...posts].concat(thisPosts))
                })

            }
        
            
        }

        main()
            
    }, [])

    console.warn


    function getphotoUrl(uid){

        
        if (userInfo.length > 0){
            var picInfo = userInfo.filter(function(value){
                return value.uid == uid
            })[0].data.photoURL
         
            return picInfo

        }
        else {
            return 'null'
        }
    }

    function getEmail(uid){

        
        if (userInfo.length > 0){
            var emailInfo = userInfo.filter(function(value){
                return value.uid == uid
            })[0].data.email
         
            return emailInfo

        }
        else {
            return 'null'
        }
    }
    

    function getDisplayName(uid){

        if (userInfo.length > 0){
            var nameInfo = userInfo.filter(function(value){
                return value.uid == uid
            })[0].data.displayName

            //console.log(nameInfo)

            return nameInfo
        }
        else {
            return 'null'
        }


    }

    function renderPosts(){

        function endReached(){
            if (page < posts.length){
                setPage(page + 5)
                
            }
        }
      

        if (posts.length == 0){
            return (
                <View>
                    <Text >Nothing on your feed yet</Text>
                </View>
            )
        }
        
        else if (posts.length > 5) {

            var qPosts = posts.slice(0, page)
        }
        else {
            var qPosts = posts;
        }


        

        return (
            <FlatList
                numColumns={1}
                horizontal={false}
                data={qPosts}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("Post-Detail", {
                        id: item.id,
                        posterName: getDisplayName(item.user),
                        PosterId: item.user,
                        posterProfilePic: getphotoUrl(item.user),
                        image: item.data.downloadURL,
                        postDate: "idk",
                        caption: item.data.caption,
                        likes: item.data.likesCount,
                        navigation: navigation,
                        email: getEmail(item.user)
                        
                    })}>
                    <PostCard
                    //key={id}
                    key={item.id}
                    id={item.id}
                    posterName={getDisplayName(item.user)}
                    posterProfilePic={getphotoUrl(item.user)}
                    email={getEmail(item.user)}
                    PosterId={item.user}
                    
                    image={item.data.downloadURL}
                    postDate={item.data.creation}
                    caption={item.data.caption}
                    likes={item.data.likesCount}
                    navigation={navigation}
                    
                    />
                    </TouchableOpacity>

                )}
                //onMomentumScrollBegin={() => setScrollEnd(false)}
                //onMomentumScrollEnd={() => console.warn("end reached")}   
                onEndReachedThreshold={0.5}           
                //onScrollToTop={() => setPage(page - 5)}
                onEndReached={() => setPage(page+5)}
            />
        )
    
        
        
    }

    return (
        
            <Container style={styles.container}>
                    
                    <Stories 
                        navigation={navigation}
                        userFollowing={userFollowing}
                
                    />
                    

                    <View style={{top: -8}}>
                        {renderPosts()}
                    </View>
                
                
            </Container>

        

        
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        top: -40
        

    }
})
