//const internmodel=require("../model/internModel")
const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel");
const reviewModel = require("../model/reviewModel");


const isValid = function (value) {
  if (typeof value == undefined || value == null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true
}
//------BookCreation-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const createBook = async function (req, res) {

  let data = req.body
  let userId = req.body.userId
 
  

  if (!isValid(userId)){return res.status(400).send({ status: false, msg: "please provide userId" })}

  if (Object.keys(data).length==0){return res.status(400).send({ status: false, msg: "please provide some data" })}

  
   if(!isValid(data.title)) {return res.status(400).send({ status: false, msg: "title is required"});}
   if(!isValid(data.excerpt)){return res.status(400).send({status:false,msg:"excerpt is required"})}
   if(!isValid(data.ISBN)){return res.status(400).send({status:false,msg:"ISBN is required"})}
   if(!isValid(data.category)){return res.status(400).send({status:false,msg:"category is required"})}
   if(!isValid(data.subcategory)){return res.status(400).send({status:false,msg:"subcategory is required"})}
   if(!isValid(data.releasedAt)){return res.status(400).send({status:false,msg:"releasedAt is required"})}

  

   let duplicateTitle = await bookModel.findOne({title:data.title})  
   if(duplicateTitle) return res.status(400).send({msg:"Title already present"})


   let duplicateISBN = await bookModel.findOne({ISBN:data.ISBN})  
   if(duplicateISBN) return res.status(400).send({msg:"ISBN already present"})

   

   let isAuthorPresent = await userModel.findById(userId)
   if (!isAuthorPresent){ return res.status(400).send({ status: false, msg: "Author id not present" })}

   let createBooks = await bookModel.create(data)
   if (Object.keys(createBooks).length == 0){return res.status(400).send({ status: false, msg: "please provide some data" })}
   else { res.status(200).send({ status: true, msg: createBooks })}

  }


//---GetBooks----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const getBooks = async function (req,res){
try{
   let harry = req.query
    if(!harry){res.status(400).send({ status: false, msg: "please provide some data on query" })}
    let tarry = { isDeleted:false,...harry}
  
    let data = await bookModel.find(tarry).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
    if (data.length === 0){res.status(400).send({ status: false, msg: "provide some data" })}
     else {return res.status(200).send({ status: true, msg:"Booklist",data:data })}
    }
 catch(err){return res.status(400).send({ status: false, msg:err.message})}
}
//-----GetbooksByParams---------------------------------------------------------------------------------------------------------------------------------
const getDetailsBooks = async function (req, res) {
  try {
      const data = req.params.bookId

      let findBook = await bookModel.findOne({ _id: data, isDeleted: false })
      if (!findBook) return res.status(404).send({ status: false, msg: "NO books available" })

      let Stored = findBook

      let findId = findBook._id
      let findReviewscount = await reviewModel.find({ bookId: findId, isDeleted: false }).count()
      let findReviews = await reviewModel.find({ bookId: findId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
      if (!findReviews) return res.status(400).send("no reviews yet")

      let Details = {
          _id: Stored._id, title: Stored.title, excerpt: Stored.excerpt, userId: Stored.userId, ISBN: Stored.ISBN,
          category: Stored.category, subcategory: Stored.subcategory, reviews: findReviewscount, isDeleted: Stored.isDeleted,
          releasedAt: Stored.releasedAt, createdAt: Stored.createdAt, updatedAt: Stored.updatedAt, reviewsData: findReviews
      }

      res.status(200).send({ status: true, message: "Book list", Data: Details })
  }
  catch (error) {
      return res.status(500).send({ msg: error.message })
  }

}


//--------------------updateBooksById-----------------------------------------------------------------------
const updateBook = async function (req, res) {
  const data = req.body
  const data1 = req.params.bookId
  const title = data.title
  const ISBN = data.ISBN
  const excerpt = data.excerpt
  const releasedAt = data.releasedAt

  let findId = await bookModel.findById(data1)
  if (!findId) return res.status(404).send({ status: false, msg: "book not available" })

  let data2 = findId.isDeleted

  if (data2 === false) {
      let findTitle = await bookModel.findOne({ title: title })
      if (findTitle) return res.status(400).send("Title is already given please choose another name")

      let findIsbn = await bookModel.findOne({ ISBN: ISBN })
      if (findIsbn) return res.status(400).send("Number is given to another book choose anothor book number")

      let updateBook1 = await bookModel.findOneAndUpdate({ _id: data1 }, { title: title, ISBN: ISBN, excerpt: excerpt, releasedAt: releasedAt }, { new: true })
      if (!updateBook1) return res.status(404).send({ status: false, msg: "Book is not available" })
      res.status(200).send({ status: true, message: "success", data: updateBook1 })

  } else {
      return res.status(404).send({ status: false, msg: "Book is already deleted" })
  }


}





//----DeletingBook----------------------------------------------------

const deletedBook = async function (req, res) {
  const data = req.params.bookId

  let findBook = await bookModel.findById(data)
  if (!findBook) return res.status(404).send({ status: false, msg: "book not exist" })

  if (findBook.isDeleted == false) {

      let findupdate = await bookModel.findOneAndUpdate({ _id: data }, { isDeleted: true, deletedAt: new Date() }, { new: true })
      if (!findupdate) return res.status(404).send({ status: false, msg: "book not find" })
      res.status(200).send({ status: true, message: "success", data: findupdate })

  } else {
      return res.status(404).send({ status: false, msg: "book is already deleted" })
  }

}

  module.exports.createBook = createBook
  module.exports.getBooks = getBooks
  module.exports.getDetailsBooks=getDetailsBooks
  module.exports.updateBook = updateBook
  module.exports.deletedBook=deletedBook