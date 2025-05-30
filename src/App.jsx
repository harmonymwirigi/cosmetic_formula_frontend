// frontend/src/App.jsx
import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';
import Homepage from './pages/Homepage'; // Add this import
import FormulaCreation from './pages/FormulaCreation';
import Formulas from './pages/Formulas';
import FormulaDetail from './pages/FormulaDetail';
import Ingredients from './pages/Ingredients';
import Subscription from './pages/Subscription';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { FormulaProvider } from './context/FormulaContext';
import { NotificationProvider } from './context/NotificationContext';
import UserProfileForm  from './components/Profile/UserProfileForm';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Fintech from './pages/Fintech';
import PhoneVerification from './pages/PhoneVerification';
import Customers from './pages/ecommerce/Customers';
//mport Orders from './pages/ecommerce/Orders';
import Invoices from './pages/ecommerce/Invoices';
import { UserProfileProvider } from './context/UserProfileContext';
//import Shop from './pages/ecommerce/Shop';
import Shop2 from './pages/ecommerce/Shop2';
import Product from './pages/ecommerce/Product';
import Cart from './pages/ecommerce/Cart';
import Cart2 from './pages/ecommerce/Cart2';
import Cart3 from './pages/ecommerce/Cart3';
import Pay from './pages/ecommerce/Pay';
import Campaigns from './pages/Campaigns';
import UsersTabs from './pages/community/UsersTabs';
import UsersTiles from './pages/community/UsersTiles';
import Profile from './pages/community/Profile';
import Feed from './pages/community/Feed';
import Forum from './pages/community/Forum';
import ForumPost from './pages/community/ForumPost';
import Meetups from './pages/community/Meetups';
import MeetupsPost from './pages/community/MeetupsPost';
import CreditCards from './pages/finance/CreditCards';
import Transactions from './pages/finance/Transactions';
import TransactionDetails from './pages/finance/TransactionDetails';
import JobListing from './pages/job/JobListing';
import JobPost from './pages/job/JobPost';
import CompanyProfile from './pages/job/CompanyProfile';
import Messages from './pages/Messages';
import TasksKanban from './pages/tasks/TasksKanban';
import TasksList from './pages/tasks/TasksList';
import Inbox from './pages/Inbox';
import Calendar from './pages/Calendar';
import Account from './pages/settings/Account';
import Addresses from './pages/settings/Addresses';
import Notifications from './pages/settings/Notifications';
import { ToastProvider } from './components/Notifications/ToastContainer';
import NotificationsPage from './pages/NotificationsPage';
import NotificationPreferencesPage from './pages/settings/NotificationPreferencesPage';
import Apps from './pages/settings/Apps';
import Plans from './pages/settings/Plans';
import SubscriptionRedirect from './components/subscription/SubscriptionRedirect';
import FormulaUsageCard from './components/Dashboard/FormulaUsageCard';
import FormulaQuotaStatus from './components/Dashboard/FormulaQuotaStatus';
import Billing from './pages/settings/Billing';
import Feedback from './pages/settings/Feedback';
import Changelog from './pages/utility/Changelog';
import Roadmap from './pages/utility/Roadmap';
import Faqs from './pages/utility/Faqs';
import EmptyState from './pages/utility/EmptyState';
import PageNotFound from './pages/utility/PageNotFound';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Onboarding01 from './pages/Onboarding01';
import Onboarding02 from './pages/Onboarding02';
import Onboarding03 from './pages/Onboarding03';
import Onboarding04 from './pages/Onboarding04';
import ButtonPage from './pages/component/ButtonPage';
import FormPage from './pages/component/FormPage';
import DropdownPage from './pages/component/DropdownPage';
import AlertPage from './pages/component/AlertPage';
import ModalPage from './pages/component/ModalPage';
import PaginationPage from './pages/component/PaginationPage';
import TabsPage from './pages/component/TabsPage';
import BreadcrumbPage from './pages/component/BreadcrumbPage';
import BadgePage from './pages/component/BadgePage';
import AvatarPage from './pages/component/AvatarPage';
import TooltipPage from './pages/component/TooltipPage';
import AccordionPage from './pages/component/AccordionPage';
import IconsPage from './pages/component/IconsPage';
import OAuthCallback from './pages/Auth/OAuthCallback';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
// Import Knowledge Hub pages
import KnowledgeHub from './pages/knowledge/KnowledgeHub';
import ArticleView from './pages/knowledge/ArticleView';
import TutorialView from './pages/knowledge/TutorialView';
import CategoryView from './pages/knowledge/CategoryView';

