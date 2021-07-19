import React, {useState, useEffect} from 'react'
import { TouchableOpacity} from 'react-native'
import { auth, db } from '../../services/firebase'
import styled from 'styled-components/native'



const Container = styled.View`
	width: 60px;
	height: 100%;
	padding-bottom: 59px;
	justify-content: flex-end;
`
const Menu = styled.View`
	margin: 9px 0;
	align-items: center;
`
const User = styled.View`
	width: 48px;
	height: 48px;
	margin-bottom: 13px;
`
const Avatar = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 48px;
	border-width: 2px;
	border-color: #ffffff;
`
const Icon = styled.Image`
	height: 40px;
`
const Count = styled.Text`
	color: #fff;
	font-size: 12px;
	letter-spacing: -0.1px;
`
const SoundBg = styled.View`
	background: #1f191f;
	width: 50px;
	height: 50px;
	border-radius: 50px;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
`
const Sound = styled.Image`
	width: 25px;
	height: 25px;
	border-radius: 25px;
`

const Sidebar = ({ avatar, count, navigation }) => {

	const [numOfComments, setNumOfComments] = useState(0);
	const [isLiked, setIsLiked] = useState(null)
	const [docId, setDocId] = useState('')
	const [likesCount, setLikesCount] = useState(0)



	useEffect(() => {
		
		const unsubscribe = () => { 

			try {
				db.collection("videoComments")
					.doc(avatar.id)
					.collection("thisVideoComments")
					.then(snap => {setNumOfComments(snap.size)})

				}
			
			catch(error) {
				setNumOfComments(0)
				
			}

			db.collection("videoLikes")
				.doc(avatar.id)
				.collection("usersLikes")
				.get()
				.then(snapshot => setLikesCount(snapshot.size))

			db.collection("videoLikes")
				.doc(avatar.id)
				.collection("userLikes")
				.where("userLiked", "==", auth.currentUser.uid)
				.get()
				.then(snapshot => {
					if (snapshot.size > 0){
						setIsLiked(true)
						snapshot.forEach((doc) => {
							setDocId(doc.id)
						})
					}
					else {
						setIsLiked(false)
					}
				})
			

			
	

		}
			

		
		
		return unsubscribe
	}, [])


	function renderLikeButton(){

		function likeVideo(){
			db.collection("videoLikes")
                .doc(avatar.id)
				.collection("userLikes")
                .add({
                        userLiked: auth.currentUser.uid 
                    })
			setIsLiked(true);
			
		}

		function unlikeVideo(){

			db.collection("videoLikes")
				.doc(avatar.id)
				.collection("userLikes")
				.where("userLiked", "==", auth.currentUser.uid)
				.get()
				.then(snapshot => {
					snapshot.forEach((doc) => {
						setDocId(doc.id)
					})
					
			})
			
			db.collection("videoLikes")
				.doc(auth.currentUser.uid)
				.collection("userLikes")
				.doc(docId)
				.delete()

			console.warn(docId)
			setIsLiked(false)
			

			

		}


		if (isLiked){
			return (
				<TouchableOpacity onPress={() => unlikeVideo()}>
					<Menu>
						<Icon resizeMode='contain' source={require('../../services/assets/icons/heart.png')} />
						<Count>{likesCount}</Count>
					</Menu>
				</TouchableOpacity>
			)

		}
		else {
			return (
				<TouchableOpacity onPress={() => likeVideo()}>
					<Menu>
					<Icon resizeMode='contain' source={require('../../services/assets/icons/like.png')} />
					<Count>{likesCount}</Count>
					</Menu>
				</TouchableOpacity>
			)
		}
		
	}
	
	

	return (
		<Container>
			<Menu>
				<User>
					<Avatar resizeMode='cover' source={{uri: avatar.data.profilePic}} />
				</User>
			</Menu>
			
			{renderLikeButton()}

			<Menu>
				<TouchableOpacity onPress={() => navigation.navigate("Video-Comments", {
					posterProfilePic: avatar.data.profilePic,
					posterUserName: avatar.data.userName,
					posterCaption: avatar.data.caption,
					postId: avatar.id,
				})}>
					<Icon
					resizeMode='contain'
					source={require('../../services/assets/icons/comment.png')}
					/>
					<Count>{`${numOfComments}`}</Count>
				</TouchableOpacity>
			</Menu>

			<Menu>
				<Icon resizeMode='contain' source={require('../../services/assets/icons/share.png')} />
				<Count>{"0"}</Count>
			</Menu>

			<Menu>
				<SoundBg>
					<Sound resizeMode='cover' source={{uri: avatar.data.profilePic}} />
				</SoundBg>
			</Menu>
		</Container>

		
	)
}

export default Sidebar
