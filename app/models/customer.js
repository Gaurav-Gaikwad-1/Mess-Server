const mongoose = require('mongoose');

const savedMessSchema = {
    subscriptionId: mongoose.Types.ObjectId
}


const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        match: /^[0-9]{10}$/,
        required: true
    },
    savedMess: [savedMessSchema]
});

module.exports = mongoose.model('customer', customerSchema);