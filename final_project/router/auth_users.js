const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const SECRET_KEY = 'access';
const TOKEN_EXPIRE_DURATION = 60 * 60;
const ACCESS_TOKEN_KEY = "accessToken";

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password)=>{ 
  return users.some(user => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = res.body.username;
  const password = res.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      payload = { data: username },
      secretOrPrivateKey = SECRET_KEY,
      options = { expiresIn:  TOKEN_EXPIRE_DURATION }
    );
  
    req.session.authorization = { ACCESS_TOKEN_KEY: accessToken }
    
    return res.status(200).send("User successfully logged in");
  }
  
  return res.status(208).json({message: "Invalid username or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.secretKey = SECRET_KEY;
module.exports.tokenKey = ACCESS_TOKEN_KEY;
