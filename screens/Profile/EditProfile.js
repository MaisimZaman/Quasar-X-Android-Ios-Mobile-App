import React, {useState, useLayoutEffect} from 'react'
import { View,  StyleSheet, KeyboardAvoidingView} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { Button, Input, Text } from 'react-native-elements'
import { auth, db } from '../../services/firebase'

import { Image } from 'react-native-elements'


export default function EditProfile({ navigation }){

    const [name, setName] = useState(auth.currentUser.displayName);
    
    const [password, setPassword] = useState('');

    const [email, setEmail] = useState(auth.currentUser.email);

    const [biography, setBiography] = useState('');


    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Edit Profile"
        })
    }, [navigation])

    function checkNull(type, value){
        if (value != ''){
            return value
        }
        else {
            if (type == 'displayName'){
                return auth.currentUser.displayName
            }
            else if (type == 'email'){
                return auth.currentUser.email
            }
            
        }
    }

    function update(){
        auth.currentUser.updateProfile({
            displayName: checkNull('displayName', name),
            email: checkNull('email', email),
          }).then(() => {
            navigation.goBack()
          }).catch((error) => {
            console.warn(error)
          });  

        db.collection('users')
        .doc(auth.currentUser.uid)
        .update({
            displayName: checkNull('displayName', name),
            email: checkNull('email', email),
        })

        
          



    }



    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            
            <Text h3 style={{marginBottom: 50}}>
            Edit Profile
            </Text>

            
            <View
                style={{ flex: 1, alignItems: 'center', }}>
                <TouchableOpacity onPress={() => navigation.navigate('Update-Profile-Pic')}>
                <Image source={{uri: auth.currentUser.photoURL}}
                 style={{ width: 120, height: 90, borderRadius: 37.5 }} />

                 </TouchableOpacity>
                 <Text>Change Profile Image</Text>

            </View>

         

            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Full name"
                    autoFocus
                    type='text'
                    value={name}
                    onChangeText={text => setName(text)}
                ></Input>

                <Input 
                    placeholder="Email"
                    type='text'
                    value={email}
                    onChangeText={text => setEmail(text)}
                ></Input>

                

                <Input 
                    placeholder="Password"
                    type='text'
                    value={password}
                    onChangeText={text => setPassword(text)}
                ></Input>

                

                <Input 
                    placeholder="Biography"
                    type='text'
                    value={biography}
                    onChangeText={text => setBiography(text)}
                    onSubmitEditing={update}
                ></Input>



            </View>

            <Button
                style={styles.button}
                raised
                title="Update"
                onPress={update}
                
            ></Button>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 500,
        marginTop: 10,
    },


})
