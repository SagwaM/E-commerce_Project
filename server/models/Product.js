const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {type: String, required: true},
    image: { type: String, required: true },
    stock: { type: Number, required: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
    createdAt: {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model("Product", productSchema);
