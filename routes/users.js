const express = require("express");
const router = express.Router();
const bycrpt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/User");

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

  let errors = [];

  // required fields
  if (!name || !email || !password || !confirmpassword) {
    errors.push({ msg: "Please fill all fields" });
  }

  //check passwords match
  if (password !== confirmpassword) {
    errors.push({ msg: "Passwords do not match!" });
  }

  // check password length
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters long" });
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
    // validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // user exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          confirmpassword,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // hashing the password
        bycrpt.genSalt(10, (err, salt) => {
          bycrpt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set password to be hashed
            newUser.password = hash;

            // save user
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "You are now registered, login Here.");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// logout
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are Logged out");
  res.redirect("/users/login");
});

module.exports = router;
