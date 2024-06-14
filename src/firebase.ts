import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {

    apiKey: "AIzaSyCW-zzRHWG6HE1CCbiuZSd83h7WibPG2cg",
  
    authDomain: "recycle-29995.firebaseapp.com",
  
    projectId: "recycle-29995",
  
    storageBucket: "recycle-29995.appspot.com",
  
    messagingSenderId: "377375284726",
  
    appId: "1:377375284726:web:bb64732dcc8f0534793bd7",
  
    measurementId: "G-DFTQSJEJ7N"
  
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);



export {auth, db, storage}


