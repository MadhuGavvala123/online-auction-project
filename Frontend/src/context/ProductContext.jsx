import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const ProductContext = createContext();

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/items');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (productName) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Attempting to delete product:', productName);
            console.log('Token:', token ? 'Present' : 'Missing');
            
            const response = await api.delete(`/items/${encodeURIComponent(productName)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Delete response:', response.data);

            if (response.status === 200) {
                // Remove the deleted product from state
                setProducts(prevProducts => 
                    prevProducts.filter(product => product.name !== productName)
                );
                return { success: true, message: 'Product deleted successfully' };
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            console.error('Error response:', error.response?.data);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to delete product' 
            };
        }
    };

    const addProduct = (newProduct) => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
    };

    const updateProduct = (productId, updatedData) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product._id === productId ? { ...product, ...updatedData } : product
            )
        );
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const value = {
        products,
        loading,
        error,
        fetchProducts,
        deleteProduct,
        addProduct,
        updateProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}; 