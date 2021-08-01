import React, {useEffect, useState, useRef} from 'react'

import { StatusBar } from 'react-native'

import styled from 'styled-components/native'

import Header from '../../components/VideoComponents/Header'
import Hero from '../../components/VideoComponents/Hero'
import Tabs from '../../components/VideoComponents/Tabs'
import { auth, db } from '../../services/firebase'



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
                .onSnapshot((snapshot) => {
                    setAllVideos(allVideos => [...allVideos].concat(
                        snapshot.docs.map(doc => ({
                            id: doc.id,
                            user: item.userInfo,
                            data: doc.data()

                        }))


                    ))
                })
            

            }

            function exectuueOrder(arr){
                if (allVideos < 16){
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


