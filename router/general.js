const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  console.log("Current users after registration:", users); // Log the users array
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop using async-await with Axios
public_users.get('/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/internal/books');
    const booksList = response.data;
    res.status(200).json(booksList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books list" });
  }
});

// Internal route to simulate book list retrieval
public_users.get('/internal/books', (req, res) => {
  res.status(200).json(books);
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/internal/books/${isbn}`);
    const book = response.data;
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Internal route to simulate book detail retrieval
public_users.get('/internal/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get(`http://localhost:5000/internal/books/author/${author}`);
    const booksByAuthor = response.data;
    if (booksByAuthor.length > 0) {
      res.status(200).json({ booksbyauthor: booksByAuthor });
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Internal route to simulate book detail retrieval by author
public_users.get('/internal/books/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = [];

  for (let key in books) {
    if (books[key].author.toLowerCase() === author) {
      const bookDetail = {
        isbn: key,
        title: books[key].title,
        reviews: books[key].reviews
      };
      booksByAuthor.push(bookDetail);
    }
  }

  res.status(200).json(booksByAuthor);
});

// Get book details based on title using async-await with Axios
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get(`http://localhost:5000/internal/books/title/${title}`);
    const booksByTitle = response.data;
    if (booksByTitle.length > 0) {
      res.status(200).json({ booksbytitle: booksByTitle });
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Internal route to simulate book detail retrieval by title
public_users.get('/internal/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const booksByTitle = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === title) {
      const bookDetail = {
        isbn: key,
        author: books[key].author,
        reviews: books[key].reviews
      };
      booksByTitle.push(bookDetail);
    }
  }

  res.status(200).json(booksByTitle);
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json({ reviews: book.reviews });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
