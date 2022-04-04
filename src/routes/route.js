const express = require('express');
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController=require('../controller/reviewController')
const middleware = require('../middleware/auth.js')




//--Api---------------
router.post("/register",userController.createUser )

router.post("/login",userController.UserLogin)

router.post("/books",middleware.authentication,middleware.Autherisation1,bookController.createBook)

router.get("/getBooks",middleware.authentication,bookController.getBooks)

router.get("/books/:bookId",middleware.authentication,middleware.Autherisation2,bookController.getDetailsBooks)

router.put("/books/:bookId",middleware.authentication,middleware.Autherisation2,bookController.updateBook)

router.delete("/books/:bookId",middleware.authentication,middleware.Autherisation2,bookController.deletedBook)

router.post('/books/:bookId/review',reviewController.createReview)

router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)

router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)

module.exports = router;

