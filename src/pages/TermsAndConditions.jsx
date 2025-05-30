// frontend/src/pages/TermsAndConditions.jsx - Updated with dark coffee theme
import React from 'react';
import { ArrowLeft, Shield, FileText, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  const lastUpdated = "May 30, 2025";

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link to="/" className="inline-flex items-center text-amber-100 hover:text-amber-50 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl opacity-90">Effective Date: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table of Contents */}
        <div className="bg-amber-100 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Table of Contents
          </h2>
          <nav className="grid md:grid-cols-2 gap-2">
            <a href="#use-of-services" className="text-amber-700 hover:text-amber-900 text-sm">1. Use of Services</a>
            <a href="#user-accounts" className="text-amber-700 hover:text-amber-900 text-sm">2. User Accounts</a>
            <a href="#intellectual-property" className="text-amber-700 hover:text-amber-900 text-sm">3. Intellectual Property</a>
            <a href="#subscriptions" className="text-amber-700 hover:text-amber-900 text-sm">4. Subscriptions & Payments</a>
            <a href="#ai-content" className="text-amber-700 hover:text-amber-900 text-sm">5. AI-Generated Content</a>
            <a href="#disclaimers" className="text-amber-700 hover:text-amber-900 text-sm">6. Disclaimers</a>
            <a href="#limitation" className="text-amber-700 hover:text-amber-900 text-sm">7. Limitation of Liability</a>
            <a href="#privacy" className="text-amber-700 hover:text-amber-900 text-sm">8. Privacy</a>
            <a href="#termination" className="text-amber-700 hover:text-amber-900 text-sm">9. Termination</a>
            <a href="#governing-law" className="text-amber-700 hover:text-amber-900 text-sm">10. Governing Law</a>
            <a href="#changes" className="text-amber-700 hover:text-amber-900 text-sm">11. Changes to Terms</a>
            <a href="#contact" className="text-amber-700 hover:text-amber-900 text-sm">12. Contact</a>
          </nav>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Important Safety Notice</h3>
              <p className="text-red-700 text-sm">
                BeautyCraft HQ provides formulation tools and AI assistance for educational and professional purposes. 
                All AI-generated content should be verified by certified cosmetic chemists or regulatory experts. 
                Users are responsible for ensuring compliance with all applicable regulations in their jurisdiction.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none">
          
          <section id="use-of-services" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">1. Use of Services</h2>
            <p className="text-amber-800 mb-4">
              BeautyCraft HQ provides a platform to help users create cosmetic formulations, generate product documentation, and access formulation and manufacturing guidance through AI-powered tools.
            </p>
            <p className="text-amber-800 mb-4">
              You agree to use our Services only for lawful purposes and in accordance with these Terms. Our platform includes:
            </p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>AI-powered formula creation and optimization tools</li>
              <li>Ingredient database and safety information</li>
              <li>INCI list generation and regulatory documentation</li>
              <li>Batch calculation and scaling tools</li>
              <li>Cost analysis and profitability features</li>
              <li>Knowledge base and educational content</li>
            </ul>
          </section>

          <section id="user-accounts" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">2. User Accounts</h2>
            <p className="text-amber-800 mb-4">
              To access certain features, you may need to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>Provide accurate and complete information during registration</li>
              <li>Keep your credentials secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Be at least 18 years old to create an account</li>
            </ul>
            <p className="text-amber-800">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in prohibited activities.
            </p>
          </section>

          <section id="intellectual-property" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">3. Intellectual Property</h2>
            <p className="text-amber-800 mb-4">
              All content, algorithms, software, and branding on the Site are the intellectual property of BeautyCraft HQ or its licensors. You may not reproduce, distribute, modify, or create derivative works without written permission.
            </p>
            <p className="text-amber-800 mb-4">
              <strong>Your Formulations:</strong> Formulations generated using our AI remain your property. However, we may anonymize and analyze usage data to improve our services.
            </p>
            <p className="text-amber-800">
              Our ingredient database, AI models, and educational content are proprietary and protected by intellectual property laws.
            </p>
          </section>

          <section id="subscriptions" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">4. Subscriptions and Payments</h2>
            <p className="text-amber-800 mb-4">
              Certain features may require a paid subscription. All fees are listed in USD and are non-refundable unless stated otherwise or required by law.
            </p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>Subscription fees are billed in advance on a monthly or annual basis</li>
              <li>By subscribing, you authorize us to charge your selected payment method on a recurring basis</li>
              <li>You can cancel anytime before the next billing cycle</li>
              <li>We may change subscription prices with 30 days' notice</li>
              <li>Cancellations take effect at the end of your current billing period</li>
            </ul>
          </section>

          <section id="ai-content" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">5. AI-Generated Content</h2>
            <div className="bg-amber-100 border border-amber-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-amber-800 mb-3">Important AI Disclaimer</h3>
              <p className="text-amber-700 text-sm">
                Our AI is trained on extensive data to assist in product creation and documentation. However, the outputs are suggestions only and should be verified by a certified cosmetic chemist or regulatory expert.
              </p>
            </div>
            <p className="text-amber-800 mb-4">
              BeautyCraft HQ is not responsible for legal, medical, or compliance issues resulting from the use of AI-generated content. Users must:
            </p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>Conduct proper safety testing on all formulations</li>
              <li>Ensure regulatory compliance in their jurisdiction</li>
              <li>Consult with qualified cosmetic chemists</li>
              <li>Verify all AI recommendations before implementation</li>
              <li>Follow all applicable laws and regulations</li>
            </ul>
          </section>

          <section id="disclaimers" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">6. Disclaimers</h2>
            <p className="text-amber-800 mb-4">
              We provide the Services "as is" and "as available." We make no warranties regarding:
            </p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>Accuracy or completeness of content or AI-generated suggestions</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Suitability for any particular purpose</li>
              <li>Safety, efficacy, or regulatory compliance of formulations</li>
              <li>Merchantability and fitness for a particular purpose</li>
            </ul>
            <p className="text-amber-800">
              Use of our tools does not guarantee regulatory compliance or product efficacy. Professional consultation is always recommended.
            </p>
          </section>

          <section id="limitation" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-amber-800 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BEAUTYCRAFTHQ SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICES.
            </p>
            <p className="text-amber-800 mb-4">
              Our total liability to you for any claim arising from these Terms or your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
            <p className="text-amber-800">
              This limitation applies to all claims, whether based on warranty, contract, tort, or any other legal theory.
            </p>
          </section>

          <section id="privacy" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">8. Privacy</h2>
            <p className="text-amber-800">
              We respect your privacy. Please refer to our Privacy Policy at <a href="/privacy" className="text-amber-700 underline hover:text-amber-900">https://www.beautycrafthq.com/privacy</a> for information on how we collect, use, and protect your data.
            </p>
          </section>

          <section id="termination" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">9. Termination</h2>
            <p className="text-amber-800 mb-4">
              We may suspend or terminate access to our Services at any time, with or without cause or notice, including for violations of these Terms.
            </p>
            <p className="text-amber-800 mb-4">
              Upon termination, your right to use the Service will cease immediately. You may download your data within 30 days of termination.
            </p>
            <p className="text-amber-800">
              Sections that by their nature should survive termination will survive, including intellectual property provisions, disclaimers, and limitations of liability.
            </p>
          </section>

          <section id="governing-law" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">10. Governing Law</h2>
            <p className="text-amber-800">
              These Terms are governed by the laws of the State of Michigan, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of Michigan.
            </p>
          </section>

          <section id="changes" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">11. Changes to Terms</h2>
            <p className="text-amber-800 mb-4">
              We reserve the right to update these Terms at any time. We will provide notice of material changes by:
            </p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>Posting the updated Terms on our website</li>
              <li>Sending an email notification to your registered email address</li>
              <li>Displaying a notice in the Service</li>
            </ul>
            <p className="text-amber-800">
              Continued use of the Services after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">12. Contact</h2>
            <div className="bg-amber-100 rounded-lg p-6">
              <p className="text-amber-800 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-amber-800">
                <p><strong>Email:</strong> support@beautycrafthq.com</p>
                <p><strong>Business Address:</strong> 12782 Currie Court, Livonia, MI 48150</p>
                <p><strong>Website:</strong> <a href="https://www.beautycrafthq.com" className="text-amber-700 underline hover:text-amber-900">www.beautycrafthq.com</a></p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="border-t border-amber-200 pt-8 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Link to="/" className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-4 sm:mb-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex space-x-6 text-sm text-amber-600">
              <Link to="/privacy" className="hover:text-amber-800">Privacy Policy</Link>
              <a href="mailto:support@beautycrafthq.com" className="hover:text-amber-800">Contact Us</a>
              <Link to="/support" className="hover:text-amber-800">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;