import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCxHKrSI8Tw8r_sI0-KiOj-1ReXFwv-4aU",
    authDomain: "signal-clone-94f15.firebaseapp.com",
    projectId: "signal-clone-94f15",
    storageBucket: "signal-clone-94f15.appspot.com",
    messagingSenderId: "853896607827",
    appId: "1:853896607827:web:46ca295c582ced48b76ea6",
    measurementId: "G-3Q74DKBP1P"
};

let app;

if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app();

}

const db = app.firestore();
const auth = firebase.auth();

export {db, auth}