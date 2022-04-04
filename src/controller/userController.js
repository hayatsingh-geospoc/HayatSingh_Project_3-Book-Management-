//const collegeDetails=require("../model/collegeModel")
//const validator = require("email-validator")
const userModel =require("../model/userModel")
const jwt=require('jsonwebtoken')

const isValid = function(value) {
  if (typeof value == undefined || value == null || value==0 ) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//-------creatingUser-----------------------------------------------------
const createUser = async (req,res) => {
  try {
        let data = req.body;
        
    const {name,password,address} = data;

    if (Object.keys(data) <= 0) { return res.status(400).send({ status: false, msg: " data is  missing" });}

    const reqtitle = isValid(data.title)
          if (!reqtitle) {return res.status(400).send({ status: false, msg: " title is required" });}

          const title = data.title.trim()
          const isValidTitle = function (title){
            return ["Mr", "Mrs", "Miss"].indexOf(title)!==-1
        }

        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: `${title} title is not valid` })
        }

   
    const reqName = isValid(name);
    if (!reqName) {return res.status(400).send({ status: false, msg: " name is required" });}

    const reqPhone = isValid(data.phone);
    if (!reqPhone) { return res.status(400).send({ status: false, msg: "phone no is required" });}

     const reqEmail=isValid(data.email);
      if(!reqEmail){return res.status(400).send({status:false,msg:"email is required"});}

    const reqPassword=isValid(password)
    if(!reqPassword){ return res.status(400).send({status:false,msg:"Password required"});}

   const reqAddress=isValid(address.street)
    if(!reqAddress){ return res.status(400).send({status:false,msg:"Address is required"});}

   const reqCity=isValid(address.city)
    if(!reqCity){ return res.status(400).send({status:false,msg:"Address is required"});}


   const reqPincode=isValid(address.pincode)
    if(!reqPincode){ return res.status(400).send({status:false,msg:"Address is required"});}

    if(!(/^[1-9][0-9]{5}$/.test(address.pincode.trim())))
        { return  res.status(400).send("pincode is invalid")}


    //----EmailVAlidation
    const email=data.email.trim()
     if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))){ return res.status(400).send({ status: false, msg: "Please provide a valid email" })}

    //----NumberValidation
    const phone=data.phone.trim()
     if (!(/^[6-9]\d{9}$/.test(phone))){return res.status(400).send({ status: false, msg: "Please provide a valid Moblie Number" })}

       //DUPLICACY CHECK
      let duplicatephone  = await userModel.findOne({phone:phone})
          if(duplicatephone){return res.status(400).send({ status:false, msg: "Mobile number already exists"})}
    //DUPLICACY CHECK
      let duplicateEmail= await userModel.findOne({email:email})
          if(duplicateEmail){return res.status(400).send({status:false,msg:"Email is already present"})}

    let saveData = await userModel.create(data);
    res.status(201).send({ status: true, msg: saveData })}
     catch (err) {
       res.status(500).send({ status: false, msg: err.message });}
      };

//-------------------------LOGIN-----------------------------------------------------------------------------------------------------------------------------
   let UserLogin = async (req,res)=>{

    let email = req.body.email
    let password = req.body.password

    if (!email) {return res.status(400).send({ status: false, msg: " email is required" });}
    if (!password) {return res.status(400).send({ status: false, msg: " password is required" });}
    
   let khusboo = await userModel.findOne({email:email,password:password})
    if(!khusboo)res.status(400).send({newmsg:"email and password required"})
   
   let token = jwt.sign(
    {
      userId: khusboo._id,
      batch: "Project3-Book-Management",
      organisation: "FunctionUp",
    },
    "decode",{expiresIn:"1hr" },
  );
   res.setHeader('x-new-data',token)
   return res.status(201).send({ status: true, TOKEN: token });
  }

                
module.exports.createUser =createUser
module.exports.UserLogin=UserLogin