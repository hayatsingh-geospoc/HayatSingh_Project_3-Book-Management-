const express = require('express');
const router = express.Router();
const CollegeController=require("../controller/collegeController")
const InternController=require("../controller/internController")



//////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/functionup/colleges",CollegeController.createCollege )

router.post("/functionup/interns", InternController.createIntern)

router.get("/functionup/collegeDetails", InternController.getCollegeDetails)



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;
