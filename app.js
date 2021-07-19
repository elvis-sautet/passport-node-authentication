if (process.env !== "production") {
  require("dotenv").config({ path: "./config.env" });
}

const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");

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

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server listening on ${PORT}`));
