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

export default function VideoScreen({ navigation }){

	const [allVideos, setAllVideos] = useState([]);

    const postsFor = auth.currentUser.uid;

    const sheetRef = useRef();

    useEffect(() => {    

        async function main(){
            await db.collection('following')
                    .doc(postsFor).collection('userFollowing')
                    .orderBy('timestamp', 'desc')
                    .onSnapshot((snapshot) => executeLoop(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()

            }))))
                        
            async function executeLoop(array){
                array.forEach(mainloop)
                
            }

            async function mainloop(item, index, arr){
                await db.collection('videos')
                .doc(item.data.userId).collection('userVideos')
                .orderBy('creation', 'desc')
                .onSnapshot((snapshot) =>  {
                    var thisVideos = snapshot.docs.map(doc => ({
                id: doc.id,
                user: item.data.userId,
                data: doc.data()
                })
                )
                setAllVideos(allVideos => [...allVideos].concat(thisVideos))
                })

            }
            //userFollowing.forEach(mainloop)
        }

        main()
        
    }, [])

    console.warn(allVideos.length)

    function renderBottomSheetContent(){
        return (
            <VideoComments></VideoComments>
        )
    }


    function openBottomSheet(){
        sheetRef.current.snapTo(0);
    }

    //const Container = 2;


	return (
		<>
			<StatusBar
				translucent
				//backgroundColor='transparent'
				//barStyle='light-content'
			/>
			<Container>
				<Header />
             
				<Hero videos={allVideos} navigation={navigation}/>

                
                
				<Tabs navigation={navigation} />
			</Container>

            
		</>
	)
}


