const { assert } = require('chai');
const { dbCheck, emailChecker, generateRandomString }  = require('../helpers');

const users = {
  "e1i731": {
    id: "e1i731",
    email: "user@example.com",
    password: "4fish"
  },
  "k4m3hz": {
    id: "k4m3hz",
    email: "kame@house.com",
    password: "dr4g0n"
  }
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "k4m3hz" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "r4nd0m" }
};

const currentCookie = {
  user_id: 'k4m3hz'
};

describe('dbCheck', () => {
  it('should return urlDatabase shortURL object(s) when current user cookie matches valid userID in the database', () => {
    const user = dbCheck(currentCookie.user_id, urlDatabase);
    const expectedOutput = { "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "k4m3hz" } };
    assert.deepEqual(user, expectedOutput);
  });
  it('should return "{}" with an empty string', () => {
    const user = dbCheck("", users);
    const expectedOutput = {};
    assert.deepEqual(user, expectedOutput);
  });
});

describe('emailChecker', () => {
  it('should return a user with valid email', () => {
    const uID = emailChecker("user@example.com", users);
    const expectedOutput = "e1i731";
    assert.strictEqual(uID, expectedOutput);
  });
  it('should return false with an empty string', () => {
    const uID = emailChecker("", users);
    const expectedOutput = false;
    assert.strictEqual(uID, expectedOutput);
  });
});

describe('generateRandomString', () => {
  it('should return a value with length of 6', () => {
    const strLength = generateRandomString().length;
    const expectedOutput = 6;
    assert.strictEqual(strLength, expectedOutput);
  });
  it('should return output that is a String', () => {
    const str = generateRandomString();
    const expectedOutput = true;
    assert.isString(str, expectedOutput);
  });
});
