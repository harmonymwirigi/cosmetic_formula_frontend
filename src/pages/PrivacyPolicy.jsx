// frontend/src/pages/PrivacyPolicy.jsx
import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Users, AlertTriangle, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          <div className="flex items-center mb-4">
            <Shield className="h-12 w-12 mr-4 text-amber-200" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl opacity-90">Effective Date: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-amber-100 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Eye className="h-6 w-6 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Our Commitment to Your Privacy</h3>
              <p className="text-amber-800 text-sm">
                At BeautyCraft HQ ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.beautycrafthq.com and use our services, including AI formulation tools, documentation generators, and member dashboards.
              </p>
              <p className="text-amber-800 text-sm mt-2">
                By accessing or using our services, you consent to the collection and use of your data as described in this Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-amber-100 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Table of Contents
          </h2>
          <nav className="grid md:grid-cols-2 gap-2">
            <a href="#information-collected" className="text-amber-700 hover:text-amber-900 text-sm">1. Information We Collect</a>
            <a href="#how-we-use" className="text-amber-700 hover:text-amber-900 text-sm">2. How We Use Your Information</a>
            <a href="#sharing-information" className="text-amber-700 hover:text-amber-900 text-sm">3. Sharing Your Information</a>
            <a href="#cookies-tracking" className="text-amber-700 hover:text-amber-900 text-sm">4. Cookies and Tracking</a>
            <a href="#data-storage" className="text-amber-700 hover:text-amber-900 text-sm">5. Data Storage and Security</a>
            <a href="#your-rights" className="text-amber-700 hover:text-amber-900 text-sm">6. Your Rights</a>
            <a href="#childrens-privacy" className="text-amber-700 hover:text-amber-900 text-sm">7. Children's Privacy</a>
            <a href="#third-party-links" className="text-amber-700 hover:text-amber-900 text-sm">8. Third-Party Links</a>
            <a href="#policy-updates" className="text-amber-700 hover:text-amber-900 text-sm">9. Updates to This Policy</a>
            <a href="#contact-us" className="text-amber-700 hover:text-amber-900 text-sm">10. Contact Us</a>
          </nav>
        </div>

        {/* Privacy Content */}
        <div className="prose prose-lg max-w-none">
          
          <section id="information-collected" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">1. Information We Collect</h2>
            <p className="text-amber-800 mb-4">
              We may collect the following types of information:
            </p>
            
            <div className="bg-amber-100 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">a. Personal Information</h3>
              <ul className="list-disc pl-6 text-amber-800">
                <li>Full name, email address, and billing address</li>
                <li>Company or brand information</li>
                <li>Payment details (processed via secure third-party gateways like Stripe)</li>
              </ul>
            </div>

            <div className="bg-amber-100 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">b. Formulation & Usage Data</h3>
              <ul className="list-disc pl-6 text-amber-800">
                <li>Responses submitted through AI-powered forms or formulation wizards</li>
                <li>Your cosmetic formulations and related documentation</li>
                <li>Activity logs to improve service quality and ensure compliance</li>
              </ul>
            </div>

            <div className="bg-amber-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">c. Technical Data</h3>
              <ul className="list-disc pl-6 text-amber-800">
                <li>IP address, browser type, device information</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Usage patterns and platform interaction data</li>
              </ul>
            </div>
          </section>

          <section id="how-we-use" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-amber-800 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>Provide and optimize our AI-powered formulation services</li>
              <li>Generate and store your cosmetic formulations and documentation</li>
              <li>Process payments and manage subscriptions</li>
              <li>Communicate important updates, security alerts, and promotional offers</li>
              <li>Comply with legal, regulatory, and contractual obligations</li>
              <li>Improve our AI models and platform functionality</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> We may anonymize data for research, analytics, and product improvement purposes. Anonymized data cannot be used to identify you personally.
              </p>
            </div>
          </section>

          <section id="sharing-information" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">3. Sharing Your Information</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-semibold">We do not sell your personal data.</p>
            </div>
            <p className="text-amber-800 mb-4">We may share information only in the following circumstances:</p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li><strong>Service Providers:</strong> With trusted third-party processors (e.g., payment providers like Stripe, analytics tools)</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations, court orders, or regulatory requirements</li>
              <li><strong>With Consent:</strong> When you explicitly authorize us to share your information</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice to users)</li>
            </ul>
          </section>

          <section id="cookies-tracking" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-amber-800 mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>Remember user preferences and login status</li>
              <li>Analyze traffic and platform usage patterns</li>
              <li>Deliver a personalized user experience</li>
              <li>Improve our AI recommendations</li>
              <li>Provide security features and fraud prevention</li>
            </ul>
            <p className="text-amber-800">
              You may adjust cookie settings in your browser at any time. However, disabling cookies may limit some platform functionality.
            </p>
          </section>

          <section id="data-storage" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">5. Data Storage and Security</h2>
            <div className="bg-amber-100 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <Lock className="h-5 w-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 text-sm">
                    Your data is securely stored in cloud-based systems hosted in the United States. We implement industry-standard encryption and access controls to protect your information.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-amber-800 mb-4">Our security measures include:</p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and employee training</li>
              <li>Secure payment processing through certified providers</li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> While we implement robust security measures, no online service is 100% secure. We cannot guarantee absolute security of your data.
              </p>
            </div>
          </section>

          <section id="your-rights" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">6. Your Rights</h2>
            <p className="text-amber-800 mb-4">You have the right to:</p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-amber-100 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Data Access & Control</h4>
                <ul className="list-disc pl-4 text-amber-800 text-sm">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your data</li>
                  <li>Request data portability</li>
                </ul>
              </div>
              <div className="bg-amber-100 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Communication & Consent</h4>
                <ul className="list-disc pl-4 text-amber-800 text-sm">
                  <li>Opt-out of marketing communications</li>
                  <li>Restrict processing of your data</li>
                  <li>Withdraw consent at any time</li>
                  <li>File complaints with authorities</li>
                </ul>
              </div>
            </div>
            <div className="bg-amber-100 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <strong>To exercise your rights:</strong> Email us at <a href="mailto:privacy@beautycrafthq.com" className="text-amber-700 underline hover:text-amber-900">privacy@beautycrafthq.com</a> with your request. We will respond within 30 days.
              </p>
            </div>
          </section>

          <section id="childrens-privacy" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">7. Children's Privacy</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <Users className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 text-sm">
                    Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal data from children under 16. If we become aware that we have collected such data, we will delete it promptly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="third-party-links" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">8. Third-Party Links</h2>
            <p className="text-amber-800 mb-4">
              Our platform may include links to third-party websites, including payment processors, educational resources, and partner services.
            </p>
            <p className="text-amber-800">
              We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section id="policy-updates" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">9. Updates to This Policy</h2>
            <p className="text-amber-800 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements.
            </p>
            <p className="text-amber-800 mb-4">
              When we make material changes, we will:
            </p>
            <ul className="list-disc pl-6 text-amber-800 mb-4">
              <li>Post the updated policy on this page with a revised effective date</li>
              <li>Send email notifications to registered users</li>
              <li>Display prominent notices on our platform</li>
            </ul>
            <p className="text-amber-800">
              Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          <section id="contact-us" className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">10. Contact Us</h2>
            <div className="bg-amber-100 rounded-lg p-6">
              <p className="text-amber-800 mb-4">
                If you have any questions or concerns regarding this Privacy Policy, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 font-semibold">Privacy Inquiries</p>
                    <a href="mailto:privacy@beautycrafthq.com" className="text-amber-700 underline hover:text-amber-900">privacy@beautycrafthq.com</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 font-semibold">Business Address</p>
                    <p className="text-amber-700">12782 Currie Court<br />Livonia, MI 48150</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-amber-200">
                <p className="text-amber-700 text-sm">
                  <strong>Website:</strong> <a href="https://www.beautycrafthq.com" className="underline hover:text-amber-900">www.beautycrafthq.com</a>
                </p>
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
              <Link to="/terms" className="hover:text-amber-800">Terms & Conditions</Link>
              <a href="mailto:support@beautycrafthq.com" className="hover:text-amber-800">Contact Us</a>
              <Link to="/support" className="hover:text-amber-800">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;