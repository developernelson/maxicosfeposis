// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// devfullstacknelson@gmail.com
const firebaseConfig = {
  apiKey: "AIzaSyD-h98vSNNWJN876rG6w8fPn9ulTnA-W9Y",
  authDomain: "posis-maxico.firebaseapp.com",
  projectId: "posis-maxico",
  storageBucket: "gs://posis-maxico.appspot.com",
  messagingSenderId: "304490417100",
  appId: "1:304490417100:web:1f5be9375df6880ecfab69"
};

// Initialize Firebase
export const firebase = () => initializeApp(firebaseConfig);

