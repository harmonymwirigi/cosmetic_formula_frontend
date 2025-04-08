// src/pages/knowledge/KnowledgeHub.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../partials/Header';
import Sidebar from '../../partials/Sidebar';
import { userAPI } from '../../services/api';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import { knowledgeAPI } from '../../services/api';

function KnowledgeHub() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data and knowledge hub content
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch categories
        const categoriesResponse = await knowledgeAPI.getCategories();
        setCategories(categoriesResponse.data);
        
        // Fetch featured articles
        const featuredResponse = await knowledgeAPI.getArticles({ featured: true, limit: 3 });
        setFeaturedArticles(featuredResponse.data);
        
        // Fetch latest articles
        const latestResponse = await knowledgeAPI.getArticles({ limit: 6 });
        setLatestArticles(latestResponse.data);
        
        // Fetch popular articles
        const popularResponse = await knowledgeAPI.getArticles({ sort_by: 'view_count', limit: 5 });
        setPopularArticles(popularResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.response?.data?.detail || 'Failed to load knowledge hub content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/knowledge/search?q=${encodeURIComponent(searchQuery)}`);
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
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Knowledge Hub</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Explore our vast collection of cosmetic formulation resources, tutorials, and articles
                </p>
              </div>

              {/* Search bar */}
              <div className="mb-8">
                <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
                  <input
                    type="text"
                    className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Search articles, tutorials, and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 text-white rounded-r-md hover:bg-violet-700 focus:outline-none"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Featured articles carousel */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Featured Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredArticles.map((article) => (
                    <Link key={article.id} to={`/knowledge/articles/${article.slug}`} className="block">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
                        {article.featured_image && (
                          <div className="h-40 w-full overflow-hidden">
                            <img 
                              src={article.featured_image} 
                              alt={article.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{article.excerpt}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(article.created_at).toLocaleDateString()}
                            </span>
                            {(article.is_premium || article.is_professional) && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                article.is_professional 
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' 
                                  : 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300'
                              }`}>
                                {article.is_professional ? 'Professional' : 'Premium'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Content categories */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Browse by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Link 
                      key={category.id} 
                      to={`/knowledge/categories/${category.slug}`}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">{category.name}</h3>
                      {category.is_premium && (
                        <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300">
                          Premium
                        </span>
                      )}
                      {category.is_professional && (
                        <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                          Professional
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent articles */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Latest Articles</h2>
                  <Link to="/knowledge/articles" className="text-sm text-violet-600 dark:text-violet-400 hover:underline">
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestArticles.map((article) => (
                    <Link key={article.id} to={`/knowledge/articles/${article.slug}`} className="block">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                        <div className="p-4 flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{article.excerpt}</p>
                        </div>
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(article.created_at).toLocaleDateString()}
                          </span>
                          {(article.is_premium || article.is_professional) && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              article.is_professional 
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' 
                                : 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300'
                            }`}>
                              {article.is_professional ? 'Professional' : 'Premium'}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular content and sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Interactive tutorials */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Interactive Tutorials</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Learn at your own pace with our step-by-step interactive tutorials.
                    </p>
                    <Link 
                      to="/knowledge/tutorials" 
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                    >
                      Explore Tutorials
                    </Link>
                  </div>
                </div>

                {/* Popular articles sidebar */}
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Popular Articles</h2>
                    <ul className="space-y-4">
                      {popularArticles.map((article) => (
                        <li key={article.id}>
                          <Link 
                            to={`/knowledge/articles/${article.slug}`}
                            className="flex items-start hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded-md transition-colors"
                          >
                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mr-3">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </span>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{article.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {article.view_count} views
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link 
                      to="/knowledge/popular"
                      className="inline-block w-full text-center text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 mt-4"
                    >
                      View all popular content
                    </Link>
                  </div>
                </div>
              </div>

              {/* Subscription upsell for free users */}
              {userData?.subscription_type === 'free' && (
                <div className="mt-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0 md:mr-6">
                      <h2 className="text-xl font-bold mb-2">Unlock Premium Content</h2>
                      <p className="text-violet-100">
                        Upgrade your subscription to access premium articles, tutorials, and expert formulation techniques.
                      </p>
                    </div>
                    <Link 
                      to="/subscription" 
                      className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-violet-600 bg-white hover:bg-violet-50 focus:outline-none"
                    >
                      Upgrade Now
                    </Link>
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

export default KnowledgeHub;