import React, {useEffect, useState} from 'react'

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



export default function MyVideoScreen({ navigation }){

	const [myVideos, setMyVideos] = useState([]);


    


    useEffect(() => {    
        const unsubscribe = db.collection('videos')
            .doc(auth.currentUser.uid).collection('userVideos')
            .orderBy('creation', 'desc')
            .onSnapshot((snapshot) => setMyVideos(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
        }))));

        return unsubscribe;


        
        
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
				<Hero videos={myVideos} navigation={navigation}/>
				<Tabs navigation={navigation} />
			</Container>
		</>
	)
}


