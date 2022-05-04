const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    customerId: mongoose.Types.ObjectId,
    messId: mongoose.Types.ObjectId
})

module.exports = mongoose.model('subscription', subscriptionSchema);