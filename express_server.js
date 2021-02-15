// IMPORT MODULES & SETUP
const express = require('express');
const app = express();
const PORT = 8080;

// IMITATION DATABASE OBJECT
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// SERVER ROUTING
app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


// PORT LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
