import React, { useState } from "react";
import { useEffect } from "react";
import {
  Heading,
  useBreakpointValue,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Container,
  Box,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tooltip,
  Tr,
  Th,
  Td,
  TableCaption,
  Skeleton,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Stack,
  SkeletonCircle,
  Divider,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";
import axios from "axios";
import Web3 from 'web3'
import abi from "./abi_contractaddress";
import { useLocation } from "react-router-dom";

const qr_code_download = (documentName, documentId) => {
  axios.get('http://127.0.0.1:5000/myfunction', {
      params: {
          param1: documentName,
          param2: documentId
      },
      responseType: 'blob' // Important to specify that you're expecting a binary file
  })
  .then(response => {
      // Create a Blob from the PDF Stream
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'qr_code.png'); // Specify the file name for download

      // Append to body
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up and remove the link
      link.remove();

      alert("QR code downloaded");
  })
  .catch(error => {
      console.error("Error downloading the QR code:", error);
      alert("Failed to download QR code");
  });
};
const IssuerIsRegistered = () => {
  
  const [certiCount, setCertiCount] = useState(0);
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();
  const location=useLocation();
  var email=location.state

  useEffect(() => {
    async function fetchDocuments() {
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
                const res = await abi.methods.getDocuments(email).call({ from: account });

                // Update state with the retrieved documents
                setCertificates(res);
                setCertiCount(res.length);
            } else {
                console.error('Ethereum provider is not available. Make sure you have MetaMask installed.');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    fetchDocuments();
}, [email]); // Added email as a dependency to refetch if it changes
  return (
    <main className={styles.main}>
      <Container py={{ base: "10", md: "12" }} maxW={"7xl"}>
        <Flex flexDirection={{ base: "column", lg: "row" }} py={4}>
          <Box py="2" pr="2">
            <Heading
              textAlign={useBreakpointValue({ base: "left" })}
              // fontFamily={"heading"}
              color={useColorModeValue("gray.800", "white")}
              as="h4"
              isTruncated
              maxW={"3xl"}
              size={"lg"}
            >
              You have Issued {certiCount} Certificates
            </Heading>
          </Box>
          <Spacer />
          <Box py="2">
            
              <Button
                display={{ sm: "inline-flex" }}
                justify={"flex-end"}
                fontSize={"md"}
                fontWeight={600}
                color={"white"}
                bg={"teal.400"}
                href={"#"}
                _hover={{
                  bg: "teal.300",
                }}
                onClick={()=>{navigate("/issuer/new-certificate",{
                state:email
                }
                )}}
              >
                
                Issue New Certificate
              </Button>
            
          </Box>
        </Flex>{" "}
        {/* <Divider marginTop="4" /> */}
        <Box overflowX="auto">
          <Table>   ~ ` ~`
            <Thead bg={useColorModeValue("teal.200", "teal.700")}>
              <Tr>
                <Th w={"15%"}>Name</Th>
                <Th w={"30%"}>CID</Th>
                {/* <Th w="30%">Name </Th> */}
                <Th w="40%">Issued To </Th>
                {/* <Th maxW="12%" isTruncated>
                  Wallet Address
                </Th> */}
                <Th w="40%">Link to certificate </Th>
                <Th w="40%">QR COde </Th>
              </Tr>
            </Thead>
            <Tbody
              bg={useColorModeValue("teal.100", "teal.700")}
              opacity={"0.9"}
            >
              {certificates.map((cert) => {
                return (
                  <Tr key={cert.documentId}>
                    <Td>{cert.documentName}</Td>
                    <Td>{cert.documentCId}</Td>
                    {/* <Td>Sem-6 Marksheet</Td> */}
                    <Td>{cert.issuedFor}</Td>
                    
                    <Td>

                    <a href={"https://gateway.pinata.cloud/ipfs/"+cert.documentCId} target={'_blank'} className="btn btn-primary">Download</a>
                    </Td>
                    <Td><button className="btn btn-primary" onClick={()=>qr_code_download(cert.documentName,cert.documentCId)}>Download</button></Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Container>
    </main>
  );
};

export default IssuerIsRegistered;
