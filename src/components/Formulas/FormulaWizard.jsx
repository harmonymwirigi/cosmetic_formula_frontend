// frontend/src/components/Formulas/FormulaWizard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useFormula } from '../../context/FormulaContext';
import { useNavigate } from 'react-router-dom';
import { aiFormulaAPI } from '../../services/api';

/**
 * FormulaWizard component - Updated with pet care and simplified ingredients step
 */
const FormulaWizard = () => {
  const navigate = useNavigate();
  const { isLoading } = useFormula();
  
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
    additionalInformation: '', // Simplified from multiple ingredient fields
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
  const [generatedFormulaId, setGeneratedFormulaId] = useState(null);

  // Updated to 4 steps only
  const steps = [
    {
      title: "Product Type",
      subtitle: "What are you creating?",
      icon: "🧴"
    },
    {
      title: "Goals", 
      subtitle: "What should it do?",
      icon: "🎯"
    },
    {
      title: "Experience",
      subtitle: "Look and feel",
      icon: "✨"
    },
    {
      title: "Final Details",
      subtitle: "Additional info",
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
      case 0: return formData.productCategory !== '' && formData.formulaType.length > 0;
      case 1: return formData.primaryGoals.length > 0;
      case 2: return formData.desiredExperience.length > 0;
      case 3: return formData.purpose !== '';
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
    setGeneratedFormulaId(null);

    try {
      const questionnaireRequest = {
        purpose: formData.purpose,
        product_category: formData.productCategory,
        formula_types: formData.formulaType.length > 0 ? formData.formulaType : ['Serum'],
        primary_goals: formData.primaryGoals,
        target_user: formData.targetUser,
        additional_information: formData.additionalInformation, // Simplified field
        brand_vision: formData.brandVision,
        desired_experience: formData.desiredExperience,
        packaging_preferences: formData.packaging,
        budget: formData.budget,
        timeline: formData.timeline,
        additional_notes: formData.additionalNotes,
        generate_name: true
      };

      console.log('Submitting questionnaire data:', questionnaireRequest);

      const response = await aiFormulaAPI.generateFormulaFromQuestionnaire(questionnaireRequest);
      
      if (response && response.data && response.data.id) {
        setGeneratedFormulaId(response.data.id);
        setSuccess(`Formula "${response.data.name}" created successfully!`);
      } else {
        setSuccess('Formula created successfully!');
      }
    } catch (error) {
      console.error('Error creating formula:', error);
      
      let errorMessage = 'Failed to create formula. Please try again.';
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        if (error.response.data && error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail
              .map(err => err.msg || JSON.stringify(err))
              .join(', ');
          } else {
            errorMessage = error.response.data.detail;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewFormulaDetails = () => {
    if (generatedFormulaId) {
      navigate(`/formulas/${generatedFormulaId}`);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What are you creating?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                First choose your category, then select the specific product type
              </p>
            </div>
            
            {/* Step 1: Category Selection */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                Choose Product Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { value: 'face_care', label: 'Face Care', icon: '😊', desc: 'Serums, creams, cleansers' },
                  { value: 'hair_care', label: 'Hair Care', icon: '💇‍♀️', desc: 'Shampoos, conditioners, treatments' },
                  { value: 'body_care', label: 'Body Care', icon: '🧴', desc: 'Lotions, oils, scrubs' },
                  { value: 'pet_care', label: 'Pet Care', icon: '🐕', desc: 'Pet shampoos, balms, sprays' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      updateFormData('productCategory', option.value);
                      // Reset formula type when category changes
                      setFormData(prev => ({ ...prev, formulaType: [] }));
                    }}
                    className={`p-8 rounded-2xl border-2 transition-all duration-200 text-center hover:shadow-lg ${
                      formData.productCategory === option.value
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}
                  >
                    <div className="text-5xl mb-4">{option.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {option.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Specific Product Type Selection */}
            {formData.productCategory && (
              <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                  Choose Specific Product Type
                </h3>
                
                {/* Face Care Products */}
                {formData.productCategory === 'face_care' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: 'serum', label: 'Serum', icon: '💧', desc: 'Concentrated treatment' },
                      { value: 'cream', label: 'Cream', icon: '🥛', desc: 'Rich hydration' },
                      { value: 'cleanser', label: 'Cleanser', icon: '🧼', desc: 'Face wash' },
                      { value: 'toner', label: 'Toner', icon: '✨', desc: 'Balancing mist' },
                      { value: 'face_mask', label: 'Face Mask', icon: '🎭', desc: 'Weekly treatment' },
                      { value: 'face_oil', label: 'Face Oil', icon: '🌿', desc: 'Nourishing oil' },
                      { value: 'eye_cream', label: 'Eye Cream', icon: '👁️', desc: 'Delicate care' },
                      { value: 'exfoliant', label: 'Exfoliant', icon: '✨', desc: 'Skin renewal' },
                      { value: 'essence', label: 'Essence', icon: '🌟', desc: 'Light treatment' },
                      { value: 'spf_moisturizer', label: 'SPF Moisturizer', icon: '☀️', desc: 'UV protection' },
                      { value: 'spot_treatment', label: 'Spot Treatment', icon: '🎯', desc: 'Targeted care' },
                      { value: 'makeup_remover', label: 'Makeup Remover', icon: '🧽', desc: 'Gentle cleansing' },
                      { value: 'facial_mist', label: 'Facial Mist', icon: '💨', desc: 'Refreshing spray' }
                    ].map((product) => (
                      <button
                        key={product.value}
                        onClick={() => toggleArrayValue('formulaType', product.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center relative ${
                          formData.formulaType.includes(product.value)
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:shadow-md'
                        }`}
                      >
                        <div className="text-2xl mb-2">{product.icon}</div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {product.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {product.desc}
                        </div>
                        {formData.formulaType.includes(product.value) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Hair Care Products */}
                {formData.productCategory === 'hair_care' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: 'shampoo', label: 'Shampoo', icon: '🧴', desc: 'Cleansing base' },
                      { value: 'conditioner', label: 'Conditioner', icon: '💆‍♀️', desc: 'Daily care' },
                      { value: 'hair_oil', label: 'Hair Oil', icon: '🌿', desc: 'Nourishing treatment' },
                      { value: 'hair_mask', label: 'Hair Mask', icon: '🎭', desc: 'Deep treatment' },
                      { value: 'leave_in_conditioner', label: 'Leave-in Conditioner', icon: '✨', desc: 'Daily protection' },
                      { value: 'scalp_scrub', label: 'Scalp Scrub', icon: '🌱', desc: 'Scalp exfoliation' },
                      { value: 'dry_shampoo', label: 'Dry Shampoo', icon: '💨', desc: 'Refresh & volume' },
                      { value: 'hair_serum', label: 'Hair Serum', icon: '💧', desc: 'Concentrated care' },
                      { value: 'hair_gel', label: 'Hair Gel', icon: '💪', desc: 'Strong hold' },
                      { value: 'styling_cream', label: 'Styling Cream', icon: '💇‍♂️', desc: 'Hold & style' },
                      { value: 'heat_protectant', label: 'Heat Protectant', icon: '🔥', desc: 'Thermal protection' },
                      { value: 'scalp_tonic', label: 'Scalp Tonic', icon: '🌿', desc: 'Scalp health' }
                    ].map((product) => (
                      <button
                        key={product.value}
                        onClick={() => toggleArrayValue('formulaType', product.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center relative ${
                          formData.formulaType.includes(product.value)
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:shadow-md'
                        }`}
                      >
                        <div className="text-2xl mb-2">{product.icon}</div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {product.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {product.desc}
                        </div>
                        {formData.formulaType.includes(product.value) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Body Care Products */}
                {formData.productCategory === 'body_care' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: 'body_lotion', label: 'Body Lotion', icon: '🧴', desc: 'Daily moisture' },
                      { value: 'body_butter', label: 'Body Butter', icon: '🥛', desc: 'Rich hydration' },
                      { value: 'body_scrub', label: 'Body Scrub', icon: '✨', desc: 'Exfoliation' },
                      { value: 'shower_gel', label: 'Shower Gel', icon: '🧼', desc: 'Gentle cleansing' },
                      { value: 'bar_soap', label: 'Bar Soap', icon: '🧼', desc: 'Solid cleansing' },
                      { value: 'body_oil', label: 'Body Oil', icon: '🌿', desc: 'Nourishing oil' },
                      { value: 'hand_cream', label: 'Hand Cream', icon: '🤲', desc: 'Hand care' },
                      { value: 'foot_cream', label: 'Foot Cream', icon: '🦶', desc: 'Foot care' },
                      { value: 'deodorant', label: 'Deodorant', icon: '🌸', desc: 'Fresh protection' },
                      { value: 'body_mist', label: 'Body Mist', icon: '💨', desc: 'Light fragrance' },
                      { value: 'stretch_mark_cream', label: 'Stretch Mark Cream', icon: '🤰', desc: 'Skin elasticity' },
                      { value: 'bust_firming_cream', label: 'Bust Firming Cream', icon: '💪', desc: 'Firming care' }
                    ].map((product) => (
                      <button
                        key={product.value}
                        onClick={() => toggleArrayValue('formulaType', product.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center relative ${
                          formData.formulaType.includes(product.value)
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:shadow-md'
                        }`}
                      >
                        <div className="text-2xl mb-2">{product.icon}</div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {product.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {product.desc}
                        </div>
                        {formData.formulaType.includes(product.value) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Pet Care Products */}
                {formData.productCategory === 'pet_care' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: 'pet_shampoo', label: 'Pet Shampoo', icon: '🐕', desc: 'Gentle cleaning' },
                      { value: 'pet_conditioner', label: 'Pet Conditioner', icon: '🐱', desc: 'Coat conditioning' },
                      { value: 'pet_balm', label: 'Pet Balm', icon: '🐾', desc: 'Healing balm' },
                      { value: 'pet_cologne', label: 'Pet Cologne', icon: '🌸', desc: 'Fresh scent' },
                      { value: 'ear_cleaner', label: 'Ear Cleaner', icon: '👂', desc: 'Ear hygiene' },
                      { value: 'paw_wax', label: 'Paw Wax', icon: '🐾', desc: 'Paw protection' },
                      { value: 'anti_itch_spray', label: 'Anti-Itch Spray', icon: '💨', desc: 'Itch relief' },
                      { value: 'flea_tick_spray', label: 'Flea & Tick Spray', icon: '🚫', desc: 'Pest control' },
                      { value: 'pet_wipes', label: 'Pet Wipes', icon: '🧽', desc: 'Quick cleaning' }
                    ].map((product) => (
                      <button
                        key={product.value}
                        onClick={() => toggleArrayValue('formulaType', product.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center relative ${
                          formData.formulaType.includes(product.value)
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:shadow-md'
                        }`}
                      >
                        <div className="text-2xl mb-2">{product.icon}</div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {product.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {product.desc}
                        </div>
                        {formData.formulaType.includes(product.value) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {formData.formulaType.length > 0 && (
                  <div className="text-center">
                    <span className="text-sm text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-4 py-2 rounded-full">
                      Selected: {formData.formulaType.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What's your main goal?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Select up to 3 priorities for your formula
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                // Face Care Goals
                ...(formData.productCategory === 'face_care' ? [
                  { value: 'hydrate', label: 'Hydrate', icon: '💧', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                  { value: 'anti_aging', label: 'Anti-Aging', icon: '⏰', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                  { value: 'anti_acne', label: 'Anti-Acne', icon: '✨', color: 'bg-green-100 text-green-800 border-green-200' },
                  { value: 'soothe', label: 'Soothe', icon: '🤲', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                  { value: 'brighten', label: 'Brighten', icon: '☀️', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  { value: 'exfoliate', label: 'Exfoliate', icon: '✨', color: 'bg-orange-100 text-orange-800 border-orange-200' }
                ] : []),
                // Hair Care Goals
                ...(formData.productCategory === 'hair_care' ? [
                  { value: 'nourish', label: 'Nourish', icon: '🌿', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                  { value: 'strengthen', label: 'Strengthen', icon: '💪', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                  { value: 'hair_growth', label: 'Hair Growth', icon: '🌱', color: 'bg-teal-100 text-teal-800 border-teal-200' },
                  { value: 'repair', label: 'Repair', icon: '🔧', color: 'bg-red-100 text-red-800 border-red-200' },
                  { value: 'volume', label: 'Add Volume', icon: '📈', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                  { value: 'moisture', label: 'Moisturize', icon: '💧', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' }
                ] : []),
                // Body Care Goals
                ...(formData.productCategory === 'body_care' ? [
                  { value: 'moisturize', label: 'Moisturize', icon: '💧', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                  { value: 'exfoliate', label: 'Exfoliate', icon: '✨', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                  { value: 'firm', label: 'Firm', icon: '💪', color: 'bg-green-100 text-green-800 border-green-200' },
                  { value: 'soothe', label: 'Soothe', icon: '🤲', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                  { value: 'protect', label: 'Protect', icon: '🛡️', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  { value: 'cleanse', label: 'Cleanse', icon: '🧼', color: 'bg-teal-100 text-teal-800 border-teal-200' }
                ] : []),
                // Pet Care Goals
                ...(formData.productCategory === 'pet_care' ? [
                  { value: 'clean', label: 'Clean', icon: '🧼', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                  { value: 'soothe_skin', label: 'Soothe Skin', icon: '🤲', color: 'bg-green-100 text-green-800 border-green-200' },
                  { value: 'odor_control', label: 'Odor Control', icon: '🌸', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                  { value: 'coat_shine', label: 'Coat Shine', icon: '✨', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  { value: 'anti_itch', label: 'Anti-Itch', icon: '🚫', color: 'bg-red-100 text-red-800 border-red-200' },
                  { value: 'pest_control', label: 'Pest Control', icon: '🛡️', color: 'bg-orange-100 text-orange-800 border-orange-200' }
                ] : [])
              ].map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => toggleArrayValue('primaryGoals', goal.value)}
                  disabled={formData.primaryGoals.length >= 3 && !formData.primaryGoals.includes(goal.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-center relative ${
                    formData.primaryGoals.includes(goal.value)
                      ? `border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg`
                      : formData.primaryGoals.length >= 3
                        ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-3">{goal.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.primaryGoals.includes(goal.value) ? 'bg-violet-100 text-violet-800' : goal.color
                  }`}>
                    {goal.label}
                  </span>
                  {formData.primaryGoals.includes(goal.value) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                Selected: {formData.primaryGoals.length}/3
              </span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Desired Experience
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                How should your product feel and perform?
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'light_absorbing', label: 'Light & Fast', icon: '💨', desc: 'Quick absorption' },
                { value: 'rich_creamy', label: 'Rich & Creamy', icon: '🥛', desc: 'Luxurious texture' },
                { value: 'silky', label: 'Silky Smooth', icon: '🪞', desc: 'Silk-like feel' },
                { value: 'glow_effect', label: 'Glowing', icon: '✨', desc: 'Radiant finish' },
                { value: 'cooling', label: 'Cooling', icon: '❄️', desc: 'Refreshing feel' },
                { value: 'energizing', label: 'Energizing', icon: '⚡', desc: 'Invigorating' },
                { value: 'natural_scent', label: 'Natural Scent', icon: '🌸', desc: 'Light fragrance' },
                { value: 'no_scent', label: 'Fragrance-Free', icon: '🚫', desc: 'No added scent' }
              ].map((experience) => (
                <button
                  key={experience.value}
                  onClick={() => toggleArrayValue('desiredExperience', experience.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md ${
                    formData.desiredExperience.includes(experience.value)
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{experience.icon}</div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {experience.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {experience.desc}
                  </div>
                  {formData.desiredExperience.includes(experience.value) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Final Details
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Tell us about your project
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Purpose Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Who is this for?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'personal', label: 'Personal Use', icon: '🙋‍♀️', desc: 'Just for me or my family' },
                    { value: 'brand', label: 'My Brand', icon: '🏢', desc: 'Commercial product to sell' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFormData('purpose', option.value)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                        formData.purpose === option.value
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                      }`}
                    >
                      <div className="text-3xl mb-3">{option.icon}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Vision */}
              {formData.purpose === 'brand' && (
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-6">
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    🎯 Brand Vision (Optional)
                  </label>
                  <textarea
                    value={formData.brandVision}
                    onChange={(e) => updateFormData('brandVision', e.target.value)}
                    rows={3}
                    placeholder="Tell us about your brand concept, values, or target market..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>
              )}

              {/* Simplified Additional Information - REPLACES multiple ingredient fields */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  💬 Additional Information (Optional)
                </label>
                <textarea
                  value={formData.additionalInformation}
                  onChange={(e) => updateFormData('additionalInformation', e.target.value)}
                  rows={5}
                  placeholder="Tell us anything else you'd like about your formula:
• Specific ingredients you want (e.g., hyaluronic acid, shea butter)
• Ingredients to avoid (e.g., sulfates, parabens)
• Texture preferences (e.g., lightweight, rich, foaming)
• Scent preferences (e.g., unscented, floral, fresh)
• Special requirements (e.g., vegan, organic, sensitive skin)
• Packaging ideas
• Budget considerations
• Any other special requests..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white resize-none"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  💡 The more details you provide, the better we can customize your formula
                </p>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">📋 Your Formula Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-gray-900 dark:text-white">Category:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {formData.productCategory ? formData.productCategory.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Not selected'}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Type:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {formData.formulaType.length > 0 ? formData.formulaType.join(', ') : 'Not selected'}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Purpose:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {formData.purpose ? formData.purpose.charAt(0).toUpperCase() + formData.purpose.slice(1) : 'Not selected'}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Goals:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {formData.primaryGoals.length > 0 ? formData.primaryGoals.join(', ') : 'None selected'}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <strong className="text-gray-900 dark:text-white">Experience:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {formData.desiredExperience.length > 0 ? formData.desiredExperience.join(', ') : 'None selected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Clean Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3">
              <span className="text-4xl">✨</span>
              Let's Create Your Perfect Formula
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Answer a few questions and we'll generate a custom formulation just for you
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${
                  index < currentStep
                    ? 'bg-violet-500 text-white'
                    : index === currentStep
                      ? 'bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 border-2 border-violet-500'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                    index < currentStep ? 'bg-violet-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                
                {generatedFormulaId && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleViewFormulaDetails}
                      className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Formula Details
                    </button>
                    
                    <button
                      onClick={() => navigate('/formulas')}
                      className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      View All Formulas
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation - Sticky Bottom */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 0
                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
              <span>{currentStep + 1}</span>
              <span>of</span>
              <span>{steps.length}</span>
            </div>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isGenerating || !isStepValid()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                  isGenerating || !isStepValid()
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-violet-500/25'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Your Formula...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">✨</span>
                    <span>Generate My Formula</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isStepValid()
                    ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ✨ Powered by AI • Made with love for formulators
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormulaWizard;