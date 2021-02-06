const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const FormResponse = mongoose.model(
  "formsresponses",
  new mongoose.Schema({
    _id: { type: String, default: shortid.generate },
    form_id: String,
    user_id: String,
    responses: [
      {
        response_id: String,
        response_values: [{ field_name: String, value: String }],
      },
    ],
  })
);

module.exports = FormResponse;
