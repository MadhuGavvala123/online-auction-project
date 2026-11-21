const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config(); // Load environment variables
const Product = require('./models/Product');
const Bid = require('./models/Bid'); // Import the Bid model
const app = express();
const authenticateToken = require('./middleware/auth'); // Adjust the path if needed
const UserActivity = require('./models/UserActivity');
const multer = require('multer');
const { processImage, uploadToCloudinary } = require('./utils/imageProcessor');

// Add environment check
console.log('Environment check:', {
    MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET'
});

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://your-frontend.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Auctioning', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Test route
app.get('/test', async (req, res) => {
    try {
        console.log('Testing MongoDB connection...');
        const count = await User.countDocuments();
        console.log('User count:', count);
        res.json({ 
            message: 'MongoDB connection working', 
            userCount: count,
            env: {
                MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
                JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? 'SET' : 'NOT SET'
            }
        });
    } catch (err) {
        console.error('MongoDB test error:', err);
        res.status(500).json({ 
            message: 'MongoDB connection failed', 
            error: err.message 
        });
    }
});

// ✅ Signup route
app.post('/signup', async (req, res) => {
    console.log('=== SIGNUP REQUEST START ===');
    console.log('Request body:', req.body);
    
    const { name, mobile, email, password } = req.body;
    
    // Check if all required fields are present
    if (!name || !mobile || !email || !password) {
        console.log('Missing required fields');
        return res.status(400).json({ 
            message: 'All fields are required',
            received: { name: !!name, mobile: !!mobile, email: !!email, password: !!password }
        });
    }

    try {
        console.log('Checking for existing user...');
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('Creating new user...');
        
        // Set admin status if email is admin@auction.com
        const isAdminUser = email === 'admin@auction.com';
        const newUser = new User({ 
            name, 
            mobile, 
            email, 
            password: hashedPassword,
            isAdmin: isAdminUser
        });
        
        console.log('Saving user to database...');
        console.log('Is admin user:', isAdminUser);
        await newUser.save();
        
        console.log('User created successfully:', email);
        res.json({ message: 'Signup successful' });
    } catch (err) {
        console.error('=== SIGNUP ERROR ===');
        console.error('Error type:', err.constructor.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('=== END ERROR ===');
        res.status(500).json({ 
            message: 'Signup failed', 
            error: err.message,
            type: err.constructor.name
        });
    }
});

// ✅ Signin route - FIXED VERSION
app.post('/signin', async (req, res) => {
    console.log('=== SIGNIN REQUEST START ===');
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        console.log('Looking for user with email:', email);
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'User not found' });
        }

        console.log('Comparing passwords...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Password valid, generating token...');
        
        // Check if user is admin (either by database flag or email)
        const isAdminUser = user.isAdmin || user.email === 'admin@auction.com';
        
        // Check if JWT_SECRET_KEY is available
        if (!process.env.JWT_SECRET_KEY) {
            console.error('JWT_SECRET_KEY is not set');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        
        const token = jwt.sign({ userId: user._id, isAdmin: isAdminUser }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d',
        });

        console.log('User signed in successfully:', email);
        console.log('Is admin user:', isAdminUser);
        
        res.json({
            message: 'Signin successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: isAdminUser
            },
            token: token
        });
    } catch (err) {
        console.error('=== SIGNIN ERROR ===');
        console.error('Error type:', err.constructor.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('=== END ERROR ===');
        res.status(500).json({ 
            message: 'Signin failed', 
            error: err.message,
            type: err.constructor.name
        });
    }
});

// ✅ Authentication middleware


