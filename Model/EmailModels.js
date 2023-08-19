const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  from:{
    type: String,
  },
  body: { 
    type: String, 
    required: true 
  },
  parentEmail: { 
    type: String, 
  },
  recipient: { 
    type: String, 
    required: true 
  },
  sentDate: { 
    type: Date, 
    default: Date.now 
  },
  seen: { 
    type: Boolean, 
    default: false 
  },
});

const Email = mongoose.model('EmailSend', emailSchema);

module.exports = Email;
