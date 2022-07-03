
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC_tRt193VjpvH1WmlnZQ8rF2kjTH2C-jo",
  authDomain: "chatapp-3d4a3.firebaseapp.com",
  projectId: "chatapp-3d4a3",
  storageBucket: "chatapp-3d4a3.appspot.com",
  messagingSenderId: "1036166889429",
  appId: "1:1036166889429:web:9b94bf45b6fcd87fc7475c",
  measurementId: "G-K73QG7677P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);