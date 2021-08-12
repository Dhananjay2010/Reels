import firebase from "firebase/app";

import "firebase/auth"; // For authentication

import "firebase/firestore"; //=> Import the database

import "firebase/storage"; //=> Imported the storage part

var firebaseConfig = {
    apiKey: "AIzaSyAOfLD_bRu4XAq-HHJ4SNz9J4rOoSD09iQ",
    authDomain: "reels-fe19c.firebaseapp.com",
    projectId: "reels-fe19c",
    storageBucket: "reels-fe19c.appspot.com",
    messagingSenderId: "452888834044",
    appId: "1:452888834044:web:84bab9ce7cbdf3c402cc79"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export const storage=firebase.storage(); //==> Created the storage object

export const auth=firebase.auth(); // ==> Created the authentication object

/*
Provider batata hai ki app kaunse method se authentication karna wale hain.
*/

let provider= new firebase.auth.GoogleAuthProvider(); // ==> Humne choose kiya google authentication

export const signInWithGoogle= ()=>auth.signInWithPopup(provider); // ==> Ek function banaya ki hume popUp use karna hai authentication ke liye

export default firebase;