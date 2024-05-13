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
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.session.authorization.username;
    console.log(review);
  
    if (!username) {
      res.status(401).json({ error: "User not logged in." });
      return;
    }
  
    if (!review) {
      res.status(400).json({ error: "Review is required." });
      return;
    }

    let keys = Object.keys(books);
    for(let i=1; i<=keys.length; i++) {
        if (isbn === books[i].isbn) {
            if(books[i].reviews.username === username) {
                books[i].reviews = {username, review};
                res.status(201).json({ message: "Review posted successfully." });
            } else {
                Object.assign(books[i],{reviews:{"username":username, "review":review}});
                res.status(201).json({ message: "Review posted successfully." });                
            }
        }
    }
    res.status(404).json({error: "Book not found"});  
});

// Delete a review for a particular user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