app.get('/items', async (req, res) => {
    try {
        const items = await Product.find().select('name price auctionDate auctionEndDate auctionStartTime auctionEndTime img auctionStatus description _id category');
        console.log("Sample item:", items[0]);
        res.json(items);
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ message: "Failed to load items" });
    }
});

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Enhanced image upload endpoint
app.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Process image
        const processedImage = await processImage(req.file.buffer, {
            width: 800,
            height: 600,
            quality: 80,
            format: 'jpeg'
        });

        // Upload to Cloudinary
        const imageUrl = await uploadToCloudinary(processedImage);

        res.json({ 
            imageUrl,
            message: 'Image uploaded successfully',
            originalSize: req.file.size,
            processedSize: processedImage.length
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

//POST /sell (in server.js) - Updated to store time strings
app.post('/sell', authenticateToken, async (req, res) => {
    console.log("Received /sell request:", req.body);
    try {
        const {
            name, description, price, auctionDate, auctionEndDate,
            auctionStartTime, auctionEndTime, category, img
        } = req.body;

        // Handle image processing safely
        let processedImg = img;
        if (img && img.startsWith('data:image')) {
            try {
                // Convert base64 to buffer
                const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                
                // Process and upload to Cloudinary
                const processedImage = await processImage(buffer);
                processedImg = await uploadToCloudinary(processedImage);
            } catch (imageError) {
                console.error('Image processing error:', imageError);
                // Use original image if processing fails
                processedImg = img;
            }
        }

        // Use auctionEndDate if provided, otherwise use auctionDate
        const endDate = auctionEndDate || auctionDate;

        // Combine auctionDate with times for status calculation
        const startDateTime = new Date(`${auctionDate}T${auctionStartTime}:00`);
        const endDateTime = new Date(`${endDate}T${auctionEndTime}:00`);
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
            price: parseFloat(price),
            auctionDate,
            auctionEndDate: endDate,
            auctionStartTime,
            auctionEndTime,
            category,
            img: processedImg,
            auctionStatus,
        });

        console.log("Product object to be saved:", newProduct);

        const savedProduct = await newProduct.save();
        res.status(200).json({ 
            message: "Item saved successfully",
            product: savedProduct
        });
    } catch (error) {
        console.error("Error saving item:", error);
        res.status(500).json({ message: "Error saving item" });
    }
});


app.delete('/items/:name', authenticateToken, async (req, res) => {
    // Check if user is admin
    console.log('Delete request - User:', req.user);
    console.log('User isAdmin:', req.user.isAdmin);
    
    if (!req.user.isAdmin) {
        console.log('Admin access denied for user:', req.user.userId);
        return res.status(403).json({ message: "Admin access required" });
    }

    const { name } = req.params;
    try {
        console.log(`Admin deleting product: ${name}`);
        
        // Simple deletion without complex transactions
        const product = await Product.findOneAndDelete({ name });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete related bids
        const deletedBids = await Bid.deleteMany({ productId: product._id });
        console.log(`Deleted ${deletedBids.deletedCount} bids for product ${name}`);

        res.status(200).json({ 
            message: 'Product deleted successfully',
            deletedProduct: product.name,
            deletedBids: deletedBids.deletedCount
        });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ 
            message: 'Error deleting product',
            error: error.message 
        });
    }
});

// Get product details by ID.  Used in Buy.jsx
app.get('/items/:productId',authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ message: 'Failed to fetch product details' });
    }
});

// Route to handle placing a bid
app.post('/bid/:productId',authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const { bidAmount } = req.body;
        const userId = req.user.userId; // Get the user ID from the authentication token

        // Basic validation (you should have more robust validation)
        if (!bidAmount || bidAmount <= 0) {
            return res.status(400).json({ message: 'Invalid bid amount' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        //check if the bid amount is greater than the current price.
        if (bidAmount < product.price) {
            return res.status(400).json({ message: 'Bid amount is lower than current price' });
        }

        // Create a new bid
        const newBid = new Bid({
            productId,
            bidAmount,
            bidder: userId, // Associate the bid with the logged-in user
        });

        await newBid.save();

        res.status(201).json({ message: 'Bid placed successfully' });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ message: 'Failed to place bid', error: error.message });
    }


});

