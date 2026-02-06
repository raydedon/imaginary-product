    import axios from 'axios';

    export const fetchPexelsImages = async (query, count = 5) => {
        const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

        try {
            const response = await axios.get('https://api.pexels.com/v1/search', {
                params: {
                    query: query,
                    per_page: count,
                    orientation: 'portrait' // Better for product images
                },
                headers: {
                    Authorization: PEXELS_API_KEY
                }
            });

            // Transform Pexels response to our image format
            return response.data.photos.map((photo, index) => ({
                url: photo.src.large, // or photo.src.original for highest quality
                alt: `${query} - Professional product photography ${index + 1}`,
                photographer: photo.photographer,
                photographerUrl: photo.photographer_url
            }));
        } catch (error) {
            console.error('Error fetching images from Pexels:', error);
            // Return empty array on error - will use fallback images
            return [];
        }
    };

    export const fetchCategories = async () => {
        try {
            const response = await fetch('https://dummyjson.com/products/categories');
            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            return [];
        }
    };

    export const fetchProducts = async (limit = 50) => {
        try {
            const response = await fetch(`https://dummyjson.com/products?limit=${limit}`);
            const data = await response.json();
            return data?.products || [];
        } catch (error) {
            console.error('Failed to fetch products:', error);
            return [];
        }
    };

    /**
     * Fetch products from the dummyjson API by category.
     * @param {string} category - The category to filter by (required).
     * @param {number} limit - How many products to fetch (optional, default: 12).
     * @returns {Promise<Array>} Array of product objects in the given category.
     */
    export const fetchProductsByCategory = async (category, limit = 12) => {
        if (!category) {
            console.error('fetchProductsByCategory: category argument is required');
            return [];
        }
        try {
            const response = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}`);
            const data = await response.json();
            // The API returns products in data.products just like the main endpoint
            return data?.products || [];
        } catch (error) {
            console.error('Failed to fetch products by category:', error);
            return [];
        }
    };