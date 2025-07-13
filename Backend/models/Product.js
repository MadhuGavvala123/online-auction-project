const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  auctionDate: { type: String, required: true },
  auctionEndDate: { type: String, required: true },
  auctionStartTime: { type: String, required: true },
  auctionEndTime: { type: String, required: true },
  category: { type: String, required: true },
  img: { type: String, required: true }, // Base64 string of the image
  auctionStatus: { type: String, default: 'Upcoming' }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