// Import Shop pages
import Shop from './pages/shop/Shop';
import ShoppingCart from './pages/shop/ShoppingCart';
import ProductView from './pages/shop/ProductView';
import Orders from './pages/shop/Orders';
import OrderDetail from './pages/shop/OrderDetail';
import OrderConfirmation from './pages/shop/OrderConfirmation'
import TermsAndConditions from './pages/TermsAndConditions';
function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
    <ToastProvider>
      <NotificationProvider>
      <UserProfileProvider>
      <Routes>
        {/* Homepage Route - Changed from Dashboard to Homepage */}
        <Route exact path="/" element={<Homepage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        {/* Dashboard Route - Now separate from homepage */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
  <ProtectedRoute>
    <NotificationsPage />
  </ProtectedRoute>
} />
<Route path="/settings/notifications" element={
  <ProtectedRoute>
    <NotificationPreferencesPage />
  </ProtectedRoute>
} />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/fintech" element={
          <ProtectedRoute>
            <Fintech />
          </ProtectedRoute>
        } />
        <Route path="/ecommerce/customers" element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        } />
        {/* <Route path="/ecommerce/orders" element={<Orders />} /> */}
        <Route path="/ecommerce/invoices" element={
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        } />
        <Route path="/ecommerce/shop" element={<Shop />} />
        <Route path="/ecommerce/shop-2" element={<Shop2 />} />
        <Route path="/ecommerce/product" element={<Product />} />
        <Route path="/ecommerce/cart" element={<Cart />} />
        <Route path="/ecommerce/cart-2" element={<Cart2 />} />
        <Route path="/ecommerce/cart-3" element={<Cart3 />} />
        <Route path="/ecommerce/pay" element={<Pay />} />
        <Route path="/verify-phone" element={
          <ProtectedRoute>
            <PhoneVerification />
          </ProtectedRoute>
        } />
        <Route path="/campaigns" element={
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        } />
        <Route path="/community/users-tabs" element={
          <ProtectedRoute>
            <UsersTabs />
          </ProtectedRoute>
        } />
        <Route path="/community/users-tiles" element={
          <ProtectedRoute>
            <UsersTiles />
          </ProtectedRoute>
        } />
        <Route path="/community/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/community/feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />
        <Route path="/community/forum" element={
          <ProtectedRoute>
            <Forum />
          </ProtectedRoute>
        } />
        <Route path="/community/forum-post" element={
          <ProtectedRoute>
            <ForumPost />
          </ProtectedRoute>
        } />
        <Route path="/community/meetups" element={
          <ProtectedRoute>
            <Meetups />
          </ProtectedRoute>
        } />
        <Route path="/community/meetups-post" element={
          <ProtectedRoute>
            <MeetupsPost />
          </ProtectedRoute>
        } />
        <Route path="/finance/cards" element={
          <ProtectedRoute>
            <CreditCards />
          </ProtectedRoute>
        } />
        <Route path="/finance/transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />
        <Route path="/finance/transaction-details" element={
          <ProtectedRoute>
            <TransactionDetails />
          </ProtectedRoute>
        } />
        <Route path="/job/job-listing" element={
          <ProtectedRoute>
            <JobListing />
          </ProtectedRoute>
        } />
        <Route path="/job/job-post" element={
          <ProtectedRoute>
            <JobPost />
          </ProtectedRoute>
        } />
        <Route path="/job/company-profile" element={
          <ProtectedRoute>
            <CompanyProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <UserProfileForm />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/tasks/kanban" element={
          <ProtectedRoute>
            <TasksKanban />
          </ProtectedRoute>
        } />
        <Route path="/tasks/list" element={
          <ProtectedRoute>
            <TasksList />
          </ProtectedRoute>
        } />
        <Route path="/inbox" element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } />
        <Route path="/settings/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/settings/addresses" element={
          <ProtectedRoute>
            <Addresses />
          </ProtectedRoute>
        } />
        <Route path="/settings/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        <Route path="/settings/notifications" element={
          <ProtectedRoute>
            <NotificationPreferencesPage />
          </ProtectedRoute>
        } />
        <Route path="/settings/apps" element={
          <ProtectedRoute>
            <Apps />
          </ProtectedRoute>
        } />
        <Route path="/subscription" element={<SubscriptionRedirect />} />
        <Route path="/settings/plans" element={
          <ProtectedRoute>
            <Plans />
          </ProtectedRoute>
        } />
        <Route path="/settings/billing" element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />
        <Route path="/settings/feedback" element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        } />
        <Route path="/utility/changelog" element={<Changelog />} />
        <Route path="/utility/roadmap" element={<Roadmap />} />
        <Route path="/utility/faqs" element={<Faqs />} />
        <Route path="/utility/empty-state" element={<EmptyState />} />
        <Route path="/utility/404" element={<PageNotFound />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding-01" element={<Onboarding01 />} />
        <Route path="/onboarding-02" element={<Onboarding02 />} />
        <Route path="/onboarding-03" element={<Onboarding03 />} />
        <Route path="/onboarding-04" element={<Onboarding04 />} />
        <Route path="/component/button" element={<ButtonPage />} />
        <Route path="/component/form" element={<FormPage />} />
        <Route path="/component/dropdown" element={<DropdownPage />} />
        <Route path="/component/alert" element={<AlertPage />} />
        <Route path="/component/modal" element={<ModalPage />} />
        <Route path="/component/pagination" element={<PaginationPage />} />
        <Route path="/component/tabs" element={<TabsPage />} />
        <Route path="/component/breadcrumb" element={<BreadcrumbPage />} />
        <Route path="/component/badge" element={<BadgePage />} />
        <Route path="/component/avatar" element={<AvatarPage />} />
        <Route path="/component/tooltip" element={<TooltipPage />} />
        <Route path="/component/accordion" element={<AccordionPage />} />
        <Route path="/component/icons" element={<IconsPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
        {/* Knowledge Hub Routes */}
        <Route path="/knowledge" element={<KnowledgeHub />} />
        <Route path="/knowledge/articles/:slug" element={<ArticleView />} />
        <Route path="/knowledge/tutorials/:id" element={<TutorialView />} />
        <Route path="/knowledge/categories/:slug" element={<CategoryView />} />
        <Route path="/knowledge/search" element={<KnowledgeHub />} />

        {/* Shop Routes */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/products/:slug" element={<ProductView />} />
        <Route path="/shop/cart" element={<ShoppingCart />} />
        <Route path="/shop/orders/:orderId" element={<OrderDetail />} />
        <Route path="/shop/orders/:orderId/confirmation" element={<OrderConfirmation />} />
        <Route path="/shop/orders" element={<Orders />} />
        
        {/* Cosmetic Formula Lab Routes */}
        <Route path="/formulas/create" element={
          <ProtectedRoute>
            <FormulaProvider>
              <FormulaCreation />
            </FormulaProvider>
          </ProtectedRoute>
        } />
        <Route path="/formulas" element={
          <ProtectedRoute>
            <Formulas />
          </ProtectedRoute>
        } />
        <Route path="/formulas/:id" element={
          <ProtectedRoute>
            <FormulaProvider>
              <FormulaDetail />
            </FormulaProvider>
          </ProtectedRoute>
        } />
        <Route path="/ingredients" element={
          <ProtectedRoute>
            <Ingredients />
          </ProtectedRoute>
        } />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </UserProfileProvider>
      </NotificationProvider>
    </ToastProvider>
    </>
  );
}

export default App;