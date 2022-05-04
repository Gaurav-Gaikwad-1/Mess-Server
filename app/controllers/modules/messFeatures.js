const Mess = require('../../models/mess');
const Customer = require('../../models/customer');
const Subscription = require('../../models/relations/subscription');

exports.getSubscriberInfo = async(req, res) => {
    let subIdArray = []
    await Mess.findById({ _id: req.params.messid })
        .select('subscribers')
        .then(doc => {
            subIdArray = doc.subscribers
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

    let subscriptionId = []
    for (let i = 0; i < subIdArray.length; i++) {
        subscriptionId.push(subIdArray[i].subscriptionId)
    }

    let subscribersArray = []
    await Subscription.find({ '_id': { $in: subscriptionId } })
        .select('customerId')
        .then(doc => {
            subscribersArray = doc;
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

    let subscribers = [];
    for (let i = 0; i < subscribersArray.length; i++) {
        subscribers.push(subscribersArray[i].customerId)
    }

    Customer.find({ '_id': { $in: subscribers } })
        .select('name email phone')
        .then(doc => {
            res.status(200).json({
                message: "success",
                subscribers: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })
}