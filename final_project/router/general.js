const express =require( 'express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if (!username||!password){
      return res.status(400).json("provide password and username in body as json input");
  }
  const usernames = users.map(user => user.username);
  console.log(usernames)
  if (usernames.includes(username)){
  return res.status(409).json({message: "username already taken. try a different one"});}
  const user={
      "username":username,
      "password":password
  };
  users.push(user);
  return res.send( `user registered with username ${username} `);
});
function getBooks(){
    return new Promise((resolve,reject)=>{
        resolve(books);
    });
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const bks = await getBooks();
      res.send(JSON.stringify(bks));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
// Get book details based on ISBN
function getbook_id(isbn){
    return new Promise((resolve,reject)=>{
        resolve(books[isbn]);
    });
}
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const book = await getbook_id(isbn);
    if (book) {
      return res.json(book);
    } else {
      return res.status(404).send('Book not found');
    }
  });
  
// Get book details based on author
function getbooks_author(author){
    return new Promise((resolve,reject)=>{
        let books_current_author=[]
        isbnList=Object.keys(books);
        for (const id of isbnList) {
          const book = books[id];
          console.log(book.author)
          if (book.author === author) {
            books_current_author.push(book);
          }
        }
        resolve(books_current_author);
    });
}
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    res.send(await getbooks_author(author));
  });
  
  function getbooks_title(title){
    return new Promise((resolve,reject)=>{
    isbnList= Object.keys(books);
    let books_title=[]
    for (const id of isbnList) {
    const book = books[id];
    if (book.title === title) {
        books_title.push(book);
    }
    }
        resolve(books_title);
    });
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    res.send(await getbooks_title(title));
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.send(book.reviews);
    } else {
      return res.status(404).send('Book not found');
    }
  });

module.exports.general = public_users;
