import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PhoneVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // 1 for number input, 2 for code verification
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/auth/request-phone-verification`,
        { phone_number: phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/auth/verify-phone`,
        { phone_number: phoneNumber, code: verificationCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Redirect based on subscription status
      if (user?.needs_subscription) {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Verify Your Phone Number' : 'Enter Verification Code'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 
              ? 'We need to verify your phone number to complete your registration' 
              : 'We sent a code to your phone. Please enter it below.'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleRequestCode}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="phone-number" className="sr-only">Phone Number</label>
                <input
                  id="phone-number"
                  name="phone"
                  type="tel"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone Number (e.g. +1234567890)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="verification-code" className="sr-only">Verification Code</label>
                <input
                  id="verification-code"
                  name="code"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="6-digit verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Change phone number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;