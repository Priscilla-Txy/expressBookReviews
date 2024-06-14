const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Add a route handler for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Book Review Application');
});

const PORT = 5000;

app.listen(PORT, () => console.log("Server is running on port " + PORT));