// src/pages/shop/Shop.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../partials/Header';
import Sidebar from '../../partials/Sidebar';
import { userAPI, shopAPI } from '../../services/api';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Get query params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');
    
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
    if (sortParam) setSortOption(sortParam);
    if (pageParam) setCurrentPage(parseInt(pageParam, 10));
  }, [location.search]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch categories
        const categoriesResponse = await shopAPI.getProductCategories();
        setCategories(categoriesResponse.data);
        
        // Fetch products with filters
        const params = {
          skip: (currentPage - 1) * productsPerPage,
          limit: productsPerPage
        };
        
        if (selectedCategory) {
          params.category_id = selectedCategory;
        }
        
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        if (sortOption) {
          params.sort = sortOption;
        }
        
        const productsResponse = await shopAPI.getProducts(params);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.response?.data?.detail || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedCategory, searchQuery, sortOption]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Reset to first page when searching
    setCurrentPage(1);
    
    // Update URL with search params
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('search', searchQuery);
    if (selectedCategory) searchParams.set('category', selectedCategory);
    if (sortOption) searchParams.set('sort', sortOption);
    
    navigate(`/shop?${searchParams.toString()}`);
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    
    // Update URL with category param
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('search', searchQuery);
    if (categoryId) searchParams.set('category', categoryId);
    if (sortOption) searchParams.set('sort', sortOption);
    
    navigate(`/shop?${searchParams.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    
    // Update URL with sort param
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('search', searchQuery);
    if (selectedCategory) searchParams.set('category', selectedCategory);
    searchParams.set('sort', newSortOption);
    
    navigate(`/shop?${searchParams.toString()}`);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Update URL with page param
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('search', searchQuery);
    if (selectedCategory) searchParams.set('category', selectedCategory);
    if (sortOption) searchParams.set('sort', sortOption);
    searchParams.set('page', newPage);
    
    navigate(`/shop?${searchParams.toString()}`);
  };

  // Handle add to cart
  const handleAddToCart = async (productId) => {
    try {
      await shopAPI.addToCart({
        product_id: productId,
        quantity: 1
      });
      
      // Show success notification
      // TODO: Implement notification system
      alert('Product added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(error.response?.data?.detail || 'Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
              {/* Page header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Shop</h1>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Purchase ingredients and supplies for your formulations
                  </p>
                </div>

                {/* Cart button */}
                <Link
                  to="/shop/cart"
                  className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650"
                >
                  <svg className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart
                </Link>
              </div>

              {/* Search and filters */}
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search input */}
                  <div className="md:col-span-2">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Category filter */}
                 <div>
                   <select
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-gray-700 dark:text-white"
                     value={selectedCategory || ''}
                     onChange={(e) => handleCategoryChange(e.target.value || null)}
                   >
                     <option value="">All Categories</option>
                     {categories.map((category) => (
                       <option key={category.id} value={category.id}>
                         {category.name} ({category.product_count})
                       </option>
                     ))}
                   </select>
                 </div>

                 {/* Sort dropdown */}
                 <div>
                   <select
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-gray-700 dark:text-white"
                     value={sortOption}
                     onChange={handleSortChange}
                   >
                     <option value="newest">Newest</option>
                     <option value="price_asc">Price: Low to High</option>
                     <option value="price_desc">Price: High to Low</option>
                     <option value="name_asc">Name: A to Z</option>
                   </select>
                 </div>
               </div>
             </div>

             {/* Products grid */}
             {products.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {products.map((product) => (
                   <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
                     {/* Product image */}
                     <Link to={`/shop/products/${product.slug}`}>
                       <div className="h-48 overflow-hidden">
                         {product.image_url ? (
                           <img 
                             src={product.image_url} 
                             alt={product.name} 
                             className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                           />
                         ) : (
                           <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                             <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                             </svg>
                           </div>
                         )}
                       </div>
                     </Link>

                     {/* Product details */}
                     <div className="p-4 flex-grow">
                       <Link to={`/shop/products/${product.slug}`} className="block mb-1">
                         <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400">
                           {product.name}
                         </h3>
                       </Link>
                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                         {product.short_description || product.description}
                       </p>
                       
                       {/* Price */}
                       <div className="flex items-center mb-3">
                         {product.sale_price ? (
                           <>
                             <span className="text-lg font-bold text-violet-600 dark:text-violet-400">${product.sale_price.toFixed(2)}</span>
                             <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">${product.price.toFixed(2)}</span>
                           </>
                         ) : (
                           <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</span>
                         )}
                       </div>
                     </div>

                     {/* Add to cart button */}
                     <div className="px-4 pb-4">
                       <button
                         onClick={() => handleAddToCart(product.id)}
                         disabled={product.stock_quantity === 0}
                         className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none ${
                           product.stock_quantity === 0
                             ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                             : 'bg-violet-600 text-white hover:bg-violet-700'
                         }`}
                       >
                         {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                 </svg>
                 <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No products found</h3>
                 <p className="mt-1 text-gray-500 dark:text-gray-400">
                   Try changing your search or filter criteria.
                 </p>
                 <div className="mt-6">
                   <button
                     onClick={() => {
                       setSearchQuery('');
                       setSelectedCategory(null);
                       setSortOption('newest');
                       navigate('/shop');
                     }}
                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                   >
                     Reset Filters
                   </button>
                 </div>
               </div>
             )}

             {/* Pagination */}
             <div className="mt-8 flex justify-center">
               <nav className="flex items-center">
                 <button
                   onClick={() => handlePageChange(currentPage - 1)}
                   disabled={currentPage === 1}
                   className={`px-3 py-1 rounded-l-md border border-gray-300 dark:border-gray-600 ${
                     currentPage === 1
                       ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                       : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650'
                   }`}
                 >
                   Previous
                 </button>
                 
                 <span className="px-4 py-1 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                   Page {currentPage}
                 </span>
                 
                 <button
                   onClick={() => handlePageChange(currentPage + 1)}
                   disabled={products.length < productsPerPage}
                   className={`px-3 py-1 rounded-r-md border border-gray-300 dark:border-gray-600 ${
                     products.length < productsPerPage
                       ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                       : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650'
                   }`}
                 >
                   Next
                 </button>
               </nav>
             </div>
           </div>
         </main>

         {/* Footer */}
         <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="py-4 text-sm text-center text-gray-500 dark:text-gray-400">
               &copy; {new Date().getFullYear()} Cosmetic Formula Lab. All rights reserved.
             </div>
           </div>
         </footer>
       </div>
     </div>
   </ProtectedRoute>
 );
}

export default Shop;