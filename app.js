if (process.env !== "production") {
  require("dotenv").config({ path: "./config.env" });
}

const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// Passport config
require("./config/passport")(passport);

// connect to mongo;
try {
  (async () => {
    const conn = await mongoose.connect(process.env.MONGOOSE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Mongo db connected");
  })();
} catch (error) {
  console.log("Error:", error);
}

// EJS
app.use(expressLayout);
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

// midlleswares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express session middlewware session
app.use(
  session({
    secret: "false",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server listening on ${PORT}`));
