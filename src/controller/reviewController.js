
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const mongoose =require("mongoose")

const isValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == "null") { return false }
    if (typeof (value) == "String" && value.trim().length == 0) { return false }
    return true
}

const createReview = async function (req, res) {
    try {
        const data = req.body
        let data1 = req.params.bookId


        let findBookId = await bookModel.findById(data1)
        if (!findBookId) return res.status(400).send("not a valid id")

        const { bookId, reviewedAt, rating } = data

        let req0 = isValid(bookId)
        if (!req0) return res.status(400).send("Bookid is required")

        let findBookid = await bookModel.findById(data.bookId)
        if (!findBookid) return res.status(400).send("Bookid is not valid")


        let req2 = isValid(reviewedAt)
        if (!req2) return res.status(400).send("review date is required")

        let req3 = isValid(rating)
        if (!req3) return res.status(400).send("rating is required")

        if (rating < 1 || rating > 5) return res.status(400).send("rating should between 1 to 5")

        let isdeleteded = findBookId.isDeleted

        if (isdeleteded == false) {

            let reviewDetail = await reviewModel.create(data)

            let findId = findBookid._id
            let findReviewscount = await reviewModel.find({ bookId: findId, isDeleted: false }).count()
            let findReviews = await reviewModel.find({ bookId: findId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
            if (!findReviews) return res.status(400).send("no reviews yet")

            let Stored = findBookid

            let Details = {
                _id: Stored._id, title: Stored.title, excerpt: Stored.excerpt, userId: Stored.userId, ISBN: Stored.ISBN,
                category: Stored.category, subcategory: Stored.subcategory, reviews: findReviewscount, isDeleted: Stored.isDeleted,
                releasedAt: Stored.releasedAt, createdAt: Stored.createdAt, updatedAt: Stored.updatedAt, reviewsData: findReviews
            }
            res.status(201).send({ status: true, data: Details })
        } else {

            return res.status(400).send({ status: false, msg: "book is already deleted" })
        }
    }
    catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

const updateReview = async function (req, res) {
    try {
        const data = req.params.bookId
        const data1 = req.params.reviewId
        const reviewedBy = req.body.reviewedBy
        const review = req.body.review
        const rating = req.body.rating

        const findBookid = await bookModel.findOne({ _id: data, isDeleted: false })
        if (!findBookid) return res.status(404).send("Book id not Exist or book is deleted")

        const findReviewid = await reviewModel.findById(data1)
        if (!findReviewid) return res.status(400).send({ status: false, msg: "review id is not exist" })

        if (findReviewid.isDeleted == false) {

            const updateReviewid = await reviewModel.findOneAndUpdate({ _id: data1, bookId: data }, { reviewedBy: reviewedBy, review: review, rating: rating }, { new: true })
            if (!updateReviewid) return res.status(404).send({ status: false, msg: "review id and bookid not matching" })
            let Stored = findBookid

            let findId = findBookid._id
            let findReviewscount = await reviewModel.find({ bookId: findId, isDeleted: false }).count()
            let findReviews = await reviewModel.find({ bookId: findId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
            if (!findReviews) return res.status(400).send("no reviews yet")

            let Details = {
                _id: Stored._id, title: Stored.title, excerpt: Stored.excerpt, userId: Stored.userId, ISBN: Stored.ISBN,
                category: Stored.category, subcategory: Stored.subcategory, reviews: findReviewscount, isDeleted: Stored.isDeleted,
                releasedAt: Stored.releasedAt, createdAt: Stored.createdAt, updatedAt: Stored.updatedAt, reviewsData: findReviews
            }

            res.status(201).send({ status: true, data: Details })

        } else {
            return res.status(400).send({ status: false, msg: "review is already deleted" })
        }
    }
    catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

const deleteReview = async function (req, res) {

    const bookid = req.params.bookId
    const reviewid = req.params.reviewId

    const findbookid = await bookModel.findOne({ _id: bookid, isDeleted: false })
    if (!findbookid) return res.status(404).send({ status: false, msg: "book id doesn't exist" })

    const findReviewid = await reviewModel.findById(reviewid)
    if (!findReviewid) return res.status(400).send({ status: false, msg: "review id is not exist" })

    if (findReviewid.isDeleted == false) {


        let findId = findbookid._id


        const deleteReviewid = await reviewModel.findOneAndUpdate({ _id: reviewid, bookId: findId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (!deleteReviewid) return res.status(400).send({ status: false, msg: "in params book id not exist in review" })

        let Stored = findbookid

        let findReviewscount = await reviewModel.find({ bookId: findId, isDeleted: false }).count()
        let findReviews = await reviewModel.find({ bookId: findId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        if (!findReviews) return res.status(400).send("no reviews yet")

        let Details = {
            _id: Stored._id, title: Stored.title, excerpt: Stored.excerpt, userId: Stored.userId, ISBN: Stored.ISBN,
            category: Stored.category, subcategory: Stored.subcategory, reviews: findReviewscount, isDeleted: Stored.isDeleted,
            releasedAt: Stored.releasedAt, createdAt: Stored.createdAt, updatedAt: Stored.updatedAt, reviewsData: findReviews
        }
        res.status(201).send({ status: true, data: Details })
    }
    else {
        return res.status(400).send({ status: false, msg: "review is already deleted" })
    }

}


module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview