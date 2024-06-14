const express = require('express');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt with:", username, password); // Log username and password
  console.log("Current users:", users); // Log users array

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  req.session.username = username; // Store the username in the session
  return res.status(200).json({ message: "Customer Successfully Logged in" });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username; // Get the username from the session

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in first." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  console.log(`Review by ${username} for book ${isbn}: ${review}`); // Log the review
  return res.status(200).json({ message: `Review for the book with ISBN ${isbn} has been added/updated.` });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username; // Get the username from the session

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in first." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found." });
  }

  delete books[isbn].reviews[username];
  console.log(`Review by ${username} for book ${isbn} has been deleted.`); // Log the review deletion
  return res.status(200).json({ message: `Review by ${username} for the book with ISBN ${isbn} has been deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
