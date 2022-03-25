const collegeDetails=require("../model/collegeModel")
const validator = require("email-validator")
const collegemodel=require("../model/collegeModel")

const isValid = (value) => {
  if (typeof value == undefined || value == null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const createCollege = async (req, res) => {
  try {
    let data = req.body;
    // const name = req.body.name
    const { name, fullName, logoLink } = data;
    if (Object.keys(data) == 0) {
      return res.status(400).send({ status: false, msg: " data is  missing" });
    }
    const reqName = isValid(name);
    if (!reqName) {
      return res.status(400).send({ status: false, msg: " name is required" });
    }
    const reqFullName = isValid(fullName);
    if (!reqFullName) {
      return res
        .status(400)
        .send({ status: false, msg: " fullName is required" });
    }
    const reqLogoLink = isValid(logoLink);
    if (!reqLogoLink) {
      return res
        .status(400)
        .send({ status: false, msg: " logoLink is required" });
    }
    const isNameAlreadyUsed = await collegemodel.findOne({ name });

    if (isNameAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: `${name} name  is already used` });
    }

    if (
      !/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(
        logoLink
      )
    )
      return res
        .status(400)
        .send({ status: false, msg: " logoLink is invalid" });

    let saveData = await collegemodel.create(data);
    res.status(201).send({ status: true, msg: saveData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};



module.exports.createCollege =createCollege ;
