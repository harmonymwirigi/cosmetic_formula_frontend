// frontend/src/pages/Homepage.jsx - Updated with Dashboard Color Palette
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Star, 
  Users, 
  Beaker, 
  FileText, 
  Calculator, 
  Palette, 
  ArrowRight, 
  Menu, 
  X,
  Play,
  Eye,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle,
  Shield,
  Zap,
  MessageCircle,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [activeDemo, setActiveDemo] = useState('formula');
  const [roiInputs, setRoiInputs] = useState({
    formulasPerMonth: 5,
    hoursPerFormula: 8,
    hourlyRate: 50
  });

  const features = [
    {
      icon: <Beaker className="w-8 h-8" />,
      title: "Formula Builder",
      description: "Drag-and-drop interface to create professional cosmetic formulations with real-time calculations"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Cost Calculator", 
      description: "Track ingredient costs and profit margins with built-in pricing optimization tools"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "INCI & SDS Exports",
      description: "Generate compliant ingredient lists and safety data sheets automatically for regulatory approval"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Fragrance & Color",
      description: "Advanced color matching and fragrance blending tools for perfect product development"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for hobbyists and beginners",
      features: [
        "Up to 5 formulas",
        "Basic ingredient library (500+ ingredients)",
        "INCI list generation",
        "Community support",
        "Basic cost tracking"
      ],
      limitations: [
        "No SDS generation",
        "No batch scaling",
        "Basic export options"
      ],
      cta: "Start Free",
      popular: false,
      bestFor: "Individual creators & hobbyists"
    },
    {
      name: "Professional",
      price: { monthly: 29, yearly: 290 },
      description: "For serious formulators and small brands",
      features: [
        "Unlimited formulas",
        "Premium ingredient database (2000+ ingredients)",
        "SDS generation",
        "Advanced cost analysis",
        "Batch scaling calculator",
        "Export to Excel/PDF",
        "Priority email support",
        "AI formulation suggestions"
      ],
      cta: "Start 14-Day Trial",
      popular: true,
      bestFor: "Small brands & serious formulators",
      roi: "Pays for itself with 1 formula"
    },
    {
      name: "Enterprise",
      price: { monthly: 99, yearly: 990 },
      description: "Professional labs and established brands",
      features: [
        "Everything in Professional",
        "Custom ingredient database",
        "White-label documentation",
        "API integrations",
        "Team collaboration tools",
        "Regulatory compliance checker",
        "Dedicated account manager",
        "Custom training sessions"
      ],
      cta: "Contact Sales",
      popular: false,
      bestFor: "Established brands & labs"
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
      quote: "Beauty Craft HQ transformed my skincare business. I went from messy spreadsheets to professional formulations in days!",
      company: "Natural Glow Co"
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Cosmetic Chemist",
      avatar: "👩‍🎓",
      quote: "The regulatory compliance features saved me weeks of work. It's like having a lab assistant that never sleeps.",
      company: "Pure Labs"
    },
    {
      name: "James Wilson",
      role: "Brand Founder",
      avatar: "👨‍💼",
      quote: "From concept to market in record time. The cost calculator alone paid for itself in the first month.",
      company: "Green Beauty Co"
    }
  ];

  const stats = [
    { number: "1,000+", label: "Active Formulators", icon: <Users className="h-6 w-6" /> },
    { number: "15,000+", label: "Formulas Created", icon: <CheckCircle className="h-6 w-6" /> },
    { number: "98%", label: "Customer Satisfaction", icon: <Star className="h-6 w-6" /> },
    { number: "50+", label: "Countries Served", icon: <Award className="h-6 w-6" /> }
  ];

  const customerLogos = [
    { name: "Indie Beauty Co", logo: "/logos/indie-beauty.png" },
    { name: "Green Labs", logo: "/logos/green-labs.png" },
    { name: "Pure Skincare", logo: "/logos/pure-skincare.png" },
    { name: "Natural Glow", logo: "/logos/natural-glow.png" }
  ];

  const certifications = [
    { name: "ISO 27001", description: "Data Security" },
    { name: "GDPR Compliant", description: "Privacy Protection" },
    { name: "SOC 2 Type II", description: "Security Standards" }
  ];

  const demoSteps = {
    formula: {
      title: "Build Your Formula",
      description: "Drag and drop ingredients to create professional formulations",
      steps: [
        "Select product type (serum, moisturizer, etc.)",
        "Choose base ingredients from our database",
        "Set percentages with real-time validation",
        "AI suggests complementary ingredients"
      ],
      icon: <Beaker className="h-6 w-6" />
    },
    documentation: {
      title: "Generate Documentation",
      description: "Create compliant INCI lists and safety documents instantly",
      steps: [
        "Auto-generate INCI list from formula",
        "Create safety data sheets (SDS)",
        "Export regulatory documentation",
        "Ensure global compliance standards"
      ],
      icon: <FileText className="h-6 w-6" />
    },
    analysis: {
      title: "Cost Analysis",
      description: "Track costs and optimize for profitability",
      steps: [
        "Real-time ingredient cost tracking",
        "Calculate production costs per unit",
        "Set target margins and pricing",
        "Compare with market alternatives"
      ],
      icon: <Calculator className="h-6 w-6" />
    }
  };

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

  const calculateROI = () => {
    const monthlyTimeSaved = roiInputs.formulasPerMonth * (roiInputs.hoursPerFormula - 2);
    const monthlySavings = monthlyTimeSaved * roiInputs.hourlyRate;
    const annualSavings = monthlySavings * 12;
    return { monthlyTimeSaved, monthlySavings, annualSavings };
  };

  const roi = calculateROI();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Beauty Craft HQ</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#pricing" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                <a href="#demo" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Demo</a>
                <Link to="/signin" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Sign In</Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Get Started</Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-2 rounded-md"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                <a href="#features" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Features</a>
                <a href="#pricing" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
                <a href="#demo" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Demo</a>
                <Link to="/signin" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Sign In</Link>
                <Link to="/signup" className="bg-indigo-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Get Started</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center bg-yellow-50 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm text-yellow-700">Join 1,000+ formulators saving 6+ hours per formula</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Formulate skincare
              <span className="block text-gray-900">like a pro — in minutes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional formulation software for creators and brands. No spreadsheets. Zero guesswork.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/signup" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center">
                Start Formulating →
              </Link>
              <button className="border border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors">
                See It In Action
              </button>
            </div>
            
            <p className="text-sm text-gray-500">Free forever • No credit card required</p>

            {/* Live Activity */}
            <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span>3 formulators joined today</span>
              </div>
              <div className="w-1 h-4 bg-gray-300"></div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>127 formulas created this week</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center text-indigo-600 mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Customer Logos */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-6">Trusted by beauty brands worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {customerLogos.map((customer, index) => (
                <div key={index} className="h-8 w-24 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs text-indigo-600 font-medium">{customer.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-0 items-stretch">
            <div className="bg-gray-50 border-r border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Before: Chaos & Guesswork</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  Hours wasted fixing calculation errors
                </li>
                <li className="flex items-center">
                  <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  Regulatory paperwork piled up
                </li>
                <li className="flex items-center">
                  <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  Inconsistent formula records
                </li>
                <li className="flex items-center">
                  <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  Manual cost calculations and profit guessing
                </li>
              </ul>
            </div>
            
            <div className="bg-indigo-600 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">After: Professional & Effortless</h2>
              <ul className="space-y-3 text-white">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  Drag-and-drop formula builder with auto-calculations
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  Instant INCI lists and safety documentation
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  Professional reports ready for compliance
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  Real-time cost tracking and profit optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="py-20 bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See how it works in 3 simple steps
            </h2>
            <p className="text-xl text-indigo-100">
              From concept to compliant formula in minutes, not hours
            </p>
          </div>

          {/* Demo Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-2 flex space-x-2">
              {Object.entries(demoSteps).map(([key, demo]) => (
                <button
                  key={key}
                  onClick={() => setActiveDemo(key)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeDemo === key
                      ? 'bg-indigo-600 text-white'
                      : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  {demo.icon}
                  <span className="ml-2 hidden sm:inline">{demo.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Demo Video/Image */}
            <div className="relative">
              <div className="bg-gray-800 rounded-xl p-8 text-center">
                <div className="bg-white rounded-lg h-64 flex items-center justify-center mb-4">
                  <div className="text-indigo-600">
                    <Eye className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Interactive Demo</p>
                    <p className="text-sm">Watch {demoSteps[activeDemo].title}</p>
                  </div>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center mx-auto">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Demo Description */}
            <div className="text-white">
              <div className="flex items-center mb-4">
                <div className="text-indigo-200 mr-3">
                  {demoSteps[activeDemo].icon}
                </div>
                <h3 className="text-2xl font-bold">
                  {demoSteps[activeDemo].title}
                </h3>
              </div>
              
              <p className="text-lg text-indigo-100 mb-6">
                {demoSteps[activeDemo].description}
              </p>

              <div className="space-y-3">
                {demoSteps[activeDemo].steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <span className="text-indigo-100">{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-block">
                  Try It Free
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3">
              <span className="text-gray-700 font-semibold mr-2">⚡ Average time saved:</span>
              <span className="text-indigo-600 font-bold">6 hours per formula</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to formulate like a pro
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Designed by cosmetic chemists for creators of all levels
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white text-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator & Pricing */}
      <section id="pricing" className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ROI Calculator */}
          <div className="bg-white rounded-xl p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Calculate Your Time & Cost Savings
              </h2>
              <p className="text-gray-600">
                See how much you could save by switching from spreadsheets
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formulas created per month
                  </label>
                  <input
                    type="number"
                    value={roiInputs.formulasPerMonth}
                    onChange={(e) => setRoiInputs({...roiInputs, formulasPerMonth: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Potential Savings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Time saved/month
                    </span>
                    <span className="font-bold text-gray-900">{roi.monthlyTimeSaved} hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Cost savings/month
                    </span>
                    <span className="font-bold text-gray-900">${roi.monthlySavings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                    <span className="flex items-center text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Annual savings
                    </span>
                    <span className="font-bold text-green-600 text-lg">${roi.annualSavings.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    💡 Professional plan pays for itself in just {Math.ceil(348 / roi.monthlySavings)} month{Math.ceil(348 / roi.monthlySavings) !== 1 ? 's' : ''}!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-indigo-100">
              Start free, upgrade when you're ready to scale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg relative ${
                plan.popular ? 'ring-2 ring-yellow-400 transform scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price.monthly}
                      </span>
                      <span className="text-gray-600">/month</span>
                      {plan.price.yearly > 0 && (
                        <div className="text-sm text-green-600">
                          Save ${(plan.price.monthly * 12) - plan.price.yearly}/year with annual billing
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Best for: {plan.bestFor}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.limitations && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="text-xs text-gray-500">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {plan.roi && (
                    <div className="mb-4 p-2 bg-green-50 rounded text-center">
                      <span className="text-xs text-green-700 font-semibold">{plan.roi}</span>
                    </div>
                  )}

                  <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.popular 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                  }`}>
                    {plan.cta}
                  </button>

                  {plan.name === "Professional" && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      14-day free trial • No credit card required
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by creators worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of formulators creating amazing products
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-indigo-600 text-xs font-medium">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Enterprise-grade security you can trust
            </h2>
            <p className="text-gray-600">
              Your formulations and data are protected with industry-leading security
            </p>
          </div>

          <div className="flex justify-center space-x-12">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-900">{cert.name}</div>
                <div className="text-xs text-gray-600">{cert.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to revolutionize your formulations?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 1,000+ creators formulating smarter with Beauty Craft HQ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/signup" className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center">
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/signin" className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
          
          <div className="flex items-center justify-center text-sm opacity-80 mb-6">
            <Users className="h-4 w-4 mr-2" />
            <span>No credit card required • 14-day free trial • Cancel anytime</span>
          </div>

          {/* Contact Options */}
          <div className="flex justify-center space-x-6 text-sm">
            <a href="mailto:support@beautycrafthq.com" className="flex items-center hover:underline">
              <MessageCircle className="h-4 w-4 mr-1" />
              Live Chat
            </a>
            <a href="tel:+1-555-BEAUTY" className="flex items-center hover:underline">
              <Phone className="h-4 w-4 mr-1" />
              Call Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-lg font-bold text-white">Beauty Craft HQ</span>
              </div>
              <p className="text-sm mb-4">
                Professional cosmetic formulation tools for the modern creator.
              </p>
              <div className="flex space-x-4 text-sm">
                <a href="mailto:support@beautycrafthq.com" className="hover:text-white">support@beautycrafthq.com</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white">Demo</a></li>
                <li><a href="/knowledge" className="hover:text-white">Knowledge Hub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/careers" className="hover:text-white">Careers</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                <li><a href="/security" className="hover:text-white">Security</a></li>
                <li><a href="/compliance" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2025 Beauty Craft HQ. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-xs">Made with ❤️ for formulators</span>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;