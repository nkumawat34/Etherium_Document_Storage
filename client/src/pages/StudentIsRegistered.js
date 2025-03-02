import React from "react";
import { useState, useEffect } from "react";
import {
  Heading,
  Container,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  SkeletonCircle,
  Divider,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

import abi from "./abi_contractaddress"
import Web3 from "web3";
import { useLocation } from "react-router-dom";
const StudentIsRegistered = () => {
 
  const [certiCount, setCertiCount] = useState(0);
  const [certificates, setCertificates] = useState([]);
  const [viewCertificateUrl, setViewCertificateUrl] = useState([]);
  const navigate = useNavigate();  
  const location=useLocation();
  var email=location.state
  
  useEffect(() => {
    async function fn() {
     
      
       
        let provider = window.ethereum;
  
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      
       let res=await abi.methods.getAllUsers().call();
       
       let res1=[];
      
       for(let i=0;i<res.length;i++)
        {
          
        
          for(let j=0;j<res[i].documents.length;j++)
            {
              
              if(res[i].documents[j].issuedFor==email)
                {
                  res1.push(res[i].documents[j]);

                }
            }
          
        }
       setCertificates(res1);
       setCertiCount(res1.length);
    }
    fn();
  },[]);

  return (
    <main className={styles.main}>
      <Container py={{ base: "10", md: "12" }} maxW={"7xl"}>
        <HStack spacing={2}>
          <SkeletonCircle size="4" />
          <Heading as="h4" size="lg" textAlign="left" ml="-2">
            Found {certiCount} Certificates
          </Heading>
        </HStack>

        <Divider marginTop="4" />

        <Box overflowX="auto">
          <Table>
            <Thead bg={useColorModeValue("teal.200", "teal.700")}>
              <Tr>
                <Th w={"15%"}>Name</Th>
                <Th w={"30%"}>UUID</Th>
                {/* <Th w="30%">Name </Th> */}
                <Th w="40%">Issued By</Th>
                {/* <Th maxW="12%" isTruncated>
                  Wallet Address
                </Th> */}
                <Th w="40%">Link to certificate </Th>
              </Tr>
            </Thead>
            <Tbody
              bg={useColorModeValue("teal.100", "teal.700")}
              opacity={"0.9"}
            >
              {certificates.map((cert) => {
                console.log(cert);
                return (
                  <Tr>
                    <Td>{cert.documentName}</Td>
                    <Td>{cert.documentCId}</Td>
                    <Td>{cert.issuedBy}</Td>
                    <Td><a href={"https://gateway.pinata.cloud/ipfs/"+cert.documentCId} target={'_blank'} className="btn btn-primary">Download</a></Td>
                    {/* <Td>Sem-6 Marksheet</Td> */}
                   
                   
                  </Tr>
                );
              })}

              {/* <Tr>
                <Td>2</Td>
                <Td>HSC Marksheet</Td>
                <Td>SVP College of Science and Commerce</Td>
                <Td>0xffeyyeyeyeye</Td>
                <Td>
                  <Link to="https://">https://</Link>
                </Td>
              </Tr>
              <Tr>
                <Td>3</Td>
                <Td>SSC Marksheet</Td>
                <Td>Shantinagar HighSchool</Td>
                <Td>0xffeyyeyeyeye</Td>
                <Td>
                  <Link to="https://">https://</Link>
                </Td>
              </Tr> */}
            </Tbody>
          </Table>
        </Box>
      </Container>
    </main>
  );
};

export default StudentIsRegistered;
