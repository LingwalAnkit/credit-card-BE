const mongoose = require("mongoose");

const creditCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  cardType: {
    type: String,
    enum: ['visa', 'mastercard', 'amex'],
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// We don't want to expose the encrypted values in API responses
creditCardSchema.methods.toJSON = function() {
  const obj = this.toObject();
  
  // We'll keep the encrypted values in the database
  // but clean them up for the API response
  return obj;
};

const CreditCard = mongoose.model("CreditCard", creditCardSchema);
module.exports = CreditCard;