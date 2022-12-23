import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword ,
  updateProfile, sendEmailVerification} from "firebase/auth";


function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const signupHandler = (e) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User:", user);
        //sending verification email on signup
        sendEmailVerification(auth.currentUser).then(() => {
          // Email verification sent!
          // ...
        });

        //update user name 
        updateProfile(auth.currentUser, {
          displayName: name
        }).then(() => {
          // Profile updated!
          // ...
        }).catch((error) => {
          // An error occurred
          // ...
        });
        

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Signup error: ", error);
      });
    // e.reset()
  };

  return (
    <>
      <div>Signup Page </div>

      <form onSubmit={signupHandler}>
        Name:{" "}
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Enter your name"
          name="name"
        />
        <br />
        Email:{" "}
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
          name="email"
        />
        <br />
        Password:{" "}
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="password"
          name="new-password"
        />
        <button type="submit">Signup</button>
      </form>
    </>
  );
}
export default Signup;