// Get all bids - FIXED VERSION
app.get('/bids', async (req, res) => {
    try {
        console.log('Fetching all bids...');
        const bids = await Bid.find()
            .populate('productId', 'name category img price auctionStatus') // Populate product info
            .populate('bidder', 'name email') // Populate bidder info
            .sort({ timestamp: -1 }); // Sort by newest first
        
        // Filter out bids for deleted products
        const validBids = bids.filter(bid => bid.productId !== null);
        
        console.log(`Fetched ${validBids.length} valid bids out of ${bids.length} total`);
        res.json(validBids);
    } catch (err) {
        console.error('Error fetching bids:', err);
        res.status(500).json({ message: 'Failed to fetch bids', error: err.message });
    }
});

// Simplified winners route - more robust error handling
app.get('/winners', async (req, res) => {
    try {
        console.log('Fetching auction winners and active bids...');
        
        const now = new Date();
        console.log('Current time:', now);
        
        // Get all products that exist (not deleted)
        const allProducts = await Product.find();
        console.log(`Found ${allProducts.length} products`);
        
        const results = {
            winners: [],
            activeBids: [],
            upcomingAuctions: []
        };

        for (const product of allProducts) {
            try {
                console.log(`Processing product: ${product.name}`);
                
                // Use auctionEndDate if available, otherwise fallback to auctionDate
                const endDate = product.auctionEndDate || product.auctionDate;
                
                // Parse dates safely using the correct end date
                const startDateTime = new Date(`${product.auctionDate}T${product.auctionStartTime}:00`);
                const endDateTime = new Date(`${endDate}T${product.auctionEndTime}:00`);
                
                console.log(`Product ${product.name}: Start=${startDateTime}, End=${endDateTime}, Now=${now}`);
                
                // Get the highest bid for this product
                const highestBid = await Bid.findOne({ productId: product._id })
                    .sort({ bidAmount: -1 })
                    .populate('bidder', 'name email');
                
                const totalBids = await Bid.countDocuments({ productId: product._id });
                
                const productInfo = {
                    productId: product._id,
                    productName: product.name,
                    productCategory: product.category,
                    productImage: product.img,
                    productDescription: product.description,
                    startingPrice: product.price,
                    auctionStartDate: product.auctionDate,
                    auctionStartTime: product.auctionStartTime,
                    auctionEndDate: endDate,
                    auctionEndTime: product.auctionEndTime,
                    totalBids: totalBids
                };

                if (now > endDateTime) {
                    // Auction is closed - add to winners ONLY if there are bids
                    if (highestBid) {
                        results.winners.push({
                            ...productInfo,
                            winnerName: highestBid.bidder.name,
                            winnerEmail: highestBid.bidder.email,
                            winningBid: highestBid.bidAmount,
                            bidDate: highestBid.timestamp,
                            status: 'CLOSED'
                        });
                        console.log(`Added ${product.name} to winners with bid amount: ${highestBid.bidAmount}`);
                    } else {
                        console.log(`Product ${product.name} is closed but has no bids`);
                    }
                } else if (now >= startDateTime && now <= endDateTime) {
                    // Auction is active - add to active bids
                    if (highestBid) {
                        results.activeBids.push({
                            ...productInfo,
                            currentHighestBidder: highestBid.bidder.name,
                            currentHighestBid: highestBid.bidAmount,
                            bidDate: highestBid.timestamp,
                            status: 'LIVE',
                            timeRemaining: endDateTime - now
                        });
                        console.log(`Added ${product.name} to active bids`);
                    }
                } else {
                    // Auction is upcoming
                    results.upcomingAuctions.push({
                        ...productInfo,
                        status: 'UPCOMING'
                    });
                    console.log(`Added ${product.name} to upcoming auctions`);
                }
            } catch (productError) {
                console.error(`Error processing product ${product.name}:`, productError);
                // Continue with next product instead of failing completely
            }
        }

        // Sort winners by winning bid amount (highest first)
        results.winners.sort((a, b) => b.winningBid - a.winningBid);
        results.activeBids.sort((a, b) => b.currentHighestBid - a.currentHighestBid);

        console.log(`Final results: ${results.winners.length} winners, ${results.activeBids.length} active bids, ${results.upcomingAuctions.length} upcoming auctions`);
        res.json(results);
    } catch (err) {
        console.error('Error fetching winners:', err);
        res.status(500).json({ 
            message: 'Failed to fetch winners', 
            error: err.message,
            stack: err.stack 
        });
    }
});

