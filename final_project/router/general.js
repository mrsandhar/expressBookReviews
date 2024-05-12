const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    } 
    return res.status(404).json({message: "Please provide a username and password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify({books}, null, 5));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_isbn = Object.values(books).filter((book) => book.isbn === isbn);
    if(filtered_isbn) {
        console.log(filtered_isbn);
        return res.send(JSON.stringify(filtered_isbn));
    } 
    else {
        return res.send("No book found with this ISBN");
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let keys = Object.keys(books);
    for(let i=1; i<=keys.length; i++) {
        if (author === books[i].author) {
            return res.send(books[i]);
        }
    }
    return res.send("No books by this author found");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let keys = Object.keys(books);
    for(let i=1; i<=keys.length; i++) {
        if (title === books[i].title) {
            return res.send(books[i]);
        }
    }
    return res.send("No books by this title found");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_isbn = Object.values(books).filter((book) => book.isbn === isbn);
    if(!Object.keys(filtered_isbn).length === 0) {
        return res.send(filtered_isbn.reviews);
    } 
    else {
        return res.send("No reviews found for this ISBN");
    }
});

module.exports.general = public_users;
