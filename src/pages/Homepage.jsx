// frontend/src/pages/Homepage.jsx - Dark Coffee Theme
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Star, Users, Beaker, FileText, Calculator, Palette, ArrowRight, Menu, X } from 'lucide-react';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const features = [
    {
      icon: <Beaker className="w-8 h-8" />,
      title: "Formula Builder",
      description: "Drag-and-drop interface to create professional cosmetic formulations with real-time calculations"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "INCI & SDS Exports",
      description: "Generate compliant ingredient lists and safety data sheets automatically for regulatory approval"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Cost Calculator",
      description: "Track ingredient costs and profit margins with built-in pricing optimization tools"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Fragrance & Color",
      description: "Advanced color matching and fragrance blending tools for perfect product development"
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for hobbyists and beginners",
      features: [
        "Up to 5 formulas",
        "Basic ingredient library",
        "INCI list generation",
        "Community support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Unlimited",
      price: { monthly: 29, yearly: 290 },
      description: "For serious formulators and small brands",
      features: [
        "Unlimited formulas",
        "Premium ingredient database",
        "SDS generation",
        "Cost analysis tools",
        "Export to Excel/PDF",
        "Priority support"
      ],
      cta: "Start Creating",
      popular: true
    },
    {
      name: "Pro Lab",
      price: { monthly: 99, yearly: 990 },
      description: "Professional labs and established brands",
      features: [
        "Everything in Unlimited",
        "Regulatory compliance tools",
        "Batch scaling calculator",
        "Custom branding",
        "API integrations",
        "Dedicated support"
      ],
      cta: "Go Professional",
      popular: false
    }
  ];

  const screenshots = [
    {
      src: "/images/screenshots/formulas-dashboard.png",
      caption: "Step-by-step formulation",
      description: "Intuitive formula builder with drag-and-drop ingredients"
    },
    {
      src: "/images/screenshots/ingredients-database.png",
      caption: "Your ingredient library",
      description: "Comprehensive database with safety data and usage rates"
    },
    {
      src: "/images/screenshots/batch-calculator.png",
      caption: "Professional reports",
      description: "Generate INCI lists and safety documentation instantly"
    },
    {
      src: "/images/screenshots/inci-list.png",
      caption: "Cost analysis",
      description: "Track costs and optimize your formulations for profitability"
    },
    {
      src: "/images/screenshots/documentation.png",
      caption: "Safety Documentation",
      description: "Auto-generated MSDS and SOP documents for compliance"
    },
    {
      src: "/images/screenshots/knowledge-hub.png",
      caption: "Knowledge Hub",
      description: "Access expert tutorials and formulation guides"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Etsy Seller",
      avatar: "👩‍🔬",
      quote: "Beauty Craft HQ transformed my skincare business. I went from messy spreadsheets to professional formulations in days!"
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Cosmetic Chemist",
      avatar: "👩‍🎓",
      quote: "The regulatory compliance features saved me weeks of work. It's like having a lab assistant that never sleeps."
    },
    {
      name: "James Wilson",
      role: "Brand Founder",
      avatar: "👨‍💼",
      quote: "From concept to market in record time. The cost calculator alone paid for itself in the first month."
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [screenshots.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <nav className="bg-amber-50 border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="fill-amber-700" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
                  <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-amber-900">Beauty Craft HQ</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-amber-700 hover:text-amber-900 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#pricing" className="text-amber-700 hover:text-amber-900 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                <a href="#gallery" className="text-amber-700 hover:text-amber-900 px-3 py-2 rounded-md text-sm font-medium">Gallery</a>
                <a href="/signin" className="text-amber-700 hover:text-amber-900 px-3 py-2 rounded-md text-sm font-medium">Sign In</a>
                <a href="/signup" className="bg-amber-900 text-amber-50 px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-800">Get Started</a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-700 p-2 rounded-md"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-amber-100">
                <a href="#features" className="text-amber-700 hover:text-amber-900 block px-3 py-2 rounded-md text-base font-medium">Features</a>
                <a href="#pricing" className="text-amber-700 hover:text-amber-900 block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
                <a href="#gallery" className="text-amber-700 hover:text-amber-900 block px-3 py-2 rounded-md text-base font-medium">Gallery</a>
                <a href="/signin" className="text-amber-700 hover:text-amber-900 block px-3 py-2 rounded-md text-base font-medium">Sign In</a>
                <a href="/signup" className="bg-amber-900 text-amber-50 block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800">Get Started</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
              Create your own skincare
              <span className="block text-amber-700">formulas in minutes</span>
            </h1>
            <p className="text-xl text-amber-800 mb-8 max-w-3xl mx-auto">
              Professional cosmetic formulation tools for creators, formulators, and brands. No more spreadsheets. No guesswork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup" className="bg-amber-900 text-amber-50 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-800 transition-colors inline-flex items-center">
                Start Formulating
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#gallery" className="border border-amber-700 text-amber-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-100 transition-colors">
                See It In Action
              </a>
            </div>
            <p className="text-sm text-amber-600 mt-4">Free forever • No credit card required</p>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-red-700 mb-4">Before: Chaos & Guesswork</h2>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-center">
                  <X className="h-5 w-5 text-red-600 mr-3" />
                  Complex spreadsheets with calculation errors
                </li>
                <li className="flex items-center">
                  <X className="h-5 w-5 text-red-600 mr-3" />
                  Hours spent on regulatory paperwork
                </li>
                <li className="flex items-center">
                  <X className="h-5 w-5 text-red-600 mr-3" />
                  Manual cost calculations and profit guessing
                </li>
                <li className="flex items-center">
                  <X className="h-5 w-5 text-red-600 mr-3" />
                  Inconsistent formulation documentation
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-4">After: Professional & Effortless</h2>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  Drag-and-drop formula builder with auto-calculations
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  Instant INCI lists and safety documentation
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  Real-time cost tracking and profit optimization
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  Professional reports ready for compliance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-amber-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4">
              Everything you need to formulate like a pro
            </h2>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Powerful tools designed by cosmetic chemists for creators of all levels
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-amber-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-amber-700 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">{feature.title}</h3>
                <p className="text-amber-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Gallery */}
      <section id="gallery" className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              See Beauty Craft HQ in action
            </h2>
            <p className="text-xl text-amber-700">
              Take a tour of our intuitive formulation platform
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <img 
                src={screenshots[currentSlide].src} 
                alt={screenshots[currentSlide].caption}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400/f3f4f6/6b7280?text=" + encodeURIComponent(screenshots[currentSlide].caption);
                }}
              />
              
              {/* Navigation buttons */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-amber-50/90 hover:bg-amber-50 text-amber-900 p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-amber-50/90 hover:bg-amber-50 text-amber-900 p-2 rounded-full transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-amber-50' : 'bg-amber-50/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Caption */}
            <div className="text-center mt-6">
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                {screenshots[currentSlide].caption}
              </h3>
              <p className="text-amber-700">
                {screenshots[currentSlide].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-amber-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4">
              Choose your formulation journey
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              From hobbyist to professional lab, we have a plan for everyone
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-amber-50' : 'text-amber-200'}`}>Monthly</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="mx-3 relative inline-flex h-6 w-11 items-center rounded-full bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-amber-50 transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-amber-50' : 'text-amber-200'}`}>
                Yearly <span className="text-green-400 font-medium">(Save 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-amber-50 rounded-xl shadow-sm hover:shadow-md transition-shadow relative ${
                plan.popular ? 'ring-2 ring-amber-500' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-amber-700 text-amber-50 px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-amber-900 mb-2">{plan.name}</h3>
                  <p className="text-amber-700 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-amber-900">
                      ${plan.price[billingPeriod]}
                    </span>
                    <span className="text-amber-700">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-amber-700">
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.popular 
                      ? 'bg-amber-900 text-amber-50 hover:bg-amber-800' 
                      : 'border border-amber-700 text-amber-700 hover:bg-amber-100'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              Loved by creators worldwide
            </h2>
            <p className="text-xl text-amber-700">
              Join thousands of formulators creating amazing products
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-amber-100 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-amber-900">{testimonial.name}</h4>
                    <p className="text-amber-700 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-amber-800">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-900 to-amber-800 text-amber-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to revolutionize your formulations?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 1000+ creators formulating smarter with Beauty Craft HQ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="bg-amber-50 text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-100 transition-colors inline-flex items-center justify-center">
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a href="/signin" className="border border-amber-50 text-amber-50 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-50/10 transition-colors">
              Sign In
            </a>
          </div>
          
          <div className="flex items-center justify-center mt-8 text-sm opacity-80">
            <Users className="h-4 w-4 mr-2" />
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-950 text-amber-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg className="fill-amber-500" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
                  <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
                </svg>
                <span className="ml-2 text-lg font-bold">Beauty Craft HQ</span>
              </div>
              <p className="text-amber-200 text-sm">
                Professional cosmetic formulation tools for the modern creator.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-amber-200">
                <li><a href="#features" className="hover:text-amber-50">Features</a></li>
                <li><a href="#pricing" className="hover:text-amber-50">Pricing</a></li>
                <li><a href="#gallery" className="hover:text-amber-50">Gallery</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-amber-200">
                <li><a href="#" className="hover:text-amber-50">About</a></li>
                <li><a href="#" className="hover:text-amber-50">Contact</a></li>
                <li><a href="#" className="hover:text-amber-50">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-amber-200">
                <li><a href="/privacy" className="hover:text-amber-50">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-amber-50">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-amber-50">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-200">
            <p>&copy; 2025 Beauty Craft HQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;