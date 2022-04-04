
const jwt = require("jsonwebtoken");

const bookModel = require("../model/bookModel")
const userModel = require('../model/userModel')


const authentication = async function (req, res, next) {
    try {

        let token = req.headers["x-new-data"]
        if (!token) { return res.status(404).send({status: false, msg: "Token is not Present" })}

        let decodedToken = jwt.verify(token, "decode")
        if (!decodedToken) { return res.status(400).send({ status: false, msg: "Token is Invalid" })}

    }

    catch (err) { return res.status(500).send({ status: false, msg: err.message })}
    next();
}

//--------------------------------AutherisationForCreateBOOk--------------------------------------------------------------------------------------------------

const Autherisation1 = async function (req,res,next) {
    try {
        const token = req.headers['x-new-data']
        if (!token) { return res.status(404).send({ status: false, msg: "Header missing" })}

        const decodedToken = jwt.verify(token, "decode")
        if (!decodedToken) { return res.status(400).send({ status: false, msg: "Invalid Token" })}


        const dataUserId = req.body.userId
        const finduser = await userModel.findById(dataUserId)
        if(!dataUserId){return res.status(400).send({status:false,msg:"User not exist"})}

        if(finduser._id!=decodedToken.userId)
        {return res.status(400).send("User is Unauthorised to create Book")}
        next()
    }
    catch (err) {res.status(500).send({ status: false, msg: err.message })}
}
//----------------------AutherizationForUpdateAndDelete--------------------------------------------------------------------------------------

const Autherisation2 = async function (req, res, next) {

    try {
        const token = req.headers['x-new-data']
        if (!token) { return res.status(404).send({ status: false, msg: 'Token required' }) }

        const decodedToken = jwt.verify(token, "decode")
        if (!decodedToken) { return res.status(400).send({ status: false, msg: "Invalid Token" }) }

        let data = req.params.bookId
        const newData = await bookModel.findById(data)
        if (!newData) { return res.status(400).status({ status: false, msg: "No book present with this ID" }) }
        if (newData.userId == decodedToken.userId) { next() }
        else {return res.status(400).send({ status: false, msg: "Not Allowed to Modify" }) }
    }

    catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}

module.exports.authentication=authentication
module.exports.Autherisation1=Autherisation1
module.exports.Autherisation2=Autherisation2