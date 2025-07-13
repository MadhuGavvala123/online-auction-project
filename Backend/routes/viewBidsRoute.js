const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const User = require('../models/User');

router.get('/view', async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithBids = await Promise.all(
      products.map(async (product) => {
        const bids = await Bid.find({ productId: product._id }).populate('userId', 'name');
        const formattedBids = bids.map(b => ({
          _id: b._id,
          amount: b.amount,
          userName: b.userId?.name || 'Unknown',
        }));

        return {
          _id: product._id,
          name: product.name,
          category: product.category,
          img: product.img,
          bids: formattedBids
        };
      })
    );

    res.status(200).json(productsWithBids);
  } catch (err) {
    console.error('Error in /viewbids:', err);
    res.status(500).json({ message: 'Failed to fetch bids' });
  }
});

module.exports = router;
