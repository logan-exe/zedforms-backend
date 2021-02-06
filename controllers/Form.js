const Form = require("../models/Form");
const shortid = require("shortid");

exports.saveForm = async (req, res) => {
  console.log(req.body);
  const newForm = new Form(req.body);
  const savedForm = await newForm.save();
  res.send(savedForm);
};

exports.getForm = async (req, res) => {
  console.log(req.params.myid);
  console.log(req.body);
  const form = await Form.find({ myid: `${req.params.myid}` });
  console.log(form);
  res.send(form);
};
