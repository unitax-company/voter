const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const TokenGenerator = require("../../auth/tokenGenerator");
const keys = require("../../config/keys");
const passport = require("passport");
const crypto = require("crypto");
const format = require("biguint-format");

const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");

const tokenGenerator = new TokenGenerator(keys.secretOrKey, keys.secretOrKey, {
  expiresIn: "1h"
});

router.post("/signup", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            const number = format(crypto.randomBytes(8), "dec");
            newUser.password = hash;
            newUser.verifyCode = number;
            newUser
              .save()
              .then(user => {
                console.log(
                  `http://localhost:3000/verifyEmail?email=${
                    newUser.email
                  }&code=${number}`
                );
                return res.status(200).json({ success: true });
              })
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => res.json(err));
});

router.post("/signin", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    bcrypt
      .compare(password, user.password)
      .then(isMatch => {
        if (isMatch) {
          if (user.confirmed) {
            const payload = {
              id: user.id,
              email: user.email
            };

            tokenGenerator.sign(payload, {}, (err, token) => {
              return res.json({
                success: true,
                token: "Bearer " + token
              });
            });
          } else {
            errors.confirmed =
              "User email not confirmed. Please check mail and click verification link";
            console.log(
              `http://localhost:3000/verifyEmail?email=${user.email}&code=${
                user.verifyCode
              }`
            );
            return res.status(400).json(errors);
          }
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      })
      .catch(err => console.log(err));
  });
});

router.post("/verifyEmail", (req, res) => {
  const email = req.body.email;
  const verifyCode = +req.body.verifyCode;

  User.findOne({ email })
    .then(user => {
      if (user.verifyCode === verifyCode) {
        user.confirmed = true;
        user.save().then(user => {
          const payload = {
            id: user.id,
            email: user.email
          };

          const tokenGenerator = new TokenGenerator(
            keys.secretOrKey,
            keys.secretOrKey,
            { expiresIn: "1m" }
          );

          tokenGenerator.sign(payload, {}, (err, token) => {
            return res.json({
              success: true,
              token: "Bearer " + token
            });
          });
        });
      } else {
        errors.verifyCode = "Verify code incorrect";
        return res.status(400).json(errors);
      }
    })
    .catch(err => res.json(err));
});

router.post("/refreshToken", (req, res) => {
  tokenGenerator.refresh(req.body.token, {}, (err, token) => {
    return res.json({
      success: true,
      refreshtoken: "Bearer " + token
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email
    });
  }
);

module.exports = router;
