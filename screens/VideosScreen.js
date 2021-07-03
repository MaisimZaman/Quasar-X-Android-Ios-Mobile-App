import React, {useEffect, useState} from 'react'

import { StatusBar } from 'react-native'

import styled from 'styled-components/native'

import Header from '../components/VideoComponents/Header'
import Hero from '../components/VideoComponents/Hero'
import Tabs from '../components/VideoComponents/Tabs'
import { auth, db } from '../firebase'





const Container = styled.View`
	flex: 1;
	background: transparent;




`

import api from '../services/api'

export default function VideoScreen({ navigation }){
	return (
		<>
			<StatusBar
				translucent
				backgroundColor='transparent'
				barStyle='light-content'
			/>
			<Container>
				<Header />
				<Hero videos={api} />
				<Tabs navigation={navigation} />
			</Container>
		</>
	)
}


