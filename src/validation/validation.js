const validator = require("email-validator");
const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false 
    return true;
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}


const isValidMobileNum = function (value) {
    if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value.trim()))) {
        return false
    }
    return true
}


const isValidSyntaxOfEmail = function (value) {
    if (!(validator.validate(value))) {
        return false
    }
    return true
}




module.exports.isValid = isValid
module.exports.isValidRequestBody = isValidRequestBody
module.exports.isValidMobileNum = isValidMobileNum
module.exports.isValidSyntaxOfEmail = isValidSyntaxOfEmail
