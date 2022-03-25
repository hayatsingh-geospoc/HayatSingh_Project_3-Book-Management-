const internmodel=require("../model/internModel")
const collegemodel=require("../model/collegeModel")
const validator = require('../validation/validation');


const createIntern = async function (req, res) {
  
    try {
         let data = req.body
         if (Object.keys(data).length == 0){return res.status(400).send({ status: false, msg: "Bad request, No data provided." })};

         const{ name, email, mobile, collegeId, isDeleted} = data

         // For name required true:
         if (!validator.isValid(name)){ return res.status(400).send({ status: false, msg: "Intern name is required" }) }

         // For email required true:
         if (!validator.isValid(email)){ return res.status(400).send({ status: false, msg: "email is required" })}

         // For a valid email:
         if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email))){
              return res.status(400).send({ status:false, msg: 'Not a valid email'})
         }

         // For email unique true:
         let duplicateEmail  = await internmodel.findOne({email:data.email})
         if(duplicateEmail){return res.status(400).send({ status:false, msg: "email already exists"})}

         // For Mobile No. required true:
        let mobileCheck = checkIndianNumber(mobile);
        if(mobileCheck==false) return res.status(400).send({status:false, message:"Please enter a valid mobile number"})
         if (!validator.isValid(mobile)){ return res.status(400).send({ status: false, msg: "Mobile No. is required" })}

         // For a valid Mobile No.:
         if (!(/^([+]\d{2})?\d{10}$/.test(data.mobile))){
          return res.status(400).send({ status:false, msg: 'Not a valid mobile number'})
        }
        
          // let mobile= data.mobile; 
          function checkIndianNumber(b)   
       {  
       var a = /^[6-9]\d{9}$/gi;  
        if (a.test(b))   
        {  
            return true;  
                }   
              else   
            {  
              return false; 
             }  
              };


         // For Mobile No. unique true:
         let duplicateMobile  = await internmodel.findOne({mobile:data.mobile})
         if(duplicateMobile){return res.status(400).send({ status:false, msg: "Mobile number already exists"})}

         // Checking college id :
         let id = req.body.collegeId
         if(!id){ return res.status(404).send({status:false, msg:"Collegeid should be in the body."})}

         // Finding college according to college Id :
         let idMatch = await collegemodel.findById(id)
         if (!idMatch){return res.status(404).send({ status: false, msg: "No such college present in the database" })}

         // Creating Intern :
         const createIntern = await internmodel.create(data);
         res.status(201).send({ status: true, message: "Intern is  successfully created", data: createIntern })
   }

   catch (error) {
        res.status(500).send({ status: false, msg: error.message })
   }
 };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getCollegeDetails = async function (req, res) {

        try {
          let interns = []
          let result = {}
          let collegeName = req.query.collegename
      
          if (!collegeName)
            return res.status(400).send({ status: false, msg: "invalid request parameters . Please Provide college name" })
      
      
          let collegeDetails = await collegemodel.findOne({ name: collegeName })
          if (!collegeDetails)
            res.status(400).send({ status: false, msg: "No College Found" })
      
          let internDetails = await internmodel.find({ collegeId: collegeDetails._id })
          if (internDetails.length === 0) {
            res.status(400).send({ status: false, msg: "No interns were Found" })
          }
          let collegeData = {
            name: collegeDetails.name,
            fullName: collegeDetails.fullName,
            logoLink: collegeDetails.logoLink
          }
          for (let i = 0; i < internDetails.length; i++) {
            result = {
              _id:internDetails[i]._id,
              name: internDetails[i].name,
              email: internDetails[i].email,
              mobile: internDetails[i].mobile
            }
            
            interns.push(result)
          }
          
          collegeData["interns"] = interns
          let x = interns.length
          console.log(collegeData)
          res.status(200).send({ status: true,total:x, data: collegeData })
        }
        catch (error) {
          console.log(error)
          res.status(500).send({ status: false, msg: error.message })
        }
      }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.createIntern=createIntern;
module.exports.getCollegeDetails=getCollegeDetails

