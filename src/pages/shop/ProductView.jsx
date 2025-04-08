import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../partials/Header';
import Sidebar from '../../partials/Sidebar';
import { userAPI, shopAPI } from '../../services/api';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

function ProductView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch product details
        const productResponse = await shopAPI.getProduct(slug);
        setProduct(productResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.response?.data?.detail || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      await shopAPI.addToCart({
        product_id: product.id,
        quantity: quantity
      });
      
      // Redirect to cart or show success message
      navigate('/shop/cart');
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md">
          <div className="flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-center text-gray-900 dark:text-gray-100 mb-2">Error Loading Product</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/shop')} 
              className="btn bg-violet-600 hover:bg-violet-700 text-white"
            >
              Return to Shop
            </button>
          </div>
        </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div>
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-96 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                      <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{product.name}</h1>
                  
                  {/* Price */}
                  <div className="flex items-center mb-4">
                    {product.sale_price ? (
                      <>
                        <span className="text-2xl font-bold text-violet-600 dark:text-violet-400 mr-4">${product.sale_price.toFixed(2)}</span>
                        <span className="text-lg text-gray-500 dark:text-gray-400 line-through">${product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Short Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {product.short_description || product.description}
                  </p>

                  {/* Stock & Quantity */}
                  <div className="mb-6">
                    <p className="text-sm mb-2">
                      Stock: 
                      <span className={`ml-2 ${
                        product.stock_quantity > 10 
                          ? 'text-green-600 dark:text-green-400' 
                          : product.stock_quantity > 0 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-red-600 dark:text-red-400'
                      }`}>
                        {product.stock_quantity} available
                      </span>
                    </p>

                    {product.stock_quantity > 0 && (
                      <div className="flex items-center">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-l"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={product.stock_quantity}
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setQuantity(
                              isNaN(val) 
                                ? 1 
                                : Math.min(product.stock_quantity, Math.max(1, val))
                            );
                          }}
                          className="w-16 text-center border-t border-b border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                        />
                        <button
                          onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className={`w-full py-3 rounded-md text-white font-semibold ${
                      product.stock_quantity === 0
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-violet-600 hover:bg-violet-700'
                    }`}
                  >
                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>

              {/* Full Description */}
              {product.description && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Product Description</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    {product.description}
                  </div>
                </div>
              )}
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

export default ProductView;