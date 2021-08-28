const mongoose = require("mongoose");

const { Schema } = mongoose;

const members = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  presentation: [{ id2: { type: String }, name: { type: String } }],
});
const Members = mongoose.model("_Members", members);

module.exports = Members;
