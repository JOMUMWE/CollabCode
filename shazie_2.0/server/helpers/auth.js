const bcrypt = require("bcrypt");

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    if (!password) {
      return reject(new Error("Password is required for hashing"));
    }

    bcrypt.genSalt(12, (err, salt) => {
      if (err) return reject(err);

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  });
};


const comparePassword = (password,hashed) =>{
    return bcrypt.compare(password, hashed)
}

module.exports = {
    hashPassword,
    comparePassword
}