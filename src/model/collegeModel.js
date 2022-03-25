const mongoose = require('mongoose');

const college = new mongoose.Schema( {
    name:
         {type: String, 
         required: true,
         trim:true,
         lowercase:true,
         unique:true}, 
         
    fullName: 
    {type: String,
     required: true,
     trim:true},      // example Indian Institute of Technology, Hyderabad`}
    
     logoLink:{type: String, 
               required: true,
               trim:true},
    
               isDeleted: {
                type:Boolean, 
                default: false
            }
        } 
,{ timestamps: true } );

module.exports = mongoose.model('colleges', college)