// Add route to get winners for a specific product
app.get('/winners/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if auction is closed
        const now = new Date();
        const endDateTime = new Date(`${product.auctionDate}T${product.auctionEndTime}:00`);
        
        if (now <= endDateTime) {
            return res.status(400).json({ message: 'Auction is still active' });
        }

        // Get the highest bid
        const highestBid = await Bid.findOne({ productId })
            .sort({ bidAmount: -1 })
            .populate('bidder', 'name email')
            .populate('productId', 'name category img price auctionDate auctionEndTime');

        if (!highestBid) {
            return res.status(404).json({ message: 'No bids found for this product' });
        }

        const winner = {
            productId: product._id,
            productName: product.name,
            productCategory: product.category,
            productImage: product.img,
            productDescription: product.description,
            startingPrice: product.price,
            winnerName: highestBid.bidder.name,
            winnerEmail: highestBid.bidder.email,
            winningBid: highestBid.bidAmount,
            bidDate: highestBid.timestamp,
            auctionEndDate: product.auctionEndDate,
            auctionEndTime: product.auctionEndTime,
            totalBids: await Bid.countDocuments({ productId })
        };

        res.json(winner);
    } catch (err) {
        console.error('Error fetching winner:', err);
        res.status(500).json({ message: 'Failed to fetch winner', error: err.message });
    }
});

// Add this test route to debug the issue
app.get('/test-winners', async (req, res) => {
    try {
        console.log('Testing winners route...');
        
        // Test 1: Check if products exist
        const productCount = await Product.countDocuments();
        console.log(`Total products: ${productCount}`);
        
        // Test 2: Check if bids exist
        const bidCount = await Bid.countDocuments();
        console.log(`Total bids: ${bidCount}`);
        
        // Test 3: Get sample data
        const sampleProduct = await Product.findOne();
        const sampleBid = await Bid.findOne();
        
        res.json({
            message: 'Test successful',
            productCount,
            bidCount,
            sampleProduct: sampleProduct ? {
                id: sampleProduct._id,
                name: sampleProduct.name,
                auctionDate: sampleProduct.auctionDate,
                auctionStartTime: sampleProduct.auctionStartTime,
                auctionEndTime: sampleProduct.auctionEndTime
            } : null,
            sampleBid: sampleBid ? {
                id: sampleBid._id,
                productId: sampleBid.productId,
                bidAmount: sampleBid.bidAmount,
                bidder: sampleBid.bidder
            } : null
        });
    } catch (err) {
        console.error('Test route error:', err);
        res.status(500).json({ 
            message: 'Test failed', 
            error: err.message 
        });
    }
});

// Admin Dashboard Analytics
app.get('/admin/dashboard', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }

    try {
        const now = new Date();
        
        // Calculate total revenue from completed auctions
        const completedProducts = await Product.find({
            auctionStatus: 'Closed'
        });
        
        let totalRevenue = 0;
        for (const product of completedProducts) {
            const highestBid = await Bid.findOne({ productId: product._id })
                .sort({ bidAmount: -1 });
            if (highestBid) {
                totalRevenue += highestBid.bidAmount;
            }
        }

        // Get recent activity (last 7 days)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentBids = await Bid.find({ timestamp: { $gte: sevenDaysAgo } })
            .populate('bidder', 'name email')
            .populate('productId', 'name')
            .sort({ timestamp: -1 })
            .limit(10);

        const recentUsers = await User.find({ 
            createdAt: { $gte: sevenDaysAgo } 
        }).sort({ createdAt: -1 }).limit(5);

        const stats = {
            totalUsers: await User.countDocuments(),
            totalProducts: await Product.countDocuments(),
            totalBids: await Bid.countDocuments(),
            activeAuctions: await Product.countDocuments({ auctionStatus: 'Live' }),
            upcomingAuctions: await Product.countDocuments({ auctionStatus: 'Upcoming' }),
            closedAuctions: await Product.countDocuments({ auctionStatus: 'Closed' }),
            totalRevenue: totalRevenue,
            averageBidAmount: await Bid.aggregate([
                { $group: { _id: null, avgBid: { $avg: '$bidAmount' } } }
            ]).then(result => result[0]?.avgBid || 0),
            recentActivity: {
                bids: recentBids,
                newUsers: recentUsers
            },
            topCategories: await Product.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ])
        };

        res.json(stats);
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Failed to fetch admin dashboard data' });
    }
});

