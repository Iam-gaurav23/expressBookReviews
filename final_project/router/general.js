const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    users.push({
      username:username,
      password:password
    });

    return res.status(200).json({
      message:"User successfully registered"
    });
  }

  return res.status(404).json({
    message:"Unable to register user"
  });

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  return res.status(200).json(books);

});
public_users.get('/async/books', async function (req, res) {

  const response = await axios.get('http://localhost:5000/');

  return res.status(200).json(response.data);

});

public_users.get('/async/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

  return res.status(200).json(response.data);

});

public_users.get('/async/title/:title', async function (req, res) {

  const title = req.params.title;

  const response = await axios.get(`http://localhost:5000/title/${title}`);

  return res.status(200).json(response.data);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const author = req.params.author;
  let result = {};

  for(let key in books){
    if(books[key].author === author){
      result[key] = books[key];
    }
  }

  return res.status(200).json(result);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title;
  let result = {};

  for(let key in books){
    if(books[key].title === title){
      result[key] = books[key];
    }
  }

  return res.status(200).json(result);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);

});

module.exports.general = public_users;
