const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const SECRET_KEY = 'access';
const TOKEN_EXPIRE_DURATION = 60 * 60;
const ACCESS_TOKEN_KEY = "accessToken";

let users = [];

const isValid = (username)=>{ //returns boolean
  return true;
}

const authenticatedUser = (username, password)=>{ 
  return users.some(user => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      payload = { data: username },
      secretOrPrivateKey = SECRET_KEY,
      options = { expiresIn:  TOKEN_EXPIRE_DURATION }
    );
  
    req.session.authorization = { accessToken }
    
    return res.status(200).send(accessToken);
  }
  
  return res.status(208).json({message: "Invalid username or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn]

  if (book) {
    const newReview = req.query.review;
    const username = req.body.username;

    const reviews = book.reviews;
    const reviewsIds = Object.keys(reviews);
    
    if (reviewsIds.length > 0) {
      const userReviewId = reviewsIds.find(id => reviews[id].user === username)
      if (isUserAddedReview) {
        reviews[userReviewId].review = newReview;
      } else {
        const lastId = Math.math(reviewsIds);
        reviews[lastId + 1] = { username: username, review: newReview };
      }
    } else {
      reviews[1] = { username: username, review: newReview }
    }
    res.send(book);

  } else {
    return res.status(404).json({message: "Unable to update reviews for book with isbn: " + isbn});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user;
  const isbn = req.params.isbn;

  const reviews = books[isbn].reviews;
  if (reviews) {
    const deleteReviewId = Object.keys(reviews).find(id => reviews[id].username === username);
    delete reviews[deleteReviewId];
    res.send("Review deleted successfully");
  } else {
    return res.status(404).json({message: "Unable to find book with isbn: " + isbn})
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.secretKey = SECRET_KEY;
module.exports.tokenKey = ACCESS_TOKEN_KEY;
