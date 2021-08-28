const mongoose = require("mongoose");

const { Schema } = mongoose;

const presentations = new Schema({
  name: { type: String },
  user: { type: String },
  slides: [
    {
      x: [{ type: Number }],
      y: [{ type: Number }],
      txtbox: [{ type: String }],
    },
  ],
});
const Presentations = mongoose.model("_Presentations", presentations);

module.exports = Presentations;
