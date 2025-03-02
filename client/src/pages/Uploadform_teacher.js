
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
export default function Uploadform_teacher() {

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

  const storage= async ()=>{
 

    const NFT_STORAGE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhjQWQ4MTc5MTM3MDJEYUY0OTBGNzIxNmUyY0I0QzVjMjI5Q2QwQjQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwNTg5MTUxNzI5MywibmFtZSI6Im10ZWNoZmluYWx5ZWFyIn0.47qts7qFx6EqvEe8LnxvLy_O_vmc6iujr_LipFhYLNg"
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
    const fileInput = document.getElementById('pdfFile');
    var rootCid;
    const selectedFile = fileInput.files[0];

    // Create a File object
    const file = new File([selectedFile], selectedFile.name, { type: selectedFile.type });
    
    // Create a Blob from the File
    const someData = new Blob([file]);
    
    // Assuming `client.storeBlob` is asynchronous, use try-catch to handle errors
    try {
       rootCid = await client.storeBlob(someData);
      
    } catch (error) {
      console.error('Error storing Blob:', error);
    }
      // Use the file in your client.store method
    //  const metadata = await client.store({
      //  name: 'My Uploaded File',
       // description: 'A description for the uploaded file',
       // image: file
      //});
      //const url = new URL(metadata.url);
//const pathSegments = url.pathname.split('/');
  //      rootCid = pathSegments[pathSegments.length - 2];
   //   console.log('File uploaded successfully: ', rootCid)
    //} else {
      //console.log('Please select a file.');
    //}
     
     
       // Pack files into a CAR and send to web3.storage
   // const rootCid = await client.uploadFile(fileInput.files) // Promise<CIDString>
   
    let provider = window.ethereum;
      
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    
    alert("sad")
    await abi.methods.uploadDocument(issueremail,file.name,String(rootCid),issueremail,studentemail).send({ from: accounts[0],gas: 300000 });
    const fullPath=(document.getElementById("pdfFile1").value)
    const startIndex = fullPath.lastIndexOf('\\') + 1; // Find the last backslash position
    const fileName = fullPath.slice(startIndex); // Get the file name after the last backslash
    axios.get("https://etherium-document-storage.onrender.com/email",{

    params:{
      param1:studentemail,
      param2:fileName
    }
  })
    
  }

  const encryptpdf=()=>{
    
    const fullPath=(document.getElementById("pdfFile1").value)
    const startIndex = fullPath.lastIndexOf('\\') + 1; // Find the last backslash position
    const fileName = fullPath.slice(startIndex); // Get the file name after the last backslash
   
    axios.get("http://127.0.0.1:5000/encryptpdf",{
      params:{
        param1:fileName,
        param2:"output.pdf",
        param3:"Nk@12351235"
      }
    }).then(response=>{
      
    })
  
}
async function onSubmit(data) {
  const fileInput = document.getElementById('pdfFile');
  const imagepath=await abi.methods.getImagePath(issueremail).call()
 alert(imagepath.imageID)
 const fullPath=(document.getElementById("pdfFile1").value)
 const startIndex = fullPath.lastIndexOf('\\') + 1; // Find the last backslash position
 const fileName = fullPath.slice(startIndex); // Get the file name after the last backslash
 // Define the data you want to pass
  

/*
axios.get('http://127.0.0.1:5000/liveface',{
params:{
  param1:imagepath.imageID,
  param2:imagepath.imageName

}})
.then(response=>{
  //Handle erros
  if(response.data=="No")
      alert("You cannot upload document")
  else
    {
      alert("Hi Face recognized")
      storage()
      axios.get("http://localhost:3000/email",{
    params:{
      param1:studentemail
    }
  })

    }
    


})
  /*
 alert("Hi")
axios.get("https://etherium-document-storage.onrender.com/email",{
    params:{
      param1:issueremail,
      param2:fileName
    }
  })
//storage()
*/
}

  return (
    <main>
    <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6} my={20}>
      {
        
      <Text fontSize={"lg"} color={"teal.400"}>
        <ArrowBackIcon mr={2} />
        <Button onClick={()=>navigate('/is-registered/faculty',{
  state:issueremail
})}>Go Back</Button>
      </Text>
}
      <Stack>
        <Heading fontSize={"4xl"}>Uploading the Document</Heading>
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
            
             
           

            <FormControl id="doc">
              <FormLabel>File Upload</FormLabel>
              <input type="file" id="pdfFile1" name="pdfFile" accept=".pdf" required onChange={()=>encryptpdf()}/>
            </FormControl>

            <FormControl id="doc">
              <FormLabel>Encrypted File</FormLabel>
              <input type="file" id="pdfFile" name="pdfFile" accept=".pdf" required />
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
  )
}
