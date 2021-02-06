const FormResponse = require("../models/FormResponse");

exports.saveFormResponse = async (req, res) => {
  //   const findForm = Form.find({
  //     user_id: req.parms.user_id,
  //     form_id: req.params.form_id,
  //   });
  const newFormResponse = new FormResponse(req.body);
  const savedFormResponse = await newFormResponse.save();

  res.send(savedFormResponse);
};
