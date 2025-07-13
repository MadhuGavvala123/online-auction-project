




const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Create a new product
router.post('/', async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            price,
            auctionDate,
            auctionStartTime,  // Receive as string
            auctionEndTime,    // Receive as string
            img,
            username
        } = req.body;

        // Combine and calculate auctionStatus
        const startDateTime = new Date(`${auctionDate}T${auctionStartTime}:00`);
        const endDateTime = new Date(`${auctionDate}T${auctionEndTime}:00`);
        const now = new Date();

        let auctionStatus = 'Upcoming';
        if (now >= startDateTime && now <= endDateTime) {
            auctionStatus = 'Live';
        } else if (now > endDateTime) {
            auctionStatus = 'Closed';
        }

        const newProduct = new Product({
            name,
            description,
            category,
            price,
            auctionDate,
            auctionStartTime,  // Store as string
            auctionEndTime,    // Store as string
            img,
            username,
            auctionStatus,
        });

        console.log("Product to be saved:", newProduct); // Add this line for debugging

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product', error: error.message }); // Include error message
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        console.log("Products fetched:", products);  // Add this line for debugging
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message }); // Include error message
    }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' }); // Handle not found case
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product', error: error.message }); // Include error message
    }
});

module.exports = router;
