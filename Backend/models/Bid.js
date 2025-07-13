const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Product'
  },
  bidAmount: { 
    type: Number, 
    required: true,
    min: 0.01
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Updated static methods to use correct field names
bidSchema.statics.getAllBids = async function() {
  return await this.find().populate('productId').populate('bidder');
};

bidSchema.statics.getBidsForProduct = async function(productId) {
  return await this.find({ productId }).sort({ bidAmount: -1 });
};

bidSchema.statics.placeBid = async function(productId, bidder, bidAmount) {
  const newBid = new this({
    productId,
    bidder,
    bidAmount
  });
  return await newBid.save();
};

bidSchema.statics.getHighestBid = async function(productId) {
  return await this.findOne({ productId })
    .sort({ bidAmount: -1 })
    .limit(1);
};

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;