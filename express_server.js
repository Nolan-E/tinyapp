// IMPORT MODULES & SERVER SETUP
const generateRandomString = require('./string-generator');
const emailChecker = require('./email-checker');
const dbCheck = require('./database-checker');
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
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "userRandomID" }
};
// OLD Database
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

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
  const currentUser = users[req.cookies.user_id];
  const cUserShort = dbCheck(req.cookies.user_id, urlDatabase);
  const templateVars = { urls: cUserShort, currentUser: currentUser };
  if (!currentUser) {
    res.redirect('/login');
  } else {
    res.render('urls_index', templateVars);
  }
});

app.get('/register', (req, res) => {
  const currentUser = users[req.cookies.user_id];
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

app.get('/login', (req, res) => {
  const currentUser = users[req.cookies.user_id];
  const templateVars = { urls: urlDatabase, currentUser: currentUser };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userRndID = emailChecker(email, users);
  if (!emailChecker(email, users)) {
    res.status(403).send('403 Forbidden');
  } else {
    if (password !== users[userRndID].password) {
      res.status(403).send('403 Forbidden');
    } else {
      res.cookie('user_id', userRndID);
      res.redirect('/urls');
    }
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('/urls/new', (req, res) => {
  const currentUser = users[req.cookies.user_id];
  const templateVars = { currentUser: currentUser };
  if (!currentUser) {
    res.redirect('/login');
  } else {
    res.render('urls_new', templateVars);
  }
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL:req.body.longURL, userID: req.cookies.user_id };
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.editLongURL;
  res.redirect(`/urls/${shortURL}`);
});

// Redirect Current User to LongURL via Shortened URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (!longURL) {
    res.status(404).send('404 Page Not Found');
  } else {
    res.redirect(longURL);
  }
});

// Renders Edit Page for Shortened URL
app.get('/urls/:shortURL', (req, res) => {
  const currentUser = users[req.cookies.user_id];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, currentUser: currentUser };
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send('404 Page Not Found');
  } else {
    res.render('urls_show', templateVars);
  }
});

// PORT LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
