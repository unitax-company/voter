const express = require("express");
const router = express.Router();
const Polls = require("../../models/Polls");
const passport = require("passport");

const validatePollsInput = require("../../validations/polls");

router.get("/", (req, res) => {
  Polls.find()
    .populate("answers")
    .then(polls => res.json(polls))
    .catch(err => res.status(404).json({ error: "No polls found" }));
});

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Polls.findById(req.params.id)
      .populate("answers")
      .then(poll => res.json(poll))
      .catch(err => console.log(err));
  }
);

router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validatePollsInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPoll = new Polls({
      question: req.body.question
    });

    newPoll
      .save()
      .then(poll => res.json(poll))
      .catch(err => console.log(err));
  }
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validatePollsInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updateData = {
      question: req.body.question
    };

    Polls.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateData },
      { new: true }
    ).then(poll => {
      res.json(poll);
    });
  }
);

module.exports = router;
