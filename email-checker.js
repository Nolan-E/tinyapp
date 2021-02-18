// FUNCTION IMPLEMENTATION
const emailChecker = (chkEmail, users) => {
  for (const u in users) {
    if (users[u].email === chkEmail) {
      return users[u].id;
    }
  }
  
  return false;
};

// EXPORT MODULE
module.exports = emailChecker;
