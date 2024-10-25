// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0OcVaPwp3ITYL27lhvI0RkDR8sbEi3a4",
  authDomain: "vibeboard-f4664.firebaseapp.com",
  projectId: "vibeboard-f4664",
  storageBucket: "vibeboard-f4664.appspot.com",
  messagingSenderId: "445157784554",
  appId: "1:445157784554:web:661a431c9efc8aad0cd093",
  measurementId: "G-Q9JTNPH6YR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app)

export { app, auth }