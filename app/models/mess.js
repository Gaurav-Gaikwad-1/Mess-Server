const mongoose = require('mongoose');

//menu item sub document
const menuItemSchema = {
    itemName: String,
}

//menu subdocument
const menuSchema = {
    menuName: String,
    menuItem: [menuItemSchema],
    price: Number,
    tag: [
        { type: String }
    ]
}

//reviews sub document
const reviewsSchema = {
    reviewId: mongoose.Types.ObjectId
}

//posted menu sub document
const postedMenuSchema = {
    postId: mongoose.Types.ObjectId
}

//subscription sub document
const subscriberSchema = {
    subscriptionId: mongoose.Types.ObjectId
}

const messSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
        type: String,
        required: true,
    },
    messDetails: {
        messName: String,
        ownerName: String,
        phone: {
            type: String,
            match: /^[0-9]{10}$/,
            required: true
        },
        address: String
    },
    price: {
        homeDelivery: {
            available: Boolean,
            DeliveryCharge: Number
        },
        onVenue: {
            available: Boolean
        }
    },
    Speciality: [{ type: String }],
    MenuList: [menuSchema],
    Rating: Number,
    Reviews: {
        sum: Number,
        reviewers: [reviewsSchema]
    },
    subscribers: [subscriberSchema],
    postedMenu: [postedMenuSchema]
});

module.exports = mongoose.model('mess', messSchema);