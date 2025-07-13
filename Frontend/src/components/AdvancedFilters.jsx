import React, { useState } from 'react';
import './AdvancedFilters.css';

const AdvancedFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        category: '',
        priceRange: [0, 10000],
        status: 'all',
        sortBy: 'date',
        searchQuery: ''
    });

    const categories = [
        'All Categories',
        'Electronics',
        'Clothing',
        'Automobile',
        'Jewellery',
        'Home',