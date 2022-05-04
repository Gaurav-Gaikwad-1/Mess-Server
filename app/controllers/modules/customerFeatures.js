const Mess = require('../../models/mess');
const Customer = require('../../models/customer');
const Subscription = require('../../models/relations/subscription');

exports.getMySavedMess = async(req, res) => {
    let subscriptionArray = [];
    await Customer.findById({ _id: req.params.custId })
        .select('savedMess')
        .then(doc => {
            subscriptionArray = doc.savedMess
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })
    let subId = []
    for (let i = 0; i < subscriptionArray.length; i++) {
        subId.push(subscriptionArray[i].subscriptionId)
    }

    let messArray = []
    await Subscription.find({ '_id': { $in: subId } })
        .then(doc => {
            messArray = doc
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

    let messIdArray = []
    for (let i = 0; i < messArray.length; i++) {
        messIdArray.push(messArray[i].messId);
    }

    await Mess.find({ _id: { $in: messIdArray } })
        .select('messDetails email')
        .then(doc => {
            console.log(doc)
            res.status(200).json({
                message: "success",
                doc: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

}