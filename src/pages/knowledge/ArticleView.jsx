// src/pages/knowledge/ArticleView.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Header from '../../partials/Header';
import Sidebar from '../../partials/Sidebar';
import { userAPI, knowledgeAPI } from '../../services/api';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

function ArticleView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  // Fetch user data and article
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch article details
        const articleResponse = await knowledgeAPI.getArticle(slug);
        setArticle(articleResponse.data);
        
        // Fetch related articles
        const relatedResponse = await knowledgeAPI.getArticles({
          category_id: articleResponse.data.category_id,
          exclude_id: articleResponse.data.id,
          limit: 3
        });
        setRelatedArticles(relatedResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.response?.data?.detail || 'Failed to load article');
        
        // Show subscribe modal if access denied due to subscription level
        if (error.response?.status === 403) {
          setShowSubscribeModal(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error && !showSubscribeModal) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md">
          <div className="flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-center text-gray-900 dark:text-gray-100 mb-2">Error Loading Article</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <Link to="/knowledge" className="btn bg-violet-600 hover:bg-violet-700 text-white">
              Return to Knowledge Hub
            </Link>
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
            {showSubscribeModal ? (
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Premium Content
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                        This article is available exclusively to {article?.is_professional ? 'Professional' : 'Premium'} subscribers. Upgrade your subscription to unlock this and hundreds of other premium resources.
                      </p>
                      <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                        <Link 
                          to="/subscription" 
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                        >
                          Upgrade Subscription
                        </Link>
                        <button
                          onClick={() => navigate('/knowledge')}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
                        >
                          Return to Knowledge Hub
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : article && (
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
                {/* Article navigation */}
                <div className="mb-6">
                  <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Link to="/knowledge" className="hover:text-gray-900 dark:hover:text-gray-200">
                      Knowledge Hub
                    </Link>
                    <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <Link 
                      to={`/knowledge/categories/${article.category?.slug || article.category_id}`} 
                      className="hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      {article.category?.name || 'Category'}
                    </Link>
                    <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-900 dark:text-gray-200">{article.title}</span>
                  </nav>
                </div>

                {/* Article main content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                      {/* Article header */}
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                          {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="mr-4">
                            {new Date(article.created_at).toLocaleDateString()}
                          </span>
                          <span className="mr-4">
                            {article.view_count} views
                          </span>
                          {article.author && (
                            <span>By {article.author.first_name} {article.author.last_name}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag, index) => (
                            <Link 
                              key={index}
                              to={`/knowledge/tags/${tag}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650"
                            >
                              {tag}
                            </Link>
                          ))}
                          {article.is_premium && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300">
                              Premium
                            </span>
                          )}
                          {article.is_professional && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                              Professional
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Featured image */}
                      {article.featured_image && (
                        <div className="w-full h-64 md:h-96 overflow-hidden">
                          <img 
                            src={article.featured_image} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Article content */}
                      <div className="p-6">
                        <div className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown>
                            {article.content}
                          </ReactMarkdown>
                        </div>
                      </div>

                      {/* Article resources */}
                      {article.resources && article.resources.length > 0 && (
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Additional Resources
                          </h3>
                          <div className="space-y-4">
                            {article.resources.map((resource) => (
                              <div 
                                key={resource.id}
                                className="flex items-start p-3 bg-gray-50 dark:bg-gray-750 rounded-lg"
                              >
                                <div className="flex-shrink-0 mr-3">
                                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                                    {resource.resource_type === 'video' ? (
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    ) : resource.resource_type === 'pdf' ? (
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                      </svg>
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                                    {resource.title}
                                  </h4>
                                  {resource.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {resource.description}
                                    </p>
                                  )}
                                  <a 
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 text-sm text-violet-600 dark:text-violet-400 hover:underline"
                                  >
                                    {resource.resource_type === 'video' ? 'Watch Video' : 
                                     resource.resource_type === 'pdf' ? 'Download PDF' : 'Visit Resource'}
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comments section */}
                      {article.comments && (
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Comments ({article.comments.length})
                          </h3>
                          {/* Comment form */}
                          <div className="mb-6">
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              rows="3"
                              placeholder="Share your thoughts..."
                            ></textarea>
                            <button
                              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                            >
                              Post Comment
                            </button>
                          </div>
                          {/* Comments list */}
                          <div className="space-y-4">
                            {article.comments.map((comment) => (
                              <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {comment.user.first_name} {comment.user.last_name}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(comment.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {comment.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                    {/* Related articles */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Related Articles
                      </h3>
                      {relatedArticles.length > 0 ? (
                        <div className="space-y-4">
                          {relatedArticles.map((relatedArticle) => (
                            <Link
                              key={relatedArticle.id}
                              to={`/knowledge/articles/${relatedArticle.slug}`}
                              className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md transition-colors"
                            >
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                {relatedArticle.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(relatedArticle.created_at).toLocaleDateString()}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No related articles found
                        </p>
                      )}
                    </div>

                    {/* Category listing */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Categories
                      </h3>
                      <ul className="space-y-2">
                        {/* This would be populated from the categories list */}
                        <li>
                          <Link 
                            to="/knowledge/categories/beginner-formulation"
                            className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md transition-colors text-sm text-gray-700 dark:text-gray-300"
                          >
                            Beginner Formulation
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/knowledge/categories/intermediate-techniques"
                            className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md transition-colors text-sm text-gray-700 dark:text-gray-300"
                          >
                            Intermediate Techniques
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/knowledge/categories/advanced-formulation"
                            className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md transition-colors text-sm text-gray-700 dark:text-gray-300"
                          >
                            Advanced Formulation
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/knowledge/categories/ingredient-deep-dives"
                            className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md transition-colors text-sm text-gray-700 dark:text-gray-300"
                          >
                            Ingredient Deep Dives
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default ArticleView;