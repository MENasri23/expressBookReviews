const express = require('express');
let books = require("./booksdb.js");
const { default: axios } = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const isbns = () => Object.keys(books);

const isUserRegistedBefore = (username) => {
  return users.some(user => user.username === username)
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(403).json({message: "Unable to register user"})
  }

  if (!isValid(username)) {
    return res.status(403).json({message: "Invalid username"})
  }

  if (isUserRegistedBefore(username)) {
    return res.status(403).json({message: "User already exists!"})
  }
  const count = users.push({
    username: username,
    password: password
  })

  if (count > 0) {
    res.status(200).send({message: "User successfully registred. Now you can login"});
  } else {
    return res.status(500).json({message: "Internal error"})
  }
  
});





async function getAllBooks() {
  return books
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  const result = await getAllBooks();
  res.send(result);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const result = new Promise((resolve) => {
    resolve(books[isbn]);
  })

  result.then((bookByIsbn) => {
    if (bookByIsbn) {
      res.send(bookByIsbn);
    } else {
      return res.status(404).json({ message: "Unable to find book with isbn: " + isbn });
    }
  })
});
  

function getBooksWithIsbnsByAuthor(author) {
  return Object.entries(books)
    .filter(([_, book]) => book.author === author)
    .map(([isbn, book]) => {
      return {
        isbn: isbn,
        title: book.title,
        reviews: book.reviews
      }
    })
}


// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  const result = new Promise((resolve) => {
    const authorBooksWithIds = getBooksWithIsbnsByAuthor(author)
    resolve(authorBooksWithIds)
  });

  result.then((booksByAuthors) => {
    if (booksByAuthors) {
      res.send({ booksByAuthor: booksByAuthors });
    } else {
      return res.status(404).json({ message: `Unable to find book for author: ${author}` });
    }
  })

});

function getBooksWithIsbnsByTitle(title) {
  return Object.entries(books)
     .filter(([_, book]) => book.title === title)
     .map(([isbn, book]) => {
       return {
         isbn: isbn,
         author: book.author,
         reviews: book.reviews
       }
     })
 }

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  const result = new Promise((resolve) => {
    const booksWithIdsByTitle = getBooksWithIsbnsByTitle(title)
    resolve(booksWithIdsByTitle);
  })

  result.then((booksByTitle) => {
    if (booksByTitle) {
      res.send({ booksByTitle: booksByTitle });
    } else {
      return res.status(404).json({ message: `Unable to find book for title: ${title}` });
    }
  })
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
