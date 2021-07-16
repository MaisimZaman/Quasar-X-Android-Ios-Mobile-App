import React from 'react'

import { LinearGradient } from 'expo-linear-gradient'

import { Feather } from '@expo/vector-icons'

import styled from 'styled-components/native'

import { Button } from 'react-native-elements/dist/buttons/Button'
import { TouchableOpacity } from 'react-native-gesture-handler'




const Container = styled.View`
	height: 59px;
	width: 100%;
	position: absolute;
	bottom: 0;
	z-index: 1;
	border-top-width: 1px;
	border-top-color: rgba(255, 255, 255, 0.2);
	flex-direction: row;
`
const Menu = styled.TouchableOpacity`
	width: 20%;
	height: 100%;
	justify-content: center;
	align-items: center;
`
const Icon = styled.Image.attrs({ resizeMode: 'contain' })`
	height: 32px;
`
const MenuText = styled.Text`
	font-size: 9px;
	margin-top: -3px;
	color: ${props => (props.active ? '#fff' : 'rgba(255,255,255,0.6)')};
`
const Border = styled(LinearGradient)`
	width: 44px;
	height: 28px;
	border-radius: 8px;
	align-items: center;
`


const Tabs = ({navigation}) => {
	return (
		<Container>
			<Menu>
				<TouchableOpacity onPress={() => navigation.replace("Videos")}>
				<Icon source={require('../../services/assets/icons/home.png')} />
				<MenuText active='true'>Home</MenuText>
				</TouchableOpacity>
			</Menu>

			<Menu>
				<Icon source={require('../../services/assets/icons/discover.png')} />
				<MenuText>Search</MenuText>
			</Menu>

			

			<Menu>
				<TouchableOpacity onPress={() => navigation.navigate("Add-Video")}>
					<Icon source={require('../../services/assets/icons/message.png')} />
					<MenuText>Add</MenuText>
				</TouchableOpacity>
			</Menu>

			<Menu>
				<TouchableOpacity onPress={() => navigation.replace("My-Videos")}>
				<Icon source={require('../../services/assets/icons/profile.png')} />
				<MenuText>Stuff</MenuText>
				</TouchableOpacity>
			</Menu>
		</Container>
	)
}

export default Tabs
