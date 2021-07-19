const express = require("express");
const router = express.Router();

// login page
router.get("/login", (req, res) => {
  res.render("login");
});

// register page
router.get("/register", (req, res) => {
  res.render("register");
});

// register handle
router.post("/register", (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  const errors = {};

  // required fields
  if (!name || !email || !password || !confirmpassword) {
    errors.emptyFields = "Please fill all fields";
  }

  //check passwords match
  if (password !== confirmpassword) {
    errors.passwordMismatch = "Passwords do not match!";
  }

  // check password length
  if (password.length < 6) {
    errors.passwordLength = "Password must be at least 6 characters long";
  }

  if (Object.keys(errors).length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      confirmpassword,
    });
  } else {
    res.send("send");
  }
});

module.exports = router;
