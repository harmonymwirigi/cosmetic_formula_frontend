// src/utils/subscriptionUtils.js
export const mapBackendToFrontendPlan = (backendPlan) => {
    switch (backendPlan) {
      case 'premium':
        return 'creator';
      case 'professional':
        return 'pro_lab';
      case 'free':
      default:
        return 'free';
    }
  };
  
  export const mapFrontendToBackendPlan = (frontendPlan) => {
    switch (frontendPlan) {
      case 'creator':
        return 'premium';
      case 'pro_lab':
        return 'professional';
      case 'free':
      default:
        return 'free';
    }
  };