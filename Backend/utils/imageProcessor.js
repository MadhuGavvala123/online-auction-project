const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const processImage = async (buffer, options = {}) => {
    const {
        width = 800,
        height = 600,
        quality = 80,
        format = 'jpeg'
    } = options;

    try {
        let processedImage = sharp(buffer)
            .resize(width, height, { 
                fit: 'inside',
                withoutEnlargement: true 
            });

        if (format === 'jpeg') {
            processedImage = processedImage.jpeg({ quality });
        } else if (format === 'png') {
            processedImage = processedImage.png({ quality });
        } else if (format === 'webp') {
            processedImage = processedImage.webp({ quality });
        }

        return await processedImage.toBuffer();
    } catch (error) {
        console.error('Image processing error:', error);
        throw error;
    }
};

const uploadToCloudinary = async (buffer, folder = 'auction-products') => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    transformation: [
                        { width: 800, height: 600, crop: 'limit' },
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

module.exports = { processImage, uploadToCloudinary }; 