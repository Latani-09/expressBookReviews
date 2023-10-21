const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    if (!username) {
      return false; // Missing username
    }
  
    return users.find(user => user.username === username) !== undefined;
  };
  
  const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
  
    if (!user) {
      return false; // User not found
    }
  
    // Compare the provided password with the stored password
    if (user.password === password) {
      return true; // Password matches
    } else {
      return false; // Password doesn't match
    }
  };
  
  // Login endpoint
  regd_users.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
          accessToken,username
      }
  
      return res.status(200).send('User successfully logged in');
    } else {
      return res.status(401).json({ message: 'Invalid Login. Check username and password' });
    }
  });
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const username=req.session.authorization.username;
  book.reviews[username]=req.body.review
  
  return res.status(200).send(`${username}'s review for book with bookno ${isbn} is updated`)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username=req.session.authorization.username;
    delete(book.reviews[username])
    
    return res.status(200).send(`${username}'s review for book with book no ${isbn} is deleted`)
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
