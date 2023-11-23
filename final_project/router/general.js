const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const isbns = () => Object.keys(books);


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const result = isbns().map(isbn => books[isbn]);
  res.send(result);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookByIsbn = books[isbn];
  if (bookByIsbn) {
    res.send(bookByIsbn);
  } else {
    return res.status(404).json({message: "Unable to find book with isbn: " + isbn});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookIsbn = isbns().find(isbn => books[isbn].author === author);
  if (bookIsbn) {
    res.send(books[bookIsbn]);
  } else {
    return res.status(404).json({message: `Unable to find book for author: ${author}`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookIsbn = isbns().find(isbn => books[isbn].title === title);
  if (bookIsbn) {
    res.send(books[bookIsbn]);
  } else {
    return res.status(404).json({message: `Unable to find book for title: ${title}`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book.reviews)
  } else {
    return res.status(404).json({message: "Unable to find reviews for book with isbn: " + isbn});
  }
});

module.exports.general = public_users;
