
const mongoose = require('mongoose');
const FormSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      
    },
    mobile: {
      type: Number,
    },
    from: {
        type: String,
    },
    to: {
        type: String,

     },
     date: {
        type: String,

     }
  });
  
  const Form = mongoose.model('Form', FormSchema);
  module.exports=Form;

