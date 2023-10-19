const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books))});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.json(book);
    } else {
      return res.status(404).send('Book not found');
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const books_current_author = [];
    const isbnList = Object.keys(books);
    console.log(isbnList)
    for (const id of isbnList) {
      const book = books[id];
      console.log(book.author)
      if (book.author === author) {
        books_current_author.push(book);
      }
    }
  
    const numberOfBooks = books_current_author.length;
    console.log(`Number of books by ${author}: ${numberOfBooks}`);
    console.log('List of books:', books_current_author);
  
    // You can send the books_current_author array as a JSON response
    res.send(books_current_author);
  });
  


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
