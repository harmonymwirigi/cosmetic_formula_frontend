// frontend/src/components/formulas/FormulaQuestionnaire.jsx
import React, { useState, useEffect } from 'react';
import { useFormula } from '../../context/FormulaContext';
import { useNavigate } from 'react-router-dom';

const FormulaQuestionnaire = () => {
  const navigate = useNavigate();
  const { generateAIFormula, isLoading } = useFormula();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    purpose: '',
    productCategory: '',
    formulaType: [],
    primaryGoals: [],
    targetUser: {
      gender: '',
      ageGroup: '',
      skinHairType: '',
      culturalBackground: '',
      concerns: ''
    },
    mustHaveIngredients: '',
    avoidIngredients: '',
    brandVision: '',
    desiredExperience: [],
    packaging: '',
    budget: '',
    timeline: '',
    additionalNotes: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = [
    {
      title: "Purpose",
      subtitle: "Who is this product for?",
      icon: "👤"
    },
    {
      title: "Product Type", 
      subtitle: "What are you creating?",
      icon: "🧴"
    },
    {
      title: "Formula Style",
      subtitle: "What kind of formula?",
      icon: "✨"
    },
    {
      title: "Goals",
      subtitle: "What should it do?",
      icon: "🎯"
    },
    {
      title: "Target User",
      subtitle: "Who will use this?",
      icon: "🌍"
    },
    {
      title: "Ingredients",
      subtitle: "Special preferences",
      icon: "🧪"
    },
    {
      title: "Experience",
      subtitle: "Look and feel",
      icon: "✨"
    },
    {
      title: "Final Details",
      subtitle: "Budget and timeline",
      icon: "📋"
    }
  ];

  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const toggleArrayValue = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.purpose !== '';
      case 1: return formData.productCategory !== '';
      case 2: return formData.formulaType.length > 0;
      case 3: return formData.primaryGoals.length > 0;
      case 4: return formData.targetUser.gender !== '' || formData.purpose === 'personal';
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      // Transform questionnaire data for the new API endpoint
      const questionnaireRequest = {
        purpose: formData.purpose,
        product_category: formData.productCategory,
        formula_types: formData.formulaType,
        primary_goals: formData.primaryGoals,
        target_user: formData.targetUser,
        preferred_ingredients_text: formData.mustHaveIngredients,
        avoided_ingredients_text: formData.avoidIngredients,
        brand_vision: formData.brandVision,
        desired_experience: formData.desiredExperience,
        packaging_preferences: formData.packaging,
        budget: formData.budget,
        timeline: formData.timeline,
        additional_notes: formData.additionalNotes,
        generate_name: true
      };

      // Call the new questionnaire-based API endpoint
      const response = await fetch('/api/ai-formula/generate_formula_questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth setup
        },
        body: JSON.stringify(questionnaireRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate formula');
      }

      const formulaData = await response.json();
      
      if (formulaData && formulaData.id) {
        setSuccess(`Formula "${formulaData.name}" created successfully!`);
        setTimeout(() => {
          navigate(`/formulas/${formulaData.id}`);
        }, 2000);
      } else {
        setSuccess('Formula created successfully!');
        setTimeout(() => {
          navigate('/formulas');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating formula:', error);
      setError(error.message || 'Failed to create formula. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Who is this product for?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We'll tailor your experience accordingly
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'personal', label: 'Just for me / personal use', icon: '🙋‍♀️' },
                { value: 'brand', label: 'For my brand / to sell', icon: '🏢' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('purpose', option.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.purpose === option.value
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                  }`}
                >
                  <div className="text-3xl mb-3">{option.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What type of product are you creating?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'face_care', label: 'Face care', icon: '😊' },
                { value: 'hair_care', label: 'Hair care', icon: '💇‍♀️' },
                { value: 'body_care', label: 'Body care', icon: '🧴' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('productCategory', option.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                    formData.productCategory === option.value
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                  }`}
                >
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </h3>
                </button>
              ))}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Other (specify):
              </label>
              <input
                type="text"
                placeholder="Enter custom product type..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                onChange={(e) => {
                  if (e.target.value) {
                    updateFormData('productCategory', e.target.value);
                  }
                }}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What kind of formula are you dreaming of?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You can choose multiple!
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                'Serum', 'Cream', 'Oil', 'Lotion', 'Cleanser', 
                'Shampoo', 'Conditioner', 'Mask', 'Leave-in / Styling', 
                'Exfoliator', 'Toner', 'Essence'
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => toggleArrayValue('formulaType', type)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    formData.formulaType.includes(type)
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">{type}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Other (specify):
              </label>
              <input
                type="text"
                placeholder="Enter custom formula type..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    toggleArrayValue('formulaType', e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What should this product do?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Pick your top 3 priorities
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'hydrate', label: 'Hydrate', icon: '💧' },
                { value: 'nourish', label: 'Nourish', icon: '🌿' },
                { value: 'strengthen', label: 'Strengthen', icon: '💪' },
                { value: 'hair_growth', label: 'Grow hair / Prevent loss', icon: '🌱' },
                { value: 'soothe', label: 'Soothe sensitive skin', icon: '🤲' },
                { value: 'anti_acne', label: 'Anti-acne', icon: '✨' },
                { value: 'brighten', label: 'Brighten', icon: '☀️' },
                { value: 'anti_aging', label: 'Anti-aging', icon: '⏰' },
                { value: 'repair', label: 'Repair damage', icon: '🔧' },
                { value: 'balance_oil', label: 'Balance oil', icon: '⚖️' },
                { value: 'detox', label: 'Detox / Clarify', icon: '🧹' },
                { value: 'fragrance', label: 'Fragrance experience', icon: '🌸' }
              ].map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => toggleArrayValue('primaryGoals', goal.value)}
                  disabled={formData.primaryGoals.length >= 3 && !formData.primaryGoals.includes(goal.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    formData.primaryGoals.includes(goal.value)
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                      : formData.primaryGoals.length >= 3
                        ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{goal.icon}</div>
                  <span className="text-sm font-medium">{goal.label}</span>
                </button>
              ))}
            </div>
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Selected: {formData.primaryGoals.length}/3
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Who is your ideal user?
              </h2>
              {formData.purpose === 'personal' && (
                <p className="text-gray-600 dark:text-gray-400">
                  Tell us about yourself
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  value={formData.targetUser.gender}
                  onChange={(e) => updateFormData('targetUser.gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select gender</option>
                  <option value="all">All genders</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age group
                </label>
                <select
                  value={formData.targetUser.ageGroup}
                  onChange={(e) => updateFormData('targetUser.ageGroup', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select age group</option>
                  <option value="teens">Teens (13-19)</option>
                  <option value="young_adults">Young Adults (20-29)</option>
                  <option value="adults">Adults (30-49)</option>
                  <option value="mature">Mature (50+)</option>
                  <option value="all_ages">All ages</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skin/Hair type
                </label>
                <input
                  type="text"
                  value={formData.targetUser.skinHairType}
                  onChange={(e) => updateFormData('targetUser.skinHairType', e.target.value)}
                  placeholder="e.g., Oily skin, Dry curly hair, Sensitive skin"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cultural background (if relevant)
                </label>
                <input
                  type="text"
                  value={formData.targetUser.culturalBackground}
                  onChange={(e) => updateFormData('targetUser.culturalBackground', e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Concerns or lifestyle traits
              </label>
              <textarea
                value={formData.targetUser.concerns}
                onChange={(e) => updateFormData('targetUser.concerns', e.target.value)}
                rows={3}
                placeholder="e.g., Busy lifestyle, environmental concerns, budget-conscious"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ingredient Preferences
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tell us about your ingredient wishes
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🧪 Any special ingredients you want to include?
              </label>
              <textarea
                value={formData.mustHaveIngredients}
                onChange={(e) => updateFormData('mustHaveIngredients', e.target.value)}
                rows={3}
                placeholder="e.g., Rice water, Niacinamide, Rosehip oil, MSM, Hyaluronic acid..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                List any must-have extracts, oils, actives or DIY favorites
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🚫 Are there any ingredients you want to avoid?
              </label>
              <textarea
                value={formData.avoidIngredients}
                onChange={(e) => updateFormData('avoidIngredients', e.target.value)}
                rows={3}
                placeholder="e.g., No fragrance, no sulfates, no silicones, no parabens..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                For allergies, sensitivities, or clean beauty preferences
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🎯 Do you have a brand vision or name? (Optional)
              </label>
              <textarea
                value={formData.brandVision}
                onChange={(e) => updateFormData('brandVision', e.target.value)}
                rows={2}
                placeholder="Tell us about your brand concept, values, or vision..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What kind of experience do you want?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Pick as many as you like
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'silky', label: 'Silky', icon: '🪞' },
                { value: 'light_absorbing', label: 'Light & fast-absorbing', icon: '💨' },
                { value: 'rich_creamy', label: 'Rich & creamy', icon: '🥛' },
                { value: 'natural_scent', label: 'Natural scent', icon: '🌸' },
                { value: 'no_scent', label: 'No scent', icon: '🚫' },
                { value: 'glow_effect', label: 'Glow effect', icon: '✨' },
                { value: 'cooling', label: 'Cooling / soothing', icon: '❄️' },
                { value: 'energizing', label: 'Energizing', icon: '⚡' }
              ].map((experience) => (
                <button
                  key={experience.value}
                  onClick={() => toggleArrayValue('desiredExperience', experience.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    formData.desiredExperience.includes(experience.value)
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{experience.icon}</div>
                  <span className="text-sm font-medium">{experience.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Final Details
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Just a few more details to perfect your formula
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📦 Do you already have packaging in mind?
              </label>
              <div className="space-y-2">
                {[
                  'Yes – I already picked something',
                  'I\'d love recommendations', 
                  'Not yet, just want a formula first'
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateFormData('packaging', option)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.packaging === option
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                💸 What's your budget or ideal price range? (Optional)
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => updateFormData('budget', e.target.value)}
                placeholder="e.g., $50 per batch, $15 per unit"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ⏱ When would you like to have your formula ready?
              </label>
              <div className="space-y-2">
                {[
                  'Urgently – within 7 days',
                  'Within 2–3 weeks',
                  'No rush – just exploring'
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateFormData('timeline', option)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.timeline === option
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                💬 Anything else you want to tell us?
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                rows={4}
                placeholder="Free space for your vision, concerns or inspiration..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🌿 BeautyCraft Product Creation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your AI-Powered Companion to Crafting the Perfect Skincare or Haircare Product
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  index < currentStep
                    ? 'bg-violet-500 text-white'
                    : index === currentStep
                      ? 'bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 border-2 border-violet-500'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : step.icon}
                </div>
                <div className="hidden md:block mt-2 text-xs text-center">
                  <div className={`font-medium ${
                    index === currentStep ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 text-xs">
                    {step.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress line */}
          <div className="relative">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded-full"></div>
            <div 
              className="absolute top-0 left-0 h-1 bg-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}

            {/* Step Content */}
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 0
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              ← Previous
            </button>

            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{currentStep + 1}</span>
              <span>of</span>
              <span>{steps.length}</span>
            </div>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="px-8 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Your Formula...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Create My Formula</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isStepValid()
                    ? 'bg-violet-500 hover:bg-violet-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>✨ Powered by AI • Crafted with love • Made for you</p>
        </div>
      </div>
    </div>
  );
};

export default FormulaQuestionnaire;