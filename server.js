const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

let mongodb = require("./mongodb");

// connecting to mongodb
mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((er) => {
    console.log(er);
  });

//accepting json objects in requests
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

var allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.183:3000",
  "https://loginsignin.netlify.app",
  "https://loginsignin.netlify.com"
];

//forbid requests from not allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      console.log(origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

//adding login and singup endpoints
app.use("/users", require("./routes/users.js"));


//you can set cronjob so that glitch server would be awake and respond faster
app.get("/", (req,res) => {
  res.send("Hello, thank you for keeping me awake");
})


//listen for requests
const listener = app.listen(5000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
