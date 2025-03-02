import React, { useState } from 'react'
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
import { NFTStorage } from 'nft.storage';



export default function Register(props) {
  
  const location = useLocation();
  const [file,setFile]=useState("")

  


 const [email,Setemail]=useState("");
const [password,Setpassword]=useState("");

const [repassword,setRePassword]=useState("")
const [name,setName]=useState("")

const auth = getAuth();
var usertype= location.state;

    const getname=()=>{

      const fullPath=(document.getElementById("f").value)
      const startIndex = fullPath.lastIndexOf('\\') + 1; // Find the last backslash position
      const fileName = fullPath.slice(startIndex); // Get the file name after the last backslash
      setFile(fileName);
    }

    const storage = async () => {
      // Pinata JWT Token
      const PINATA_JWT_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZTNjNjA1MS00Njc2LTQwZjMtODExMC03N2YwNzM5ZDZiYTUiLCJlbWFpbCI6Im5rdW1hd2F0MzRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImZlZmY5MWU4ZWRhY2MzYzk4MjcwIiwic2NvcGVkS2V5U2VjcmV0IjoiMzMyNDcyYjc2ZjM1NThlOGRkNWI4MTdmN2RiNzQ0ZmQzZjhlYWU1OTgwMTcxMDgyZjM5ZDc4NTNkYjIxM2FlMiIsImlhdCI6MTcyNjM3MzY5M30.trKiXBvfDb_m7-fS7Mf4WZnzV6bfW_SrSPgJ7kSRVl0"; // Replace with your Pinata JWT token
    
      // Get the file from the input
      const fileInput = document.getElementById('f');
      const selectedFile = fileInput.files[0];
    
      if (!selectedFile) {
        alert('Please select a file.');
        return;
      }
    
      // Create FormData for the file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
    
      // Pinata API request options
      const options = {
        method: 'POST',
        headers: {
          'Authorization': PINATA_JWT_TOKEN, // Add Pinata JWT for authentication
        },
        body: formData,
      };
      let rootCid;
      
      try {
        // Upload file to Pinata
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', options);
        const result = await response.json();
        rootCid = result.IpfsHash; // Extract CID from the response
        alert(`File uploaded successfully! CID: ${rootCid}`);
      } catch (error) {
        console.error('Error uploading file to Pinata:', error);
        return;
      }
        
      try {
      
        let provider = window.ethereum;
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const account=accounts[0]
       // alert("Hi")
        //console.log(account)
        // Assuming `abi` and `email` are defined elsewhere in your code
        await abi.methods.setImageID_Name(email,String(rootCid),selectedFile.name).send({ from: account});
       
        } catch (error) {
        console.error('Error uploading file to Pinata:', error);
      }
    };
    
const signup= async ()=>{

  
  if(password!=repassword)
    {
      alert("Sorry you have entererd wrong password");
      return ;
    }
   
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    
    
   
      
      if(usertype!="student")
      await abi.methods.registerUser(email).send({ from: accounts[0] });
     
      storage()
    
   
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in s
    const user = userCredential.user;
    alert("Registered");

    
    //user1(email,password,name)
    
    
  })
  .catch((error) => {
    
    const errorCode = error.code;
    
    const errorMessage = error.message;
    // ..
  });
  
}

  return (
    <section class="vh-100" style={{BackgroundColor: "#eee"}}>
     
  <div class="container h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-lg-12 col-xl-11">
        <div class="card text-black" style={{BorderRadius: "25px"}}>
          <div class="card-body p-md-5">
            <div class="row justify-content-center">
              <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                <form class="mx-1 mx-md-4">
                <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <input type="text" id="form3Example1c" class="form-control" onChange={(e)=>setName(e.target.value)}/>
                      <label class="form-label" for="form3Example1c">Your Name</label>
                    </div>
                  </div>
                  
                  

                  
                 
                  <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <input type="email" id="form3Example3c" class="form-control"  onChange={(e)=>{Setemail(e.target.value)}}/>
                      <label class="form-label" for="form3Example3c">Your Email</label>
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <input type="password" id="form3Example4c" class="form-control" onChange={(e)=>Setpassword(e.target.value)}/>
                      <label class="form-label" for="form3Example4c">Password</label>
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-key fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <input type="password" id="form3Example4cd" class="form-control"  onChange={(e)=>setRePassword(e.target.value)}/>
                      <label class="form-label" for="form3Example4cd">Repeat your password</label>
                    </div>
                  </div>

                  <div class="form-check d-flex justify-content-center mb-5">
                   <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3c" />
                   
  
                    <label class="form-check-label" for="form2Example3">
                      I agree all statements in <a href="#!">Terms of service</a>
                    </label>
                  </div>
                  <center> {usertype!="student"?<input type="file" id="f" onChange={()=>getname()}></input>:"" }</center>
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="button" class="btn btn-primary btn-lg" style={{marginTop:"5px"}} onClick={()=>{signup()}}>Register</button>
                  </div>

                </form>

              </div>
              <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                  class="img-fluid" alt="Sample image"/>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}
