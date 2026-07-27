const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6 - Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 - Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 3 - Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const result = Object.keys(books)
    .filter(key => books[key].author === author)
    .map(key => ({ isbn: key, ...books[key] }));

  if (result.length > 0) {
    return res.status(200).json({ booksbyauthor: result });
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// Task 4 - Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const result = Object.keys(books)
    .filter(key => books[key].title === title)
    .map(key => ({ isbn: key, ...books[key] }));

  if (result.length > 0) {
    return res.status(200).json({ booksbytitle: result });
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Task 5 - Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

/* ---------- Tasks 10-13: Axios with Promises / async-await ---------- */

// Task 10 - Get all books using an async callback function
const getAllBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch books: " + error.message);
  }
};

// Task 11 - Search by ISBN using Promise callbacks
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => resolve(response.data))
      .catch(error => reject(new Error("Unable to fetch book by ISBN: " + error.message)));
  });
};

// Task 12 - Search by Author using async/await
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch books by author: " + error.message);
  }
};

// Task 13 - Search by Title using async/await
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch books by title: " + error.message);
  }
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
