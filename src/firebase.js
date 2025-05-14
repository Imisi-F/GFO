// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaVm-pn_UMXZj42L5pTAJUqfSB2vpCFgw",
  authDomain: "gfo-hack.firebaseapp.com",
  projectId: "gfo-hack",
  storageBucket: "gfo-hack.firebasestorage.app",
  messagingSenderId: "271327987206",
  appId: "1:271327987206:web:34b6a25e471d5c153f6587"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
