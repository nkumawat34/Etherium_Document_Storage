import React, { useState } from 'react'

import { Link } from 'react-router-dom';
import { auth } from './Firebase_config';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import firebaseConfig from './firebase';
import University from './University';
import { useHistory } from "react-router-dom";

import { useNavigate } from 'react-router-dom';
export default function Login() {
    
  const navigate = useNavigate();
 
  const [email,setEmail]=useState("");
  const [password,Setpassword]=useState("");
  
 
 const signin=()=>{


  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
     
      localStorage.setItem("email",email)
      navigate('/is-registered/student',{
        state:email
      })
        
      // ...
    })
    .catch((error) => {
      
      const errorCode = error.code;
     
      const errorMessage = error.message;
    });

    
    
 } 
  return (
    <section class="vh-100">
  <div class="container-fluid h-custom">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          class="img-fluid" alt="Sample image"/>
      </div>
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form>
         

         
          <div class="form-outline mb-4">
            <input type="email" id="form3Example3" class="form-control form-control-lg"
              placeholder="Enter a valid email address" onChange={(e)=>setEmail(e.target.value)} />
            <label class="form-label" for="form3Example3">Email address</label>
          </div>

          
          <div class="form-outline mb-3">
            <input type="password" id="form3Example4" class="form-control form-control-lg"
              placeholder="Enter password" onChange={(e)=>Setpassword(e.target.value)}/>
            <label class="form-label" for="form3Example4">Password</label>
          </div>

          <div class="d-flex justify-content-between align-items-center">
           
            <div class="form-check mb-0">
              <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
              <label class="form-check-label" for="form2Example3">
                Remember me
              </label>
            </div>
            <Link to="/forgotpassword
            " class="text-body">Forgot password?</Link>
          </div>

          <div class="text-center text-lg-start mt-4 pt-2">
            <button type="button" class="btn btn-primary btn-lg"
              style={{PaddingLeft: "2.5rem", PaddingRight:" 2.5rem"}} onClick={()=>{signin()}}>Login</button>
            <p class="small fw-bold mt-2 pt-1 mb-0">Don't have an account? 
            <Link to="/register"

            
  class="link-danger">Register</Link></p>
          </div>

        </form>
      </div>
    </div>
  </div>
  <div
    class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
    
    <div class="text-white mb-3 mb-md-0">
      Copyright © 2023. All rights reserved.
    </div>
   
    <div>
      <a href="#!" class="text-white me-4">
        <i class="fab fa-facebook-f"></i>
      </a>
      <a href="#!" class="text-white me-4">
        <i class="fab fa-twitter"></i>
      </a>
      <a href="#!" class="text-white me-4">
        <i class="fab fa-google"></i>
      </a>
      <a href="#!" class="text-white">
        <i class="fab fa-linkedin-in"></i>
      </a>
    </div>
  
  </div>
</section>
  )
}
