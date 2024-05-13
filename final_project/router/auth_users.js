const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//Check, is the username valid
const isValid = (username)=>{ //returns boolean
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

//Check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    console.log("hiiii");
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.session.username;
  
    if (!username) {
      res.status(401).json({ error: "User not logged in." });
      return;
    }
  
    if (!review) {
      res.status(400).json({ error: "Review is required." });
      return;
    }
  
    if (!books[isbn]) {
      res.status(404).json({ error: "Book not found." });
      return;
    }
  
    const reviewObject = {
      username: username,
      review: review
    };
  
    if (!books[isbn].reviews[username]) {
      // If the user hasn't posted a review for this book before, create a new review entry
      books[isbn].reviews[username] = reviewObject;
      res.status(201).json({ message: "Review posted successfully." });
    } else {
      // If the user has already posted a review for this book, update their existing review
      books[isbn].reviews[username] = reviewObject;
      res.status(200).json({ message: "Review updated successfully." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
