const Mess = require('../../models/mess');
const Customer = require('../../models/customer');
const Reviews = require('../../models/relations/reviews');
const mess = require('../../models/mess');


//helper function
function calculateOverAllrating(oldrating, count) {
    return oldrating / count;
}

exports.getAllReviews = async(req, res) => {
    //extract review Id
    let reviewArray = []
    let messName = ""
    await Mess.findById({ _id: req.params.messId })
        .select('Reviews messDetails')
        .then(doc => {
            messName = doc.messDetails.messName
            for (let i = 0; i < doc.Reviews.reviewers.length; i++) {
                reviewArray.push(doc.Reviews.reviewers[i].reviewId)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "some error occured while fetching data",
                error: "internal server error"
            });
        });
    //extract reviews from review collection

    await Reviews.find({ _id: { $in: reviewArray } })
        .then(async doc => {
            let reviewDetailsArray = []
            for (let i = 0; i < doc.length; i++) {
                let customerName = await Customer.findById(doc[i].customerId)
                    .then(custdoc => {
                        if (custdoc === null) {
                            return "deleted user"
                        } else {
                            return custdoc.name
                        }
                    }).catch(err => {
                        throw err
                    })
                let reviewObject = {}
                reviewObject = {
                    _id: doc[i]._id,
                    messId: doc[i].messId,
                    messName: messName,
                    customerId: doc[i].customerId,
                    customerName: customerName,
                    rating: doc[i].rating,
                    thread: doc[i].thread
                }
                reviewDetailsArray.push(reviewObject)
            }
            res.status(200).json({
                message: "success",
                reviews: reviewDetailsArray
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "some error occured while fetching data",
                error: "internal server error"
            });
        })
}

//controllers to handle rating
exports.addReview = async(req, res) => {
    let comment = {
        comment: req.body.comment,
        author: req.params.custId,
        timestamp: req.body.timestamp
    }
    let thread = []
    thread.push(comment)
    const review = new Reviews({
        messId: req.params.messId,
        customerId: req.params.custId,
        rating: req.body.rating,
        thread: thread
    })

    let reviewId = 0
    await review.save()
        .then(doc => {
            reviewId = doc._id
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "some error occured while storing new review",
                error: "internal server error"
            });
        });

    let reviewArray = []
    let sum = 0

    await Mess.findById({ _id: req.params.messId })
        .then(doc => {
            reviewArray = doc.Reviews.reviewers
            sum = doc.Reviews.sum
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "some error occured while updating document",
                error: "internal server error"
            });
        });

    reviewArray.push({
        reviewId: reviewId
    })

    let reviewCount = reviewArray.length;
    sum += req.body.rating;
    let updatedRating = calculateOverAllrating(sum, reviewCount);

    let reviewObject = {
        sum: sum,
        reviewers: reviewArray
    }

    await Mess.findByIdAndUpdate({ _id: req.params.messId }, { Reviews: reviewObject, Rating: updatedRating })
        .then(doc => {
            res.status(200).json({
                message: "successfully rated"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "some error occured while updating document",
                error: "internal server error"
            });
        });
}

//future scope
exports.updateRating = (req, res) => {}

exports.removeReview = async(req, res) => {
    let messId = 0;
    let unwantedRating = 0;
    await Reviews.findById({ _id: req.params.reviewId })
        .then(doc => {
            messId = doc.messId
            unwantedRating = doc.rating;
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

    let currentReview = {}
    await Mess.findById({ _id: messId })
        .then(doc => {
            currentReview = doc.Reviews
            currentOverAllRating = doc.Rating
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

    let currentReviewers = currentReview.reviewers;
    let currentSum = currentReview.sum;

    let index = currentReviewers.findIndex(review => {
        return String(req.params.reviewId) === String(review.reviewId)
    })

    currentSum -= unwantedRating;

    currentReviewers.splice(index, 1);

    //updateoverall rating
    let updatedRating = calculateOverAllrating(currentSum, currentReviewers.length)

    let updatedReview = {
        sum: currentSum,
        reviewers: currentReviewers
    };


    await Reviews.findByIdAndDelete({ _id: req.params.reviewId })
        .then(doc => {})
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

    await Mess.findByIdAndUpdate({ _id: messId }, { Reviews: updatedReview, Rating: updatedRating })
        .then(doc => {
            res.status(200).json({
                message: "successfully removed rating"
            })
        }).catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })
}

//controllers to handle review
exports.replyToComment = async(req, res) => {
    let threadArray = []
    await Reviews.findById({ _id: req.params.reviewId })
        .then(doc => {
            threadArray = doc.thread
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

    let commentObject = {
        comment: req.body.comment,
        author: req.body.author,
        timestamp: req.body.timestamp
    }

    threadArray.push(commentObject)

    await Reviews.findByIdAndUpdate({ _id: req.params.reviewId }, { thread: threadArray })
        .then(doc => {
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

exports.updateComment = async(req, res) => {
    let threadArray = []
    await Reviews.findById({ _id: req.params.reviewId })
        .then(doc => {
            threadArray = doc.thread
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

    let index = threadArray.findIndex(comment => {
        return String(comment._id) === String(req.params.commentId)
    })

    let commentObject = {
        comment: req.body.comment,
        author: req.body.author,
        timestamp: req.body.timestamp
    }

    threadArray.splice(index, 1, commentObject);

    await Reviews.findByIdAndUpdate({ _id: req.params.reviewId }, { thread: threadArray })
        .then(doc => {
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

exports.deleteComment = async(req, res) => {
    let threadArray = []
    await Reviews.findById({ _id: req.params.reviewId })
        .then(doc => {
            threadArray = doc.thread
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            })
        })

    let index = threadArray.findIndex(comment => {
        return String(comment._id) === String(req.params.commentId)
    })

    threadArray.splice(index, 1);

    await Reviews.findByIdAndUpdate({ _id: req.params.reviewId }, { thread: threadArray })
        .then(doc => {
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