
import './App.css';
import { Routes, Route , Link, Navigate} from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Home from "./components/home"
import About from "./components/about"
import Gallery from "./components/gallery"
import Login from "./components/login"
import Signup from "./components/signup"
import { useEffect, useState } from 'react';


function App() {


const [isLogin, setIsLogin]=useState(false);
const [fullName, setFullName] = useState("");

useEffect(()=>{
  
  const auth = getAuth();

  

  const unSubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log("auth change", user);
      setIsLogin(true)

      console.log("dasdsa",auth.currentUser);
      setFullName(auth.currentUser.displayName);
      // ...
    } else {
  
      console.log("auth change logout")
      // User is signed out
      // ...
      setIsLogin(false)
    }

    return ()=>{
      unSubscribe();
    }
  });




},[])

const logoutHandler = () => {

  const auth = getAuth();
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("Signout Successful");
  }).catch((error) => {
    // An error happened.
    console.log("Signout Fail")
  });
}




  return (
    <div className="App">
      
    <button onClick={()=>{
      setIsLogin(!isLogin)
    }}>Toggle login test</button>

    {
      (isLogin)?
      <ul className='navBar'>
      <li> <Link to= {`/`}> Home </Link> </li>
      <li> <Link to= {`gallery`}> Gallery </Link> </li>
      <li> <Link to= {`about`}> About </Link> </li>
      <li> <Link to= {`profile`}> Profile </Link> </li>
      <li><button onClick={logoutHandler}>Logout</button></li>
      <li>{fullName}</li>
    </ul>
    :
    <ul className='navBar'>
    <li> <Link to= {`/`}> login </Link> </li>
    <li> <Link to= {`signup`}> SignUp </Link> </li>
  </ul>
    }
   
   

    {
    (isLogin)?
    <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="about" element={<About />}/>
    <Route path="gallery" element={<Gallery />} />
    <Route path="*" element={<div>Page not Found! </div>}/>
      </Routes>
      :
      <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="signup" element={<Signup />}/>
      <Route path="*" element={<Navigate to="/" replace={true} /> }/>
        </Routes>
    }


    </div>
  );
}

export default App;
