import express from 'express';
const app = express();
const port = 3000;
import cors from 'cors';
import fs from 'fs'
import crypto from 'crypto'
app.use(cors()) // Use this after the variable declaration
import nodemailer from 'nodemailer'
import multer from 'multer';

// Set up multer with custom storage to preserve the original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify upload folder
  },
  filename: (req, file, cb) => {
    // Use the original file name
    cb(null, file.originalname); // You can also customize this if needed
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

function signDocument(privateKeyPath, documentPath) {
    // Read the private key
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    // Read the document content
    const documentContent = fs.readFileSync(documentPath, 'utf8');

    // Create a signature 
    const sign = crypto.createSign('SHA256');
    sign.update(documentContent);
    const signature = sign.sign(privateKey, 'base64');

    return signature;
}
app.get('/hello',(req,res)=>{
    return res.json("Hello")
})
// Define a route that responds with a JSON object
app.get('/generate_digital_signature', (req, res) => {

    const privateKeyPath = 'private_key.pem';
    //console.log(req.query.param1)
const documentPath = String(req.query.param1);

const digitalSignature = signDocument(privateKeyPath, documentPath);
//console.log(digitalSignature)
  res.json({ digitalSignature: digitalSignature });
});

function verifySignature(publicKeyPath, documentPath, signature) {
    // Read the public key
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

    // Read the document content
    const documentContent = fs.readFileSync(documentPath, 'utf8');

    // Create a verifier
    const verify = crypto.createVerify('SHA256');
    verify.update(documentContent);

    // Verify the signature
    const isSignatureValid = verify.verify(publicKey, signature, 'base64');

    return isSignatureValid;
}
app.get("/email", (req, res) => {
    
  const email=req.query.param1
  const filename=req.query.param2
 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'nkumawat34@gmail.com',
      pass: 'gzeghomqbdphbacx'
  },
  
});


function sendEmail(email) {
  
  const mailOptions = {
      from: 'nkumawat34@gmail.com',
      to: email, 
      subject: "Your Document " +filename+"has uploaded",
      text: "Your Document has been uploaded on the system "
  };

  
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
}



sendEmail(email);

 
});


// POST endpoint to verify the digital signature
app.get('/verify_digital_signature', (req, res) => {


  //console.log(req.query.nk)
  
  const digitalSignature=req.query.digitalSignature;
  const documentName=req.query.documentName;

  if (!digitalSignature || !documentName) {
    return res.status(400).json({ error: 'Digital signature and document name are required.' });
  }

  const documentPath = documentName; // Use the document name as the path to the file
  const publicKeyPath = 'public_key.pem'; // Path to the public key file

  try {
    // Call your verifySignature function here (ensure it's implemented properly)
    const isSignatureValid = verifySignature(publicKeyPath, documentPath, digitalSignature);

    // Send the response back to the client
    res.json({ isSignatureValid });

  } catch (error) {
    console.error('Error during signature verification:', error);
    res.status(500).json({ error: 'Error during signature verification', details: error.message });
  }
    
});


// Helper function to create SHA-256 hash of a file
function hashDocument(filePath) {
  // Create a hash object
  const hash = crypto.createHash('sha256');

  // Read the file and update the hash
  const fileBuffer = fs.readFileSync(filePath);
  hash.update(fileBuffer);

  // Return the hexadecimal hash value
  return hash.digest('hex');
}

// Create an endpoint to generate document hash
app.post('/create_hash_document',upload.single('file'), (req, res) => {
  // Get file path from query parameter
  const file = req.file;
//console.log(file.path)
  // Check if file path is provided
  if (!file) {
      return res.status(400).send('Please provide a file path');
  }

  // Check if the file exists
  if (!fs.existsSync(file.path)) {
      return res.status(404).send('File not found');
  }
  //console.log(file.path)
  
  try {
      // Generate the hash for the document
      const documentHash = hashDocument(file.path);

      // Return the document hash
      res.status(200).json({
          message: 'Document hash generated successfully',
          documentHash: documentHash,
      });
  } catch (error) {
      res.status(500).send('Error generating document hash');
  }
      
}); 
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
