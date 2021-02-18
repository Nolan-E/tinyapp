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

// EXPORT MODULE
module.exports = dbCheck;
