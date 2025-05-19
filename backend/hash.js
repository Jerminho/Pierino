// hash-password.js
const bcrypt = require("bcrypt");

const password = "P13r1no!js"; // Your actual admin password
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then((hashed) => {
  console.log("Hashed password:", hashed);
});