import React, { useState, useRef } from "react";
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
  TagLabel,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

//import { useMetamask } from "../hooks/useMetamask"
//import { create } from 'ipfs-http-client'
//import { useClient } from "../hooks/useClient";
//import * as Client from '@web3-storage/w3up-client'
import Web3 from 'web3'
import axios from "axios";
import abi from "./abi_contractaddress";
import { NFTStorage, File } from 'nft.storage'
const IssuerForm = () => {
  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
  });
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  //const { client } = useClient();
  const navigate = useNavigate();
  //const { isConnected } = useMetamask();
  const [studentemail,setEmail]=useState("")
  var location=useLocation()
  const [issueremail,setIssuermail]=useState(location.state)
  const [password,setPassword]=useState('')
  const storage = async (digitalSignature,documentHash) => {
    
    
    // Pinata JWT Token
    const PINATA_JWT_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZTNjNjA1MS00Njc2LTQwZjMtODExMC03N2YwNzM5ZDZiYTUiLCJlbWFpbCI6Im5rdW1hd2F0MzRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImZlZmY5MWU4ZWRhY2MzYzk4MjcwIiwic2NvcGVkS2V5U2VjcmV0IjoiMzMyNDcyYjc2ZjM1NThlOGRkNWI4MTdmN2RiNzQ0ZmQzZjhlYWU1OTgwMTcxMDgyZjM5ZDc4NTNkYjIxM2FlMiIsImlhdCI6MTcyNjM3MzY5M30.trKiXBvfDb_m7-fS7Mf4WZnzV6bfW_SrSPgJ7kSRVl0"; // Replace with your Pinata JWT token
  
    // Get the file from the input
    const fileInput = document.getElementById('pdfFile');
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
        Authorization: PINATA_JWT_TOKEN, // Add Pinata JWT for authentication
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
  
    // Assuming you have the necessary setup for Web3
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    console.log("issueremail-"+issueremail+"\n"+"File Name-"+selectedFile.name+
      "\n"+"CID-"+String(rootCid)+"\n"+"documentHAsh-"+documentHash+
      "\n"+"DigitalSIgnature-"+digitalSignature+"\n"+"studentemail-"+studentemail
    )
    //console.log(typeof(documentHash),typeof(digitalSignature))
    
    try {
      await abi.methods.uploadDocument(
          issueremail,
          selectedFile.name,
          String(rootCid),
          documentHash,
          digitalSignature,
          issueremail,
          studentemail
      ).send({ from: account});
      alert('Document successfully uploaded to the smart contract!');
  } catch (error) {
      console.error('Error interacting with smart contract:', error);
  }
     
  
    // Sending an email notification using Axios
    const fullPath = document.getElementById("pdfFile1").value;
    const startIndex = fullPath.lastIndexOf('\\') + 1;
    const fileName = fullPath.slice(startIndex);
  
    axios.get("http://localhost:3000/email", {
      params: {
        param1: issueremail,
        param2: fileName,
      },
    })
    .then(response => {
      alert('Email notification sent successfully!');
    })
    .catch(error => {
      console.error('Error sending email notification:', error);
    });
    
  };
  
  const getname=()=>{

    const fullPath=(document.getElementById("pdfFile").value)
    const startIndex = fullPath.lastIndexOf('\\') + 1; // Find the last backslash position
    const fileName = fullPath.slice(startIndex); // Get the file name after the last backslash
    setFile(fileName);
  }
  const encryptpdf = async () => {
    const fileInput = document.getElementById('pdfFile1');
    console.log(fileInput.files[0])
    const selectedFile = fileInput.files[0]; // Get the first selected file

    if (!selectedFile) {
        alert("Please select a PDF file to encrypt.");
        return;
    }

    if(!password)
        {
          alert("Please enter password for encryption")
          return ;
        }
    // Validate that the selected file is a PDF
    const validFileTypes = ['application/pdf'];
    if (!validFileTypes.includes(selectedFile.type)) {
        alert("Please select a valid PDF file.");
        return;
    }
   // alert(password)
    // Create FormData to send the file and parameters
    const formData = new FormData();
    formData.append('file', selectedFile); // Append the selected file
    formData.append('param1', selectedFile.name); // Append the file name for input
    formData.append('param2', `encrypted_${selectedFile.name}`); // Name for the output file
    formData.append('param3', password); // Password for encryption

    try {
        // Show loading indicator
        alert("Encrypting your PDF. Please wait...");

        // Send the POST request to the Flask backend
        const response = await axios.post("http://127.0.0.1:5000/encryptpdf", formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set content type for form data
            },
        });

        // Handle response
        if (response.data.success) {
            alert("PDF encrypted successfully!");

            // Optionally, provide a download link or functionality for the encrypted PDF
            // Assuming the response contains the download URL or you provide a direct download option
            // const downloadLink = document.createElement('a');
            // downloadLink.href = response.data.download_url; // Adjust according to your Flask response
            // downloadLink.download = response.data.param2; // File name for download
            // document.body.appendChild(downloadLink);
            // downloadLink.click();
            // document.body.removeChild(downloadLink);
        } else {
            alert("Encryption failed: " + response.data.message);
        }
    } catch (error) {
        console.error("Error encrypting PDF:", error);
        alert("An error occurred while encrypting the PDF.");
    }
};

  async function onSubmit(data) {
    const fileInput = document.getElementById('pdfFile');
   const imagepath=await abi.methods.getImagePath(issueremail).call()

const requestData = {
  param1: fileInput.files[0].name
}

  let digitalSignature,documentHash;
  console.log(fileInput.files[0].name)
   // Make a GET request with the data as query parameters
axios.get('http://localhost:3000/generate_digital_signature', {
  params:requestData
})
  .then(response => {
   
    digitalSignature=response.data.digitalSignature;
   
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error.message);
  });

  try {
    // Make the GET request to your API
    const response = await axios.get('http://localhost:3000/create_hash_document', {
      params: {
        filePath: fileInput.files[0].name
      }
    });

    // If the response is successful, set the document hash
    if (response.data.documentHash) {
      documentHash=response.data.documentHash ;
     
    }
  } catch (err) {
 console.log("Error in finding Hash of document")
  }

