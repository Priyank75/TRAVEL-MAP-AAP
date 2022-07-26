import * as React from "react";
import { Cancel, Room } from "@material-ui/icons";
import { useState,useRef } from "react";
import axios from "axios";
import "./Login.css";

export default function Login(props) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/api/users/login", user);
        props.myStorage.setItem("user",res.data.username)
        props.setCurrentUser(res.data.username);
        props.setShowLogin(false);
      console.log("Logged in");
      setError(false);
      return;
    } catch (err) {
        console.log("Logged in ERROR");
      setError(true);
      return;
    }
  };



  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        <p text-color="black">Priyank PIN</p>
      </div>
      <form onSubmit={handleSubmit} >
        <input type="text" placeholder="username" ref={usernameRef} />
        <input type="password" min="6" placeholder="password" ref={passwordRef} />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Error Occured, Try Again</span>}
      </form>
      <Cancel className="loginCancel" onClick={
      ()=>{
        props.setShowLogin(false);
      }
      }/>
    </div>
  );
}
