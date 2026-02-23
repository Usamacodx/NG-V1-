import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-gray-300 hover:text-white mb-4 inline-block">← Back Home</Link>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-300">Your Privacy is Our Priority</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-12">
          <p className="text-gray-700">
            <strong>Last Updated:</strong> February 4, 2026
          </p>
          <p className="text-gray-700 mt-2">
            This Privacy Policy explains how NextGen Custom Apparel ("we," "us," "our," or "Company") collects, uses, and protects your personal information when you visit our website and use our services.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <p className="text-gray-700 mb-3">We collect information you provide directly, including:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Full name and contact information (email, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (credit/debit card details)</li>
                  <li>Product preferences and design choices</li>
                  <li>Account information and login credentials</li>
                  <li>Communication preferences</li>
                  <li>Special instructions and custom requests</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
                <p className="text-gray-700 mb-3">When you use our website, we automatically collect:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Browser type and version</li>
                  <li>IP address and device information</li>
                  <li>Pages visited and time spent on each page</li>
                  <li>Referral source and exit pages</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location information (if permitted)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Third-Party Information</h3>
                <p className="text-gray-700">We may receive information about you from third parties, including payment processors and shipping partners, to facilitate transactions and deliveries.</p>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            
            <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li><strong>Order Processing:</strong> To process, fulfill, and deliver your orders</li>
              <li><strong>Payment Processing:</strong> To process transactions securely</li>
              <li><strong>Communication:</strong> To send order updates, shipping notifications, and customer support</li>
              <li><strong>Marketing:</strong> To send promotional offers and newsletters (with your consent)</li>
              <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our website and services</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and resolve disputes</li>
              <li><strong>Customer Support:</strong> To respond to inquiries and provide technical support</li>
              <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent activities</li>
            </ul>
          </section>

          {/* 3. Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Share Your Information</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">We do not sell, trade, or rent your personal information to third parties. However, we share information with:</p>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Service Providers</h3>
                <p className="text-gray-700">Payment processors, shipping partners, email providers, and hosting providers who assist us in operating our business and providing services to you.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Legal Requirements</h3>
                <p className="text-gray-700">We may disclose your information when required by law, court orders, or government requests.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Business Transfers</h3>
                <p className="text-gray-700">If we merge, acquire, or sell assets, your information may be transferred as part of that transaction. We'll notify you of any such change.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">With Your Consent</h3>
                <p className="text-gray-700">We may share your information with other parties when you explicitly consent to do so.</p>
              </div>
            </div>
          </section>

          {/* 4. Data Security */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            
            <p className="text-gray-700 mb-4">We implement comprehensive security measures to protect your personal information:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>SSL encryption for all data transmitted on our website</li>
              <li>Secure payment gateways with PCI DSS compliance</li>
              <li>Regular security audits and updates</li>
              <li>Restricted access to personal information</li>
              <li>Secure password storage with encryption</li>
              <li>Regular employee training on data privacy</li>
            </ul>
            <p className="text-gray-700 mt-4">While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
          </section>

          {/* 5. Cookies */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking Technologies</h2>
            
            <p className="text-gray-700 mb-4">We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Remember your preferences and login information</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Deliver personalized content and advertisements</li>
              <li>Prevent fraud and improve security</li>
            </ul>
            <p className="text-gray-700 mt-4">You can control cookies through your browser settings. Disabling cookies may affect some features of our website.</p>
          </section>

          {/* 6. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Privacy Rights</h2>
            
            <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request corrections to inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li><strong>Opt-Out:</strong> Opt out of marketing communications and data processing</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
            </ul>
            <p className="text-gray-700 mt-4">To exercise these rights, contact us at <strong>admin@nextgen.com</strong>.</p>
          </section>

          {/* 7. Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
            
            <p className="text-gray-700">Our website is not intended for children under 13 years old. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information and terminate the child's account immediately. If you believe a child has provided us with information, please contact us at <strong>admin@nextgen.com</strong>.</p>
          </section>

          {/* 8. International Transfers */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. International Data Transfers</h2>
            
            <p className="text-gray-700">Currently, our services are available in Pakistan. If we expand internationally, we will ensure that international data transfers comply with applicable laws and regulations. By using our website, you consent to the collection and use of your information in Pakistan.</p>
          </section>

          {/* 9. Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Third-Party Links</h2>
            
            <p className="text-gray-700">Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites before providing personal information.</p>
          </section>

          {/* 10. Marketing Communications */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Marketing Communications</h2>
            
            <p className="text-gray-700 mb-4">We may send you promotional emails, SMS messages, and notifications about our products and services. You can opt out of these communications at any time by:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Clicking "Unsubscribe" in promotional emails</li>
              <li>Replying "STOP" to SMS messages</li>
              <li>Updating your notification preferences in your account settings</li>
              <li>Contacting us at admin@nextgen.com</li>
            </ul>
          </section>

          {/* 11. Data Retention */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Data Retention</h2>
            
            <p className="text-gray-700">We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Order records: 2 years for accounting and legal purposes</li>
              <li>Account information: Until you request deletion</li>
              <li>Marketing data: Until you opt out</li>
              <li>Support records: 1 year after last interaction</li>
            </ul>
            <p className="text-gray-700 mt-4">We may retain aggregated or anonymized data indefinitely for analytics and business purposes.</p>
          </section>

          {/* 12. Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
            
            <p className="text-gray-700">We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by email or posting the updated policy on our website with a new "Last Updated" date. Your continued use of our website after changes indicates your acceptance of the updated Privacy Policy.</p>
          </section>

          {/* 13. Contact Us */}
          <section>
            <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
            
            <p className="text-gray-700 mb-4">If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:</p>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-3 text-gray-700">
              <div>
                <p className="font-semibold">Email:</p>
                <a href="mailto:admin@nextgen.com" className="text-blue-600 hover:underline">admin@nextgen.com</a>
              </div>
              <div>
                <p className="font-semibold">Phone:</p>
                <a href="tel:+923001234567" className="text-blue-600 hover:underline">+92 300 1234567</a>
              </div>
              <div>
                <p className="font-semibold">Address:</p>
                <p>Karachi, Pakistan</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer CTA */}
        <div className="mt-16 bg-black text-white p-8 rounded-lg text-center">
          <p className="mb-4">Have privacy concerns?</p>
          <a
            href="mailto:admin@nextgen.com"
            className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 inline-block"
          >
            Contact Our Privacy Team
          </a>
        </div>

      </div>
    </div>
  );
}
