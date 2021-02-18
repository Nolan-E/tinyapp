// FUNCTION IMPLEMENTATION
const dbCheck = (cookieUser, db) => {
  let output = {};
  for (const short in db) {
    if (db[short].userID === cookieUser) {
      output[short] = db[short];
    }
  }
  
  return output;
};

const emailChecker = (chkEmail, users) => {
  for (const u in users) {
    if (users[u].email === chkEmail) {
      return users[u].id;
    }
  }
  
  return false;
};

const generateRandomString = () => {
  const validChars = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
  let output = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * validChars.length);
    output += validChars[randomIndex];
  }
  
  return output;
};

// EXPORT MODULE
module.exports = {
  dbCheck,
  emailChecker,
  generateRandomString
};
