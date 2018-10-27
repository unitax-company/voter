const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PollsSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "answer"
    }
  ]
});

module.exports = User = mongoose.model("polls", PollsSchema);
