const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const polls = require("./routes/api/polls");
const answers = require("./routes/api/answers");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Mongoose Connected"));

app.use(passport.initialize());

require("./config/passport.js")(passport);

app.use(cors());

//роуты
app.use("/api/users", users);
app.use("/api/polls", polls);
app.use("/api/answers", answers);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
