import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCWYMSQUGghv1VMBjc1JiSxhPmvTMYmRI",
  authDomain: "gratitude--app.firebaseapp.com",
  projectId: "gratitude--app",
  storageBucket: "gratitude--app.appspot.com",
  messagingSenderId: "909143810727",
  appId: "1:909143810727:web:93cc38aa997bdc57fe7182",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore();

export { auth, db };
