const Mess = require('../../models/mess');

exports.getAllMess = (req, res) => {
    Mess.find()
        .select('messDetails Speciality')
        .then(docs => {
            if (docs.length >= 1) {
                res.status(200).json({
                    message: "success",
                    Mess: docs
                });
            } else {
                res.status(200).json({
                    message: "success",
                    Mess: "no mess available yet"
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })
}

exports.getMessById = (req, res) => {
    id = req.params.id;
    Mess.find({ _id: id })
        .select('-password -__v')
        .then(doc => {
            res.status(200).json({
                message: "success",
                Mess: doc
            });
        })
        .catch(err => {
            res.status(400).json({
                message: "no data found",
                error: err
            })
        })
}

exports.getMessByEmail = (req, res) => {
    Mess.find({ email: req.body.email })
        .exec()
        .then(doc => {
            if (doc.length === 1) {
                res.status(200).json({
                    message: "success",
                    Mess: doc
                });
            } else {
                res.status(400).json({
                    message: "no mess found",
                    Mess: null
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })
}

exports.updateMessById = (req, res) => {
    var updateOps = req.body;

    for (const ops in updateOps) {
        updateOps[ops.propName] = ops.value;
    }
    Mess.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                message: "success",
                doc: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while updating data",
                error: err
            })
        })
}

exports.deleteMessById = async(req, res) => {
    await Mess.findByIdAndDelete({ _id: req.params.id })
        .exec()
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
            });
        })
}