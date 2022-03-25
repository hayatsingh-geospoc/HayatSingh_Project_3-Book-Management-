const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const Interns = new mongoose.Schema( {
     name:    {type: String, 
               required: true,
               trim:true,
               unique:true}, 
    email:     {type: String, 
                required: true,
                 trim:true,
                 unique:true}, 
    mobile:
                {type:Number,
                    required:true,
                    unique:true,
                    trim:true
                   },
    collegeId: {
                type: ObjectId, 
                ref :"collegeModel",
                required:true,
             }, 

                isDeleted: {
                    type:Boolean, 
                    default: false,
                }
            }
,{timestamps:true});
module.exports = mongoose.model('interns', Interns)