const Mess = require('../../models/mess');

//search mess by name
exports.searchMessByName = async(req, res) => {
    const queryMess = req.query.mess
    await Mess.find({ "messDetails.messName": { $regex: queryMess, $options: '$i' } })
        .then(docs => {
            res.status(200).json({
                message: "success",
                doc: docs
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })
}