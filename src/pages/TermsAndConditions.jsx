// frontend/src/pages/TermsAndConditions.jsx
import React from 'react';
import { ArrowLeft, Shield, FileText, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl opacity-90">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Table of Contents
          </h2>
          <nav className="grid md:grid-cols-2 gap-2">
            <a href="#acceptance" className="text-violet-600 hover:text-violet-800 text-sm">1. Acceptance of Terms</a>
            <a href="#services" className="text-violet-600 hover:text-violet-800 text-sm">2. Description of Services</a>
            <a href="#accounts" className="text-violet-600 hover:text-violet-800 text-sm">3. User Accounts</a>
            <a href="#subscription" className="text-violet-600 hover:text-violet-800 text-sm">4. Subscription & Payment</a>
            <a href="#usage" className="text-violet-600 hover:text-violet-800 text-sm">5. Acceptable Use</a>
            <a href="#content" className="text-violet-600 hover:text-violet-800 text-sm">6. User Content</a>
            <a href="#intellectual" className="text-violet-600 hover:text-violet-800 text-sm">7. Intellectual Property</a>
            <a href="#privacy" className="text-violet-600 hover:text-violet-800 text-sm">8. Privacy</a>
            <a href="#disclaimers" className="text-violet-600 hover:text-violet-800 text-sm">9. Disclaimers</a>
            <a href="#limitation" className="text-violet-600 hover:text-violet-800 text-sm">10. Limitation of Liability</a>
            <a href="#termination" className="text-violet-600 hover:text-violet-800 text-sm">11. Termination</a>
            <a href="#contact" className="text-violet-600 hover:text-violet-800 text-sm">12. Contact Information</a>
          </nav>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Important Notice</h3>
              <p className="text-amber-700 text-sm">
                Beauty Craft HQ provides formulation tools and information for educational and professional purposes. 
                Users are responsible for ensuring compliance with all applicable regulations in their jurisdiction. 
                Always consult with qualified professionals before manufacturing or selling cosmetic products.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none">
          
          <section id="acceptance" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Beauty Craft HQ ("the Service," "our Service," "the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p className="text-gray-700 mb-4">
              These Terms and Conditions ("Terms," "Terms and Conditions") govern your use of our cosmetic formulation platform operated by Beauty Craft HQ ("us," "we," or "our").
            </p>
            <p className="text-gray-700">
              If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          <section id="services" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
            <p className="text-gray-700 mb-4">
              Beauty Craft HQ provides a web-based platform for cosmetic formulation that includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Formula creation and management tools</li>
              <li>Ingredient database and information</li>
              <li>INCI list generation</li>
              <li>Safety data sheet (SDS) templates</li>
              <li>Batch calculation tools</li>
              <li>Cost analysis features</li>
              <li>Knowledge base and educational content</li>
            </ul>
            <p className="text-gray-700">
              We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
            </p>
          </section>

          <section id="accounts" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your information to keep it accurate and current</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="text-gray-700">
              You must be at least 18 years old to create an account and use our Service.
            </p>
          </section>

          <section id="subscription" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription & Payment</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Subscription Plans</h3>
            <p className="text-gray-700 mb-4">
              We offer various subscription plans with different features and limitations. Plan details and pricing are available on our website.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Payment Terms</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Subscription fees are billed in advance on a monthly or annual basis</li>
              <li>Payment is due immediately upon subscription</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change subscription prices with 30 days' notice</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Cancellation</h3>
            <p className="text-gray-700">
              You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period.
            </p>
          </section>

          <section id="usage" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Use the Service for any unlawful purpose or to solicit others to engage in unlawful acts</li>
              <li>Violate any international, federal, provincial, or state regulations, rules, or laws</li>
              <li>Transmit or upload any content that infringes on intellectual property rights</li>
              <li>Transmit any worms, viruses, or any code of a destructive nature</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Use the Service to create products that are unsafe or violate regulations</li>
              <li>Share your account credentials with others</li>
              <li>Use automated systems to access the Service without permission</li>
            </ul>
          </section>

          <section id="content" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Content</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 Your Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of formulas, data, and other content you create using our Service. You are responsible for the accuracy and legality of your content.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 License to Us</h3>
            <p className="text-gray-700 mb-4">
              By using our Service, you grant us a limited, non-exclusive license to store, process, and display your content solely for the purpose of providing the Service to you.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">6.3 Data Security</h3>
            <p className="text-gray-700">
              We implement appropriate security measures to protect your data, but cannot guarantee absolute security.
            </p>
          </section>

          <section id="intellectual" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are owned by Beauty Craft HQ and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-700">
              Our ingredient database, formulation tools, and educational content are proprietary and may not be reproduced without explicit permission.
            </p>
          </section>

          <section id="privacy" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy</h2>
            <p className="text-gray-700">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </section>

          <section id="disclaimers" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-red-800 mb-3">Important Safety Disclaimer</h3>
              <p className="text-red-700 text-sm">
                Beauty Craft HQ provides formulation tools and information for educational purposes only. We do not guarantee the safety, efficacy, or regulatory compliance of any formulas created using our platform. Users are solely responsible for:
              </p>
              <ul className="list-disc pl-6 text-red-700 text-sm mt-2">
                <li>Conducting proper safety testing</li>
                <li>Ensuring regulatory compliance in their jurisdiction</li>
                <li>Consulting with qualified cosmetic chemists</li>
                <li>Following all applicable laws and regulations</li>
              </ul>
            </div>
            
            <p className="text-gray-700 mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Merchantability and fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
              <li>Accuracy or completeness of information</li>
              <li>Uninterrupted or error-free service</li>
            </ul>
          </section>

          <section id="limitation" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BEAUTY CRAFT HQ SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="text-gray-700 mb-4">
              Our total liability to you for any claim arising from these Terms or your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
            <p className="text-gray-700">
              Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so these limitations may not apply to you.
            </p>
          </section>

          <section id="termination" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any breach of these Terms.
            </p>
            <p className="text-gray-700 mb-4">
              Upon termination, your right to use the Service will cease immediately. You may download your data within 30 days of termination.
            </p>
            <p className="text-gray-700">
              Sections that by their nature should survive termination will survive, including intellectual property provisions, disclaimers, and limitations of liability.
            </p>
          </section>

          <section id="changes" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will provide notice of material changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Posting the updated Terms on our website</li>
              <li>Sending an email notification to your registered email address</li>
              <li>Displaying a notice in the Service</li>
            </ul>
            <p className="text-gray-700">
              Your continued use of the Service after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section id="governing" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@beautycrafthq.com</p>
                <p><strong>Address:</strong> [Your Company Address]</p>
                <p><strong>Phone:</strong> [Your Phone Number]</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="border-t pt-8 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Link to="/" className="inline-flex items-center text-violet-600 hover:text-violet-800 mb-4 sm:mb-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-gray-700">Contact Us</Link>
              <Link to="/support" className="hover:text-gray-700">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;