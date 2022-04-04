const mongoose=require('mongoose');


const bookModel=new mongoose.Schema({

    title: {type:String, required:true, unique:true,trim:true},
    excerpt: {type:String, required:true,trim:true}, 
    userId: {type:mongoose.Schema.Types.ObjectId,ref:'userModel'},
    ISBN: {type:String,required:true, unique:true},
    category: {type:String,required:true},
    subcategory: {type:String,required:true},
    reviews: {type:Number,default:0},
    deletedAt: {type:Date,trim:true},
    isDeleted: {type:Boolean,default:false},
    releasedAt:{type:Date,required:true},
    },{timestamps: true });
     
     module.exports=mongoose.model("createbook",bookModel)
     