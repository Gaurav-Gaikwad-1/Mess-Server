const mongoose = require('mongoose');

const threadSchema = {
    comment: String,
    author: String,
    timestamp: Date
}

const reviewsSchema = mongoose.Schema({
    messId: mongoose.Types.ObjectId,
    customerId: mongoose.Types.ObjectId,
    rating: Number,
    thread: [threadSchema]
})

module.exports = mongoose.model('review', reviewsSchema);