import React from 'react'
import { View, Text } from 'react-native'

import { Video } from 'expo-av'

import styled from 'styled-components/native'

const Play = styled(Video)`
	height: 100%;
`
const Poster = styled.ImageBackground`
	height: 100%;
`

const VideoPlayer = ({ video, isPlay }) => {
	return  isPlay ? (
		<Play
			rate={1.0}
			volume={2.0}
			isMuted={false}
			shouldPlay
			useNativeControls={false}
			//posterSource={poster}
			source={{uri: video}}
			resizeMode='cover'
		/>
	) : (
		<View>
			<Text>Loading</Text>
		</View>
	)
}

export default VideoPlayer
