// FUNCTION IMPLEMENTATION
const emailChecker = (chkEmail, users) => {
  for (const u in users) {
    if (users[u].email === chkEmail) {
      return true
    }
  }
  
  return false;
};

// EXPORT MODULE
module.exports = emailChecker;
