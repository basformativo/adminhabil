import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5dinrHs5KvHDO8KOUxQpwBq40v9nZPg8",
  authDomain: "basquet-formativo.firebaseapp.com",
  projectId: "basquet-formativo",
  storageBucket: "basquet-formativo.appspot.com",
  messagingSenderId: "366975104179",
  appId: "1:366975104179:web:7a7c312106781616342cc6",
  measurementId: "G-4J9SYL1T1Z"
};  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

export { db };

export { auth, provider, signInWithPopup, signOut };