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
  Toast,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Web3 from 'web3'
import abi from "./abi_contractaddress";
import axios from "axios";

//import { useMetamask } from "../hooks/useMetamask";
//import { useClient } from "../hooks/useClient";

const VerifyForm = () => {
  //const { client } = useClient();
  const [error, setError] = useState("");
  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
  });
  //const { isConnected } = useMetamask();
   
 
  //const inputRef = useRef();
  //const toast = useToast();
  async function onSubmit(data) {
    //const formData = new FormData();
    const fileInput = document.getElementById('pdfFile');
    const formData = new FormData();
    console.log(fileInput.files[0])
    // Append the file to formData
    formData.append("file", fileInput.files[0]);
   
    let documentHash,digitalSignature;
    try {
      // Make the POST request to your API
      const response = await axios.post('http://localhost:3000/create_hash_document', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });

      // If the response is successful, set the document hash
      if (response.data.documentHash) {
          documentHash = response.data.documentHash;
          console.log('Document Hash:', documentHash);
      }
  } catch (err) {
      console.log("Error in finding Hash of document", err);
  }

  console.log(documentHash,data.Issued_by)
 
  try {
    // Check if the Ethereum provider is available
    if (typeof window.ethereum !== 'undefined') {
        const provider = window.ethereum;

        // Request account access if needed
        await provider.request({ method: 'eth_requestAccounts' });

        // Create a new Web3 instance
        const web3 = new Web3(provider);

        // Get the user's accounts
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
     
        // Call the smart contract method
        const res = await abi.methods.verifyDocument(data.Issued_by,documentHash).call({ from: account });
        //console.log(res)
        console.log(res)
       digitalSignature=res;
    } else {
        console.error('Ethereum provider is not available. Make sure you have MetaMask installed.');
    }
} catch (error) {
  if (error.message.includes('Document not found or hash mismatch')) {
    alert("Not Verified")
  } else {
    console.error('An unexpected error occurred:', error);
  }
}  
//const formData2 = new FormData();
//console.log(fileInput.files[0]);
//fileInput.files[0].nk="nk"
// Append the file to formData
//formData2.append("file", fileInput.files[0]);
//console.log(fileInput.files[0].name)
// Append additional data (digitalSignature and documentHash) to formData
//formData2.append("digitalSignature", digitalSignature);
//formData2.append("documentHash", documentHash);

// Sending the request using POST
// Make a GET request with query parameters

// Sending the request using POST with the body containing the data
axios.get(`http://localhost:3000/verify_digital_signature`,
  {params:
    {
      digitalSignature:digitalSignature,
      documentName:"uploads/"+fileInput.files[0].name
    }
  }
)
  .then(response => {
    // Handle the response
    if (response.data.isSignatureValid) {
      alert("Verified");
    } else {
      alert("Not verified");
    }
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error.message);
  });

const formData2= new FormData();
formData2.append("digitalSignature", digitalSignature);
formData2.append("documentName", "uploads/" + fileInput.files[0].name);



  }

  return (
    <>
      <main>
        <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6} my={20}>
          <Text fontSize={"lg"} color={"teal.400"}>
            <ArrowBackIcon mr={2} />
            <Link to="/is-not-registered">Back to Home</Link>
          </Text>

          <Stack>
            <Heading fontSize={"4xl"}>Verify a document 📃</Heading>
          </Stack>

          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl id="Issued_by">
                  <FormLabel>Issuer Email Address</FormLabel>
                  <Input
                    {...register("Issued_by", { required: true })}
                    isDisabled={isSubmitting}
                    
                  />
                </FormControl>

                <FormControl id="Issued_to">
                  <FormLabel>Student's Email Address</FormLabel>
                  <Input
                    {...register("Issued_to", { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>

                <FormControl id="target">
                  <FormLabel>File Upload</FormLabel>
                  <input type="file" id="pdfFile" name="pdfFile" accept=".pdf" required />
                    Only PDF format is acceptable
                  
                </FormControl>

                {error ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription mr={2}> {error}</AlertDescription>
                  </Alert>
                ) : null}

                {errors.minimumContribution ||
                errors.name ||
                errors.description ||
                errors.UUID ||
                errors.target ? (
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
                        type="submit"
                      >
                        Submit{" "}
                      </Button>
                    ) : (
                      <Alert status="warning">
                        <AlertIcon />
                        <AlertDescription mr={2}>
                          Please Connect Your Wallet to Register
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

export default VerifyForm;
