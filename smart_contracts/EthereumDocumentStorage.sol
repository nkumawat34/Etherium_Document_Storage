// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthereumDocumentStorage {
    // Structure to represent a document
    struct Document {
        string documentName;        // Name of the document
        string documentCId;          // Unique ID for the document
        string documentHash;        // Hash of the document (calculated off-chain)
        string documentSignature;   // Digital signature of the document
        string issuedBy;
        string issuedFor;
    }

    // Structure to represent a user
    struct User {
        string email;               // User's email address
        Document[] documents;       // Array of documents
        string imageID;
        string imageName;
    }

    // Structure to represent an image
    struct Image {
        string imageID;
        string imageName;
    }

    // Mapping from user email to User struct
    mapping(string => User) public users;
    string[] public user_emails;

    // Function to get all registered users
    function getAllUsers() public view returns (User[] memory) {
        User[] memory usersList = new User[](user_emails.length);
        for (uint i = 0; i < user_emails.length; i++) {
            usersList[i] = users[user_emails[i]];
        }
        return usersList;
    }

    // Function to register a new user
    function registerUser(string memory _email) public {
        require(bytes(_email).length > 0, "Email must not be empty");
        require(bytes(users[_email].email).length == 0, "User already registered");

        User storage newUser = users[_email];
        newUser.email = _email;
        user_emails.push(_email);
    }

    // Function to upload a document for a user
    function uploadDocument(
        string memory _email,
        string memory _documentName,
        string memory _documentId,
        string memory _documentHash,
        string memory _documentSignature,
        string memory _issuedBy,
        string memory _issuedFor
    ) public {
        require(bytes(_email).length > 0, "Email must not be empty");
        require(bytes(_documentName).length > 0, "Document name must not be empty");
        require(bytes(_documentId).length > 0, "Document ID must not be empty");
        require(bytes(_documentHash).length > 0, "Document hash must not be empty");
        require(bytes(_documentSignature).length > 0, "Document signature must not be empty");
        require(bytes(users[_email].email).length > 0, "User must be registered");

        User storage user = users[_email];
        Document memory newDocument = Document(
            _documentName,
            _documentId,
            _documentHash,
            _documentSignature,
            _issuedBy,
            _issuedFor
        );
        user.documents.push(newDocument);
    }

    // Function to verify a document based on document hash
    function verifyDocument(
        string memory _email,
        string memory _documentHash
    ) public view returns (string memory) {
        require(bytes(_email).length > 0, "Email must not be empty");
        require(bytes(_documentHash).length > 0, "Document hash must not be empty");

        User storage user = users[_email];
        for (uint256 i = 0; i < user.documents.length; i++) {
            if (keccak256(bytes(user.documents[i].documentHash)) == keccak256(bytes(_documentHash))) {
                // Return the signature of the matching document
                return user.documents[i].documentSignature;
            }
        }
        revert("Document not found or hash mismatch");
    }

    // Function to get the list of documents for a user
    function getDocuments(string memory _email) public view returns (Document[] memory) {
        return users[_email].documents;
    }

    // Function to delete a document by its documentId
    function deleteDocument(string memory _email, string memory _documentId) public {
        require(bytes(_email).length > 0, "Email must not be empty");
        require(bytes(_documentId).length > 0, "Document ID must not be empty");

        User storage user = users[_email];
        for (uint256 i = 0; i < user.documents.length; i++) {
            if (keccak256(bytes(user.documents[i].documentCId)) == keccak256(bytes(_documentId))) {
                // Shift elements to overwrite the target document
                for (uint256 j = i; j < user.documents.length - 1; j++) {
                    user.documents[j] = user.documents[j + 1];
                }
                user.documents.pop(); // Remove the last element
                return;
            }
        }
        revert("Document not found");
    }

    // Function to set image ID and name for a user
    function setImageID_Name(string memory _email, string memory _imageID, string memory _imageName) public {
        require(bytes(_email).length > 0, "Email must not be empty");

        User storage user = users[_email];
        user.imageID = _imageID;
        user.imageName = _imageName;
    }

    // Function to get the image path for a user
    function getImagePath(string memory _email) public view returns (Image memory) {
        User storage user = users[_email];
        return Image(user.imageID, user.imageName);
    }
}
