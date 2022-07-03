import { useEffect, useRef, useState } from "react";
import { Message } from "./Components/Message";
import { app } from "./firebase";
import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logOutHandler = () => {
  signOut(auth);
};

function App() {
 

  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  //console.log(user);
  const divForScroll= useRef(null)

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setMessage("")
      divForScroll.current.scrollIntoView({
        behavior:"smooth"
      })
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    const q = query(collection(db,"Messages"),orderBy("createdAt","asc"));
    const unSubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    const unSubscribeForMessage =  onSnapshot(q,(snap)=>{
      setMessages(
          snap.docs.map((item)=>{
          const id = item.id;
          return {id,...item.data()};
        })
      );
    });
    return () => {
      unSubscribe();
      unSubscribeForMessage()
    };
  },[]);
  return (
    <Box bg={"red.50"}>
      {user ? (
        <Container h={"100vh"} bg={"white"}>
          <VStack h="full" paddingY={"4"}>
            <Button colorScheme={"red"} w={"full"} onClick={logOutHandler}>
              LogOut
            </Button>
            <VStack h={"full"} w={"full"} overflow="auto" 
            css={{
              "&::-webkit-scrollbar":{
                display: "none",
              }}}>
            {
            messages.map(item =>(
               <Message 
               key={item.id}
               text={item.text}
               user={item.uid === user.uid?"me":"other"}
               uri={item.uri}
              />
            ))
            }
              
            <div ref={divForScroll}></div>
            </VStack>
            <form style={{ width: "100%" }} onSubmit={submitHandler}>
              <HStack>
                <Input value={message}onChange={(e)=>{
                    setMessage(e.target.value)
                }} placeholder="Enter a Message..." />
                <Button
                  type="submit"
                  colorScheme={"purple"}
                  onClick={submitHandler}
                >
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack h={"100vh"} justifyContent={"center"}>
          <Button colorScheme={"purple"} onClick={loginHandler}>
            Sign In With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
