const mongoose = require('mongoose');
const Customer = require('../../models/customer');
const Mess = require('../../models/mess');
const Subscription = require('../../models/relations/subscription');

// Functions to save subscription id in the associated mess and customer documents
async function addSubSubscriptionToMess(messId, subId) {
    let subArray = []
    await Mess.findById({ _id: messId })
        .then(doc => {
            subArray = doc.subscribers
            let obj = {
                subscriptionId: subId
            }
            subArray.push(obj);
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })

    console.log(subArray)
    await Mess.findByIdAndUpdate({ _id: messId }, { subscribers: subArray })
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while updating data",
                error: err
            })
        })
}

async function addSubSubscriptionToCustomer(custId, subId) {
    let subArray = []
    await Customer.findById({ _id: custId })
        .then(doc => {
            subArray = doc.savedMess
            let obj = {
                subscriptionId: subId
            }
            subArray.push(obj);
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })

    console.log(subArray)
    await Customer.findByIdAndUpdate({ _id: custId }, { savedMess: subArray })
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while updating data",
                error: err
            })
        })
}

// Functions to remove subscription id from the associated mess and customer documents
// same functions will be used when a customer account or a mess account is being deleted
async function removeSubscriptionFromCustomer(custId, subId) {
    let subArray = []
    await Customer.findById({ _id: custId })
        .then(doc => {
            subArray = doc.savedMess;
        })
        .catch(err => {
            throw new Error(err)
        })

    let ind = subArray.findIndex(subscription => {
        return String(subId) === String(subscription.subscriptionId);
    })
    subArray.splice(ind, 1);

    await Customer.findByIdAndUpdate({ _id: custId }, { savedMess: subArray })
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            throw new Error(err)
        })
}

async function removeSubscriptionFromMess(messId, subId) {
    let subArray = []
    await Mess.findById({ _id: messId })
        .then(doc => {
            subArray = doc.subscribers;
        })
        .catch(err => {
            throw new Error(err);
        })

    let ind = subArray.findIndex(subscription => {
        return String(subId) === String(subscription.subscriptionId);
    })
    subArray.splice(ind, 1);

    await Mess.findByIdAndUpdate({ _id: messId }, { subscribers: subArray })
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            throw new Error(err);
        })
}

exports.subscribe = async(req, res) => {
    const subsciptionObject = new Subscription({
        messId: req.params.messId,
        customerId: req.params.custId
    })
    await subsciptionObject.save()
        .then(doc => {
            console.log(doc);
            addSubSubscriptionToCustomer(req.params.custId, doc._id);
            addSubSubscriptionToMess(req.params.messId, doc._id);
            res.status(200).json({
                message: "success",
                doc: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })
}

exports.unsubscribe = async(req, res) => {
    await Subscription.findById({ _id: req.params.subId })
        .then(doc => {
            removeSubscriptionFromCustomer(doc.customerId, doc._id);
            removeSubscriptionFromMess(doc.messId, doc._id);
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while deleting data",
                error: err
            })
        })
    await Subscription.findByIdAndDelete({ _id: req.params.subId })
        .then(doc => {
            res.status(200).json({
                message: "success",
                doc: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while deleting data",
                error: err
            })
        })
}

//need to clean records after customer or mess account deletion