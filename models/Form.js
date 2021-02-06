const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const Form = mongoose.model(
  "forms",
  new mongoose.Schema({
    _id: { type: String, default: shortid.generate },
    formid: String,

    user_id: String,
    user_name: String,
    form_fields: [
      {
        id: String,
        compType: String,
        inputs: [{ option: String }],
        is_required: Boolean,
        label: String,
        description: String,
        constrains: [{ name: String, value: String }],
      },
    ],
  })
);

module.exports = Form;