// Admin user management
app.get('/admin/users', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }

    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Admin product management
app.get('/admin/products', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }

    try {
        const products = await Product.find().populate('seller', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// User Analytics
app.get('/analytics/user-stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Get user's bidding statistics
        const totalBids = await Bid.countDocuments({ bidder: userId });
        const totalBidAmount = await Bid.aggregate([
            { $match: { bidder: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: '$bidAmount' } } }
        ]).then(result => result[0]?.total || 0);

        // Get winning bids
        const winningBids = await Bid.aggregate([
            { $match: { bidder: mongoose.Types.ObjectId(userId) } },
            { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' },
            { $match: { 'product.auctionStatus': 'Closed' } },
            { $group: { _id: '$productId', highestBid: { $max: '$bidAmount' } } }
        ]);

        // Get user activity
        const recentActivity = await UserActivity.find({ userId })
            .sort({ timestamp: -1 })
            .limit(10);

        // Get favorite categories
        const favoriteCategories = await Bid.aggregate([
            { $match: { bidder: mongoose.Types.ObjectId(userId) } },
            { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' },
            { $group: { _id: '$product.category', bidCount: { $sum: 1 } } },
            { $sort: { bidCount: -1 } },
            { $limit: 3 }
        ]);

        const stats = {
            totalBids,
            totalBidAmount,
            winningBids: winningBids.length,
            averageBidAmount: totalBids > 0 ? totalBidAmount / totalBids : 0,
            recentActivity,
            favoriteCategories,
            successRate: totalBids > 0 ? (winningBids.length / totalBids) * 100 : 0
        };

        res.json(stats);
    } catch (error) {
        console.error('User analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch user analytics' });
    }
});

// Track user activity middleware
const trackUserActivity = (action) => {
    return async (req, res, next) => {
        try {
            if (req.user) {
                await UserActivity.create({
                    userId: req.user.userId,
                    action,
                    details: req.body,
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent')
                });
            }
        } catch (error) {
            console.error('Activity tracking error:', error);
        }
        next();
    };
};

// Apply tracking to existing routes
app.post('/bid/:productId', authenticateToken, trackUserActivity('place_bid'), async (req, res) => {
    // ... existing bid logic ...
});

// Route to fix admin users (for development)
app.get('/fix-admin', async (req, res) => {
    try {
        // Find user with admin@auction.com email
        const adminUser = await User.findOne({ email: 'admin@auction.com' });
        
        if (adminUser) {
            // Update to admin
            adminUser.isAdmin = true;
            await adminUser.save();
            res.json({ 
                message: 'Admin user updated successfully',
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    isAdmin: adminUser.isAdmin
                }
            });
        } else {
            res.json({ message: 'No admin user found with admin@auction.com' });
        }
    } catch (error) {
        console.error('Error fixing admin user:', error);
        res.status(500).json({ message: 'Error fixing admin user' });
    }
});

// Test route to check admin authentication
app.get('/test-admin', authenticateToken, async (req, res) => {
    res.json({
        message: 'Admin test successful',
        user: {
            id: req.user.userId,
            isAdmin: req.user.isAdmin
        }
    });
});

// Test route for debugging
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        env: {
            MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
            JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? 'SET' : 'NOT SET',
            NODE_ENV: process.env.NODE_ENV || 'NOT SET'
        }
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
