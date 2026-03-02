const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    slug: String,
    shortDescription: String,
    fullDescription: String,
    price: Number,
    images: [String],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
