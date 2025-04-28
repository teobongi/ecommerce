const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  prezzo: {
    type: Number,
    required: true,
  },
  descrizione: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
