const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Product = require('../models/Product');

// Place a bid
router.post('/', async (req, res) => {
  try {
    const { productId, amount, username, category, time } = req.body;

    const newBid = new Bid({
      productId,
      amount,
      username,
      category,
      time,
    });

    await newBid.save();
    res.status(200).json({ message: 'Bid placed successfully' });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Failed to place bid' });
  }
});

// Fetch grouped bids by product
router.get('/grouped', async (req, res) => {
  try {
    const bids = await Bid.find();
    const products = await Product.find();

    const grouped = {};

    bids.forEach(bid => {
      const product = products.find(p => p._id.toString() === bid.productId.toString());
      if (!product) return;

      if (!grouped[product.name]) {
        grouped[product.name] = {
          productInfo: product,
          bids: [],
        };
      }

      grouped[product.name].bids.push(bid);
    });

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching grouped bids:', error);
    res.status(500).json({ message: 'Failed to fetch grouped bids' });
  }
});

module.exports = router;
