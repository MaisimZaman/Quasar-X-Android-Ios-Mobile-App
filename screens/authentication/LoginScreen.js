import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView, TouchableOpacity, Linking} from 'react-native'
import { Button, Input, Image } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar'
import { auth } from '../../services/firebase'
import { useDispatch } from 'react-redux'
import { setAllUsers } from '../../slices/navSlice'
import { db } from '../../services/firebase'


export default function LoginScreen({ navigation }){

    const [email, setEmail]  = useState("");
    const [password, setPassword ] = useState("");

    const dispatch = useDispatch()

    useEffect(() => {
    db.collection('users')
    .onSnapshot((snapshot) => dispatch(setAllUsers((snapshot.docs.map(doc => ({
        uid: doc.id,
        data: doc.data()
    }))))))

    


  }, [])

 
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser){
                navigation.replace("Main"); 

            }

        });

        return unsubscribe;
        
    }, [])


    
    

    function signIn(){
        auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert(error))

        //console.log("This is a corrrect sign in")
        
    }
    
    
    return (
        <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
            <StatusBar style="light"></StatusBar>
            <Image
                source={
                    require("../../services/assets/mainlogo.png")
                }

                style={{width: 200, height: 200}}
            ></Image>

            <View style={styles.inputContainer}>
                <Input 
                placeholder="Email" 
                autoFocus 
                type="Email" 
                value={email} 
                onChangeText={(text) => setEmail(text)} />
                <Input 
                placeholder="Passowrd"  
                secureTextEntry   
                type="password" 
                value={password}
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={signIn}
                />
            </View>

            <Button containerStyle={styles.button} onPress={signIn} title="Login"></Button>
            <Button containerStyle={styles.button} onPress={() => navigation.navigate("Register")} type="outline" title="Register"></Button>



            <TouchableOpacity onPress={() => Linking.openURL('https://www.app-privacy-policy.com/live.php?token=Jz17ZRAX2YI9ifsRSa69Nj4NzHnqE95d')}>
                    <Text style={styles.label}>EULA</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL('https://www.termsfeed.com/live/a4cf5a26-3364-4417-8680-0df21cba42fc')}>
                    <Text style={styles.label2}>Privacy Policy</Text>
            </TouchableOpacity>
            
        </KeyboardAvoidingView>
    )
    
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white",


    },
    inputContainer: {
        width: 300,


    },
    button: {
        width: 200,
        marginTop: 10,

    },
    
    inputContainer: {
        width: 300,
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
        //top: 80,
        //marginRight: 300
        marginTop: 30
      },

      label2: {
        margin: 0,
        color: "#00BEEA",
        //top: 60,
        //marginRight: 100
      },


})

