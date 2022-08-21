const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        default: "book.png"
    },
    source: {
        type: String
    },
    date_release: {
        type: Date
    }, 
    lang: {
        type: String
    },
    n_pages: {
        type: Number
    },
    publisher: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: 
        {
            type: [mongoose.Types.ObjectId],
            ref: "categories",
            required: true
        },
    writer: 
        {
            type: [mongoose.Types.ObjectId],
            ref: "writers",
            required: true
        },
    promotion: {
        type: mongoose.Types.ObjectId,
        ref: "promotions"
    },
   
    date_addition: {
        type: Date,
        required: true,
        default: Date.now
    }
})


module.exports = mongoose.model('books', bookSchema);
