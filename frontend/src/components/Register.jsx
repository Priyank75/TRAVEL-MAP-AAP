import * as React from "react";
import { Cancel,   Room } from "@material-ui/icons";
import { useState,useRef } from "react";
import axios from "axios";
import "./Register.css";

export default function Register(props) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();



  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
       await axios.post("/api/users/register", newUser);
      console.log("Registered");
      setError(false);
      setSuccess(true);

      return;
    } catch (err) {
      console.log("Registered ERROR");
      setError(true);
      return;
    }
  };



  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
        <p text-color="black">Priyank PIN</p>
      </div>
      <form onSubmit={handleSubmit} >
        <input type="text" placeholder="username" ref={usernameRef} />
        <input type="email" placeholder="email" ref={emailRef}/>
        <input type="password" min="6" placeholder="password" ref={passwordRef} />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && <span className="success">Succesfully Registered</span>}
        {error && <span className="failure">Error Occured, Try Again</span>}
      </form>
      <Cancel className="registerCancel" onClick={
      ()=>{
        props.setShowRegister(false);
      }
      }/>
    </div>
  );
}
