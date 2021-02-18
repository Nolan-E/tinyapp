// IMPORT MODULES & SERVER SETUP
const generateRandomString = require('./string-generator');
const emailChecker = require('./email-checker');
const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');

// IMITATION DATABASE OBJECTS
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// SERVER ROUTING
app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const currentUser = users[req.cookies.user_id]
  const templateVars = { urls: urlDatabase, currentUser: currentUser };
  res.render('urls_index', templateVars);
});

app.get('/register', (req, res) => {
  const currentUser = users[req.cookies.user_id]
  const templateVars = { urls: urlDatabase, currentUser: currentUser };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password || emailChecker(req.body.email, users)) {
    res.status(400).send('400 Bad Request');
  } else {
    const rId = generateRandomString();
    users[rId] = { id: rId, email: req.body.email, password: req.body.password };
    res.cookie('user_id', users[rId].id);
    res.redirect('/urls');
  }
});

app.post('/login', (req, res) => {
  const currentUser = users[req.cookies.user_id]
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('/urls/new', (req, res) => {
  const currentUser = users[req.cookies.user_id]
  const templateVars = { currentUser: currentUser };
  res.render('urls_new', templateVars);
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.editLongURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (!longURL) {
    res.status(404).send('404 Page Not Found');
  } else {
    res.redirect(longURL);
  }
});

app.get('/urls/:shortURL', (req, res) => {
  const currentUser = users[req.cookies.user_id]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], currentUser: currentUser };
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send('404 Page Not Found');
  } else {
    res.render('urls_show', templateVars);
  }
});

// TEST ROUTES
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// PORT LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
