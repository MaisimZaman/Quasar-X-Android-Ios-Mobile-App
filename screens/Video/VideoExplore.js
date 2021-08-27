import React, {useEffect, useState, useRef} from 'react'

import { StatusBar } from 'react-native'

import styled from 'styled-components/native'

import Header from '../../components/VideoComponents/Header'
import Hero from '../../components/VideoComponents/Hero'
import Tabs from '../../components/VideoComponents/Tabs'
import { auth, db } from '../../services/firebase'
import { useSelector } from 'react-redux'
import { selectAllUsers } from '../../slices/navSlice'



const Container = styled.View`
	flex: 1;
	background: transparent;
`

export default function VideoExplore({ navigation }){

	const [allVideos, setAllVideos] = useState([]);

    const allTheUsers = useSelector(selectAllUsers)

    useEffect(() => {

        
        const unsubscribe2 = async () => {


            async function addPostToState(item, index, arr){
                await db.collection("videos")
                .doc(item.uid)
                .collection("userVideos")
                .onSnapshot((snapshot) => {
                    setAllVideos(allVideos => [...allVideos].concat(
                        snapshot.docs.map(doc => ({
                            id: doc.id,
                            user: item.data,
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

            exectuueOrder(allTheUsers)

            

              
                
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


