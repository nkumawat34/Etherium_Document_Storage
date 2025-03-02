import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputRightAddon,
  InputGroup,
  Alert,
  AlertIcon,
  AlertDescription,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";



import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {auth,storage} from './Firebase_config';
import firebaseConfig from './firebase';
import { collection, addDoc,doc ,updateDoc,getDocs,getDoc, query, where, onSnapshot} from "firebase/firestore"; 
import { useLocation } from 'react-router-dom';
import Web3 from 'web3';
import abi from "./abi_contractaddress";
import axios from 'axios';
//import { Web3Storage } from 'web3.storage'
import { FirebaseError } from 'firebase/app';
import abi_contractaddress from './abi_contractaddress';
import { signInWithEmailAndPassword } from "firebase/auth";
const Faculty = () => {
  const navigate = useNavigate();
  const [email,setEmail]=useState("");
  const [password,Setpassword]=useState("");
  
  
 const signin=()=>{
alert(email+password)

  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      localStorage.setItem("email",email)
      navigate('/is-registered/faculty',{
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
    <section className="vh-100" style={{marginTop:"80px"}}>
  <div className="container-fluid h-custom">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-9 col-lg-6 col-xl-5">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          className="img-fluid" alt="Sample image"/>
      </div>
      <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form>
         

         
          <div className="form-outline mb-4">
            <input type="email" id="form3Example3" className="form-control form-control-lg"
              placeholder="Enter a valid email address" onChange={(e)=>setEmail(e.target.value)} />
            <label className="form-label" for="form3Example3">Email address</label>
          </div>

          
          <div className="form-outline mb-3">
            <input type="password" id="form3Example4" className="form-control form-control-lg"
              placeholder="Enter password" onChange={(e)=>Setpassword(e.target.value)}/>
            <label className="form-label" for="form3Example4">Password</label>
          </div>

          <div className="d-flex justify-content-between align-items-center">
           
            <div className="form-check mb-0">
              <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
              <label className="form-check-label" for="form2Example3">
                Remember me
              </label>
            </div>
            <Link to="/forgotpassword
            " className="text-body">Forgot password?</Link>
          </div>

          <div className="text-center text-lg-start mt-4 pt-2">
            <button type="button" className="btn btn-primary btn-lg"
              style={{PaddingLeft: "2.5rem", PaddingRight:" 2.5rem"}} onClick={()=>{signin()}}>Login</button>
            <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? 
            <Link to="/register"

            
  className="link-danger">Register</Link></p>
          </div>

        </form>
      </div>
    </div>
  </div>
  <div
    className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
    
    <div className="text-white mb-3 mb-md-0">
      Copyright © 2023. All rights reserved.
    </div>
   
    <div>
      <a href="#!" className="text-white me-4">
        <i className="fab fa-facebook-f"></i>
      </a>
      <a href="#!" className="text-white me-4">
        <i className="fab fa-twitter"></i>
      </a>
      <a href="#!" className="text-white me-4">
        <i className="fab fa-google"></i>
      </a>
      <a href="#!" className="text-white">
        <i className="fab fa-linkedin-in"></i>
      </a>
    </div>
  
  </div>
  
 
</section>
  )
};

export default Faculty;
