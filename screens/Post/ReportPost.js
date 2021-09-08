import React, { useState } from 'react'
import { View, TextInput, Image, Button,   StyleSheet, Dimensions, KeyboardAvoidingView, TouchableOpacity, Linking} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {Text} from 'react-native-elements'

//import { Button } from "@ui-kitten/components"

import firebase from 'firebase'
import {auth, db} from '../../services/firebase'
require("firebase/firestore")
require("firebase/firebase-storage")




export default function ReportPost(props) {
    const [reportText, setReportText] = useState("")
    const [selectedValue, setSelectedValue] = useState("Select");
    const [reportSent, setReportSent] = useState(false)

    function uploadReport(){
        db.collection("Reports")
            .add({
                reporterId: auth.currentUser.uid,
                postId: props.route.params.postId,
                reportType: selectedValue,
                reportInfo: reportText,

            })

        setReportSent(true)

    }

    if (reportSent){
        return (
            <View>
                <Image source={{uri: "https://p.kindpng.com/picc/s/106-1060448_check-mark-clipart-png-powerpoint-check-mark-symbols.png"}}
                style={{height: 200, width: 200, marginLeft: 60}}
                />
            
                <Text>Thank you for your report. We will be reviewing your report and determining if this post goes against our policies. If we decide this post indeed goes against our guidelines, we will remove this post and the uploader if necessary </Text>
            </View>
        )
    }


    
    return (
		<View style={styles.container}>
            <Text h4>Select the type of problem with this post</Text>
            <View style={{marginTop: 10, marginBottom: 10}}>
                <Picker
                    selectedValue={selectedValue}
                    style={{ height: 100, width: 300 }}
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="Select" value="Select" />
                    <Picker.Item label="This is Spam" value="This is Spam" />
                    <Picker.Item label="Sexual activity or Nudity" value="Sexual activity or Nudity" />
                    <Picker.Item label="Scam and/or Fraud" value="Scam and/or Fraud" />
                    <Picker.Item label="Hate Speech or bullying" value="Hate Speech or bullying" />
                    <Picker.Item label="violence or gore" value="violence or gore" />
                    <Picker.Item label="promtion of dangerous activity or organizations" value="promtion of dangerous activity or organizations" />
                    <Picker.Item label="Ilegal activity or ilegal products" value="Ilegal activity" />
                    <Picker.Item label="Promotion of drugs or substance abuse" value="Promotion of drugs or substance abuse" />
                    <Picker.Item label="Other" value="Other" />



                </Picker>
            </View>
			<TextInput
				value={reportText}
                placeholder="Explain the problem or additional details...."
				onChangeText={(reportText) => setReportText(reportText)}
				style={{ color: "black", fontSize: 15 }}
				multiline={true}
				autoFocus
				selectionColor="black"
			/>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.bottom}>
				<Button disabled={selectedValue == "Select" || reportText == ""} title="Send Report" style={styles.button} appearance="filled" onPress={uploadReport}>
				</Button>
			</KeyboardAvoidingView>

            <TouchableOpacity onPress={() => Linking.openURL('https://www.app-privacy-policy.com/live.php?token=Jz17ZRAX2YI9ifsRSa69Nj4NzHnqE95d')}>
                    <Text style={styles.label}>EULA</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL('https://www.termsfeed.com/live/a4cf5a26-3364-4417-8680-0df21cba42fc')}>
                    <Text style={styles.label2}>Privacy Policy</Text>
            </TouchableOpacity>
            
		</View>
	)


   

   
}

const styles = StyleSheet.create({
    textInput: {
        bottom: 0,
        flex: 1,
        marginRight: 15,
       
        padding: 10,
        color: "grey",
        borderRadius: 30,

    },
    container: {
		flex: 1,
		//backgroundColor: "#222B45",
		color: "white",
		padding: 30,
		paddingTop: 80,

		width: Dimensions.get("window").width
	},
	bottom: {
		flex: 1,
		justifyContent: "flex-end",
		marginBottom: 36
	},
	button: {
		marginBottom: 30
	},
    label: {
        margin: 0,
        color: "#00BEEA",
        //top: 120,
        //marginRight: 300
      },

      label2: {
        margin: 0,
        color: "#00BEEA",
        //top: 100,
        marginRight: 100
      },
})
