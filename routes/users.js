const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = process.env.secret;

//route for updating users
router.post("/update", require("../verifications/token"), (req, res) => {
  User.findOneAndUpdate({ email: req.user.email }, req.body, (err, doc) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ message: "Successfuly updated" });
    }
  });
});

router.post("/read", require("../verifications/token"), (req, res) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ data: user });
    }
  });
});

// route for user login by email form
router.post("/login", (req, res) => {
  let data = req.body;

  User.findOne({ email: data.email }).then((user) => {
    if (user) {
      if (user.password) {
        bcrypt.compare(data.password, user.password, (err, isMatch) => {
          if (err) {
            res.json({ error: "Password comparison failed" });
          } else if (isMatch) {
            jwt.sign(
              { data: user },
              secret,
              { expiresIn: "7d" },
              (err, token) => {
                if (err) {
                  res.json({ error: "jwt error email form login" });
                } else {
                  res.json({
                    token: token,
                    user: {
                      name: user.name,
                      photo: user.photo,
                      description: user.description,
                    },
                  });
                }
              }
            );
          } else {
            res.json({ error: "Wrong password" });
          }
        });
      } else {
        res.json({ error: "Use other login method" });
      }
    } else {
      res.json({ error: "No such email" });
    }
  });
});

//route for facebook signup
router.post(
  "/facebookSignup",
  require("../verifications/facebook"),
  (req, res) => {
    let userData = req.body;

    jwt.sign({ data: userData }, secret, { expiresIn: "7d" }, (err, token) => {
      if (err) {
        res.json({ error: err });
      } else {
        User.findOne({ email: userData.email }).then((user) => {
          if (!user) {
            //create user if doesn't exist
            let name = userData.name
              ? userData.name
              : userData.email.split("@")[0];
            let newUser = new User({
              email: userData.email,
              name: name,
              photo: userData.photoUrl,
            });
            newUser
              .save()
              .then(() => {
                res.json({
                  message: "User created",
                  token: token,
                  user: {
                    name: newUser.name,
                    photo: newUser.photo,
                    description: newUser.description,
                  },
                });
              })
              .catch((er) => {
                res.json({ error: er });
              });
          } else {
            res.json({
              token: token,
              user: {
                name: user.name,
                photo: user.photo,
                description: user.description,
              },
            });
          }
        });
      }
    });
  }
);

// route for google signup
router.post("/googleSignup", require("../verifications/google"), (req, res) => {
  let userData = req.body;

  jwt.sign({ data: userData }, secret, { expiresIn: "7d" }, (err, token) => {
    if (err) {
      res.json({ error: err });
    } else {
      User.findOne({ email: userData.email }).then((user) => {
        if (!user) {
          //create user if doesn't exist
          let name = userData.name
            ? userData.name
            : userData.email.split("@")[0];
          let newUser = new User({
            email: userData.email,
            name: name,
            photo: userData.photoUrl,
          });
          newUser
            .save()
            .then(() => {
              res.json({
                message: "User created",
                token: token,
                user: {
                  name: newUser.name,
                  photo: newUser.photo,
                  description: newUser.description,
                },
              });
            })
            .catch((er) => {
              res.json({ error: er });
            });
        } else {
          res.json({
            token: token,
            user: {
              name: user.name,
              photo: user.photo,
              description: user.description,
            },
          });
        }
      });
    }
  });
});

//router for user signup by email form
router.post("/signup", (req, res) => {
  let data = req.body;
  let { email } = data;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.json({ error: "User already exists" });
    } else {
      let newUser = new User({
        email: email,
        name: data.name ? data.name : email.split("@")[0],
      });

      bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(data.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser
            .save()
            .then(() => {
              res.json({ message: "User created" });
            })
            .catch((er) => {
              res.json({ error: er });
            });
        });
      });
      newUser.password = data.password;
    }
  });
});

module.exports = router;