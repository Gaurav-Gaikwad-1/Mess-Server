const express = require('express');
const router = express.Router();
const messAuth = require('../../controllers/auth/messAuth');
const customerAuth = require('../../controllers/auth/customerAuth');

const reviewsController = require('../../controllers/modules/review');

router.get('/all/:messId', reviewsController.getAllReviews);

//routes for handling the rating
router.post('/new/review/:custId/:messId', customerAuth, reviewsController.addReview);

//router.patch('/update/:reviewId', reviewsController.updateRating);

router.delete('/delete/:reviewId', messAuth, reviewsController.removeReview);

//routes for handling the comments
router.post('/new/comment/:reviewId', messAuth, reviewsController.replyToComment);

router.patch('/update/comment/:reviewId/:commentId', messAuth, reviewsController.updateComment);

router.delete('/remove/comment/:reviewId/:commentId', messAuth, reviewsController.deleteComment);

module.exports = router;