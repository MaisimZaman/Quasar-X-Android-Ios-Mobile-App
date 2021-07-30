import React, {useEffect, useState, useRef} from 'react'

import { StatusBar } from 'react-native'

import styled from 'styled-components/native'

import Header from '../../components/VideoComponents/Header'
import Hero from '../../components/VideoComponents/Hero'
import Tabs from '../../components/VideoComponents/Tabs'
import { auth, db } from '../../services/firebase'

//import BottomSheet from 'reanimated-bottom-sheet';
import VideoComments from '../../components/VideoComponents/VideoComments'
import { Button } from 'react-native'
import VideoPlayer from '../../components/VideoComponents/VideoPlayer'


const Container = styled.View`
	flex: 1;
	background: transparent;
`

export default function VideoExplore({ navigation }){

	const [allVideos, setAllVideos] = useState([]);

    useEffect(() => {

        
        const unsubscribe2 = async () => {


            async function addPostToState(item, index, arr){
                await db.collection("videos")
                .doc(item.userId)
                .collection("userVideos")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setAllVideos(allPosts => [...allPosts].concat(
                        snapshot.docs.map(doc => ({
                            id: doc.id,
                            user: item.userInfo,
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

            

            await db.collection("users")
            .onSnapshot((snapshot) => exectuueOrder(snapshot.docs.map(doc => {
                return {userId: doc.data().uid, userInfo: doc.data()}
                

            })))   
                
        }
            
        
        

    
    unsubscribe2()
    
    

    }, [])


   

    //console.warn(allVideos.length)

    
    //const Container = 2;


	return (
		<>
			<StatusBar
				translucent
				backgroundColor='transparent'
				barStyle='light-content'
			/>
			<Container>
				<Header />
             
				<Hero videos={allVideos} navigation={navigation}/>

                
                
				<Tabs navigation={navigation} />
			</Container>

            
		</>
	)
}


