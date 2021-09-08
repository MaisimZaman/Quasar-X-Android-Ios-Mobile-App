import React, {useState, useLayoutEffect, useEffect} from 'react'
import { View,  StyleSheet, KeyboardAvoidingView, Linking, TouchableOpacity} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, Input, Text } from 'react-native-elements'
import { auth, db } from '../../services/firebase'
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox'




export default function RegisterScreen({ navigation }){

    const [name, setName] = useState('');
    
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [readyRegister, setReadyRegisted] = useState(false)

    const [isSelected, setSelection] = useState(false);





    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Register your account"
        })
    }, [navigation])


    useEffect(() => {
        if (name != '' && email != '' && password != '' && isSelected == true){
            setReadyRegisted(true)
        }
        else {
            setReadyRegisted(false)
        }


    }, [name, email, password, isSelected])

    function register(){
        const defaultProfilePic = 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar-600x600.png'
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: defaultProfilePic,

            })

            

            db.collection("users")
                    .doc(auth.currentUser.uid)
                    .set({
                        displayName: name,
                        email: email,
                        photoURL: defaultProfilePic,
                        uid: auth.currentUser.uid,
                    })
        })
        .catch((error) => alert(error.message));

        



    }



    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            
            <Text h3 style={{marginBottom: 50}}>
                Register your account
            </Text>

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
                    onSubmitEditing={register}
                ></Input>

                


            </View>

            <View style={styles.checkboxContainer}>
            <CheckBox
                
                iconRight
                iconType='material'
                checkedIcon='clear'
                uncheckedIcon='add'
                checkedColor='red'
                checked={isSelected}
                onPress={() => setSelection(!isSelected)}
                />

                <TouchableOpacity onPress={() => Linking.openURL('https://www.app-privacy-policy.com/live.php?token=Jz17ZRAX2YI9ifsRSa69Nj4NzHnqE95d')}>
                    <Text style={styles.label}>Accept EULA</Text>
                </TouchableOpacity>
            </View>

            <Button
                style={styles.button}
                raised
                title="Register"
                onPress={register}
                disabled={!readyRegister}
                
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
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
      },
      checkbox: {
        alignSelf: "center",
      },
      label: {
        margin: 0,
        color: "#00BEEA",
        top: 15
      },


})
