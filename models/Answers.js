const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  answer: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  voted: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ]
});

module.exports = User = mongoose.model("answer", AnswerSchema);