//  console.log(digitalSignature)
 //   storage(digitalSignature,documentHash)
  
//storage()
  //console.log(imagepath.imageName)
  axios.get('http://127.0.0.1:5000/liveface',{
  params:{
    param1:imagepath.imageID,
    param2:imagepath.imageName

  }})
  .then(response=>{
    storage(digitalSignature,documentHash)
    alert("Face Matched")
      

  }).catch(error)
  {
    console.log(error)
  }
    
  
 
  }

  return (
    <>
      <main>
        <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6} my={20}>
          <Text fontSize={"lg"} color={"teal.400"}>
            <ArrowBackIcon mr={2} />
            <Button onClick={()=>navigate('/is-registered/issuer',{
  state:issueremail
})}>Go Back</Button>
          </Text>

          <Stack>
            <Heading fontSize={"4xl"}>Issue a new certificate</Heading>
          </Stack>

          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl id="certificate_name">
                  <FormLabel>Certificate Name</FormLabel>
                  <Input
                    {...register("certificate_name", { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id="new_name">
                  <FormLabel>Student Name</FormLabel>
                  <Input
                    {...register("new_name", { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id="new_address">
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    {...register("new_address", { required: true })}
                    onChange={(e)=>setEmail(e.target.value)}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password for encryption of file</FormLabel>
                  <Input
                    {...register("password", { required: true })}
                    isDisabled={isSubmitting}

                    type="password"
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl id="doc">
                  <FormLabel>File Upload</FormLabel>
                  <input type="file" id="pdfFile1" name="pdfFile" accept=".pdf" required onChange={()=>encryptpdf()}/>
                </FormControl>

                <FormControl id="doc">
                  <FormLabel>Encrypted File</FormLabel>
                  <input type="file" id="pdfFile" name="pdfFile" accept=".pdf" required onChange={()=>getname()}/>
                </FormControl>
                {error ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription mr={2}> {error}</AlertDescription>
                  </Alert>
                ) : null}

                {errors.issuer_name || errors.new_address || errors.doc ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription mr={2}>
                      {" "}
                      All Fields are Required
                    </AlertDescription>
                  </Alert>
                ) : null}

                <Stack spacing={10}>
                  {/* conditional rendering if wallet is  connected will come here */}
                  <Stack spacing={3}>
                    {1 ? (
                      <Button
                        color={"white"}
                        bg={"teal.400"}
                        _hover={{
                          bg: "teal.300",
                        }}
                        type={"submit"}
                      >
                        Submit{" "}
                      </Button>
                    ) : (
                      <Alert status="warning">
                        <AlertIcon />
                        <AlertDescription mr={2}>
                          Please Connect Your Wallet First to Register
                        </AlertDescription>
                      </Alert>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </form>
          </Box>
          
        </Stack>
      </main>
      
    </>
  );
};

export default IssuerForm;
