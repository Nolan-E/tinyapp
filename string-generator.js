// FUNCTION IMPLEMENTATION
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
module.exports = generateRandomString;
