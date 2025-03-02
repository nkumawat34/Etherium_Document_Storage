import "./App.css";
import { useEffect, useState } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import RegisteredUserPage from "./pages/RegisteredUserPage";
import VerifyForm from "./pages/VerifyForm";
import StudentForm from "./pages/StudentForm";
import IssuerForm from "./pages/IssuerForm";
import NotRegisteredUserPage from "./pages/NotRegisteredUserPage";
import StudentIsRegistered from "./pages/StudentIsRegistered";
import IssuerIsRegistered from "./pages/IssuerIsRegistered";
import IssueNewCertiForm from "./pages/IssueNewCertiForm";
import ConnectWalletPage from "./pages/ConnectWalletPage";
import CertificatePage from "./pages/CertificatePage";

import WarningInstallMetaMask from "./pages/WarningInstallMetaMask";
import Faculty from "./pages/Faculty";

import FacultyUploadForm from "./pages/FacultyUploadForm";

import Register from "./pages/Register";
import Uploadform_teacher from "./pages/Uploadform_teacher";
import Student_Types from "./pages/Student_Types";


function App() {
  

  


  return (
    <>
      <ChakraProvider>
        <Router>
          <Navbar />

          <Routes>
            <Route exact path="/" element={<ConnectWalletPage />}></Route>
            <Route exact path="/register" element={<Register/>}></Route>
            <Route exact path="/home" element={<LandingPage />}></Route>
            <Route
              exact
              path="/connect-wallet"
              element={<ConnectWalletPage />}
            ></Route>
            <Route
              exact
              path="/install-metamask"
              element={<WarningInstallMetaMask />}
            ></Route>

            {/* choice b/w issuer and student */}
            <Route
              exact
              path="/is-registered"
              element={<RegisteredUserPage />}
            ></Route>

            {/* displays list of certificates issued to the student by various orgs */}
            <Route
              exact
              path="/is-registered/student"
              element={<StudentIsRegistered />}
            ></Route>

            {/* displays list of certificates issued by Issuer to various students */}
            <Route
              exact
              path="/is-registered/issuer"
              element={<IssuerIsRegistered />}
            ></Route>

            {/* form for new certificate */}
            <Route
              exact
              path="/issuer/new-certificate"
              element={<IssueNewCertiForm />}
            ></Route>
             {/* form for new certificate */}
             <Route
              exact
              path="/faculty/new-document"
              element={< Uploadform_teacher/>}
            ></Route>
            <Route
              exact
              path="/is-registered/faculty"
              element={<FacultyUploadForm />}
            ></Route>
            {/* displays 3 btns: register as issuer, student, verifier */}
            <Route
              exact
              path="/is-not-registered"
              element={<NotRegisteredUserPage />}
            ></Route>

            {/* verify form, containing fields: Issued by, Issued to, UUID and file upload */}
            <Route
              exact
              path="/is-not-registered/verify"
              element={<VerifyForm />}
            ></Route>

            <Route
              exact
              path="/is-not-registered/student"
              element={<Student_Types />}
            ></Route>
            <Route
              exact
              path="/is-not-registered/issuer"
              element={<IssuerForm />}
            ></Route>
             <Route
              exact
              path="/is-not-registered/faculty"
              element={<Faculty />}
            ></Route>
            {/* displays certificate details issued to the student */}
           
             <Route
              exact
              path="/is-not-registered/btech"
              element={<StudentForm />}
            ></Route>
             <Route
              exact
              path="/is-not-registered/mtech"
              element={<StudentForm />}
            ></Route>
             <Route
              exact
              path="/is-not-registered/phd"
              element={<StudentForm />}
            ></Route>
          </Routes>
        </Router>{" "}
      </ChakraProvider>
    </>
  );
}

export default App;

