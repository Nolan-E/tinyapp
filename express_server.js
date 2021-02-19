// IMPORT MODULES/HELPERS & SERVER SETUP
const { dbCheck, emailChecker, generateRandomString }  = require('./helpers');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const PORT = 8080;

// MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['kame', 'house']
}));

app.set('view engine', 'ejs');

// IMITATION DATABASE OBJECTS
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "userRandomID" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("asdf123", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// SERVER ROUTING
// Root GET
app.get('/', (req, res) => {
  res.redirect('/urls');
});

// MyURLS page GET
app.get('/urls', (req, res) => {
  const currentUser = users[req.session.user_id];
  const cUserShort = dbCheck(req.session.user_id, urlDatabase);
  const templateVars = { urls: cUserShort, currentUser: currentUser };
  if (!currentUser) {
    res.redirect('/login');
    return;
  }
  res.render('urls_index', templateVars);
});

// Register page GET & POST
app.get('/register', (req, res) => {
  const currentUser = users[req.session.user_id];
  if (!currentUser) {
    const templateVars = { urls: urlDatabase, currentUser: currentUser };
    res.render('urls_register', templateVars);
    return;
  }
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password || emailChecker(req.body.email, users)) {
    res.status(400).send('400 Bad Request');
    return;
  }
  const rId = generateRandomString();
  users[rId] = {
    id: rId,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  req.session.user_id = users[rId].id;
  res.redirect('/urls');
});

// Login page GET & POST
app.get('/login', (req, res) => {
  const currentUser = users[req.session.user_id];
  if (!currentUser) {
    const templateVars = { urls: urlDatabase, currentUser: currentUser };
    res.render('urls_login', templateVars);
    return;
  }
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  if (!emailChecker(email, users)) {
    res.status(403).send('403 Forbidden');
    return;
  }
  const userRndID = emailChecker(email, users);
  const password = req.body.password;
  const hashPass = users[userRndID].password;
  if (!bcrypt.compareSync(password, hashPass)) {
    res.status(403).send('403 Forbidden');
    return;
  }
  req.session.user_id = userRndID;
  res.redirect('/urls');
});

// Logout POST
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// Create new URL GET & POST
app.get('/urls/new', (req, res) => {
  const currentUser = users[req.session.user_id];
  const templateVars = { currentUser: currentUser };
  if (!currentUser) {
    res.redirect('/login');
    return;
  }
  res.render('urls_new', templateVars);
});

app.post('/urls', (req, res) => {
  if (!users[req.session.user_id]) {
    res.status(403).send('403 Forbidden');
    return;
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL:req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

// Delete database entry
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === req.session.user_id) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
    return;
  }
  res.status(403).send('403 Forbidden');
});

// Renders Edit Page GET & Edit POST
app.get('/urls/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send('404 Page Not Found');
    return;
  }
  if (urlDatabase[req.params.shortURL].userID !== req.session.user_id) {
    res.status(403).send('403 Forbidden');
    return;
  }
  const currentUser = users[req.session.user_id];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, currentUser: currentUser };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === req.session.user_id) {
    urlDatabase[shortURL].longURL = req.body.editLongURL;
    res.redirect('/urls');
    return;
  }
  res.status(403).send('403 Forbidden');
});

// Redirect Current User to LongURL via Shortened URL
app.get('/u/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send('404 Page Not Found');
    return;
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// Redirect non-useful GET routes to login
app.get('*', (req, res) => {
  res.redirect('/login');
});

// Redirect non-useful GET routes to login
app.post('*', (req, res) => {
  res.status(400).redirect('/login');
});

// PORT LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
