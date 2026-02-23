import { Link } from "react-router-dom";
import { RotateCcw, Clock, PackageX } from "lucide-react";

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-gray-300 hover:text-white mb-4 inline-block">← Back Home</Link>
          <h1 className="text-4xl font-bold mb-2">Returns & Refunds</h1>
          <p className="text-gray-300">Easy Returns and Full Satisfaction Guarantee</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Return Policy Overview */}
        <section className="mb-16 bg-green-50 p-8 rounded-lg border-2 border-green-500">
          <h2 className="text-2xl font-bold mb-4 text-green-800">✓ 30-Day Money-Back Guarantee</h2>
          <p className="text-lg text-gray-700">
            If you're not satisfied with your order for any reason, we'll process a full refund within 30 days of purchase.
          </p>
        </section>

        {/* Return Reasons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Valid Reasons for Return</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <PackageX className="mr-2 text-red-500" />
                Damaged or Defective
              </h3>
              <p className="text-gray-700">
                Product arrived damaged, torn, or with printing defects. Provide photos of the damage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <RotateCcw className="mr-2 text-orange-500" />
                Wrong Item
              </h3>
              <p className="text-gray-700">
                Received incorrect item or size. We'll send the correct one immediately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="mr-2 text-blue-500" />
                Quality Not As Expected
              </h3>
              <p className="text-gray-700">
                Material quality, fit, or printing quality doesn't meet expectations. Return and get refund.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <RotateCcw className="mr-2 text-purple-500" />
                Change of Mind
              </h3>
              <p className="text-gray-700">
                Simply don't want it. Return within 7 days in original condition for 10% restocking fee.
              </p>
            </div>

          </div>
        </section>

        {/* Return Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">How to Return an Item</h2>
          
          <div className="space-y-6">
            
            <div className="bg-white p-8 rounded-lg border-l-4 border-black">
              <div className="flex items-start gap-4">
                <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Contact Us</h3>
                  <p className="text-gray-700">
                    Email us at <strong>admin@nextgen.com</strong> or call <strong>+92 300 1234567</strong> with your order number and reason for return within 30 days of purchase.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border-l-4 border-black">
              <div className="flex items-start gap-4">
                <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Get Return Authorization</h3>
                  <p className="text-gray-700">
                    We'll review your request and issue a Return Authorization (RA) number. In case of damage, provide clear photos for faster approval.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border-l-4 border-black">
              <div className="flex items-start gap-4">
                <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Ship the Item Back</h3>
                  <p className="text-gray-700">
                    Pack the item securely in its original packaging (if possible). Write your RA number clearly on the package. Ship it back to our address at your own cost.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border-l-4 border-black">
              <div className="flex items-start gap-4">
                <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Inspection & Refund</h3>
                  <p className="text-gray-700">
                    Once we receive your return, we'll inspect the item within 5 business days. If approved, we'll process your refund within 7-10 business days.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Return Address */}
        <section className="mb-16 bg-white p-8 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Return Shipping Address</h2>
          <div className="bg-gray-50 p-6 rounded border border-gray-300">
            <p className="text-gray-800 font-semibold mb-2">NextGen Custom Apparel</p>
            <p className="text-gray-700">Karachi, Pakistan</p>
            <p className="text-gray-700 mt-4 text-sm">
              <strong>Note:</strong> Always include your Return Authorization (RA) number inside the package for quick processing.
            </p>
          </div>
        </section>

        {/* Conditions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Return Conditions</h2>
          
          <div className="space-y-4">
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">✓ Returnable</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Damaged or defective items - Full refund</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Wrong item or size - Full refund</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Quality issues - Full refund</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Change of mind (within 7 days) - Refund minus 10% restocking fee</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">✗ Non-Returnable</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Items with visible signs of wear or washing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Custom orders outside the 30-day window</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Items returned without RA number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Severely damaged items (beyond repair/resale)</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Refund Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Refund Timeline</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Stage</th>
                  <th className="px-6 py-4 text-left font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">Contact us about return</td>
                  <td className="px-6 py-4">Within 30 days of purchase</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4">Receive RA number</td>
                  <td className="px-6 py-4">Within 24 hours</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Ship item back</td>
                  <td className="px-6 py-4">At your convenience</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4">Item inspection</td>
                  <td className="px-6 py-4">5 business days from receipt</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Refund processing</td>
                  <td className="px-6 py-4">7-10 business days after approval</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Return FAQs</h2>
          
          <div className="space-y-4">
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Do I have to return in original packaging?</h3>
              <p className="text-gray-700">Not necessary, but recommended. Any secure packaging that protects the item is fine. Just include your RA number.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Who pays for return shipping?</h3>
              <p className="text-gray-700">For damaged/defective items, we'll provide a prepaid shipping label. For change of mind returns, you cover shipping costs.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">When will I receive my refund?</h3>
              <p className="text-gray-700">After we inspect and approve your return, refund processing takes 7-10 business days. The refund goes back to your original payment method.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Can I exchange instead of getting a refund?</h3>
              <p className="text-gray-700">Yes! If you want a different size or color, we can arrange an exchange. Just mention this when contacting us about the return.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">What if the item is partially damaged?</h3>
              <p className="text-gray-700">Send us clear photos of the damage. Depending on severity, we may offer a partial refund instead of full return.</p>
            </div>

          </div>
        </section>

        {/* Contact */}
        <div className="bg-black text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Returns?</h2>
          <p className="text-gray-300 mb-6">Our team is here to help</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="mailto:admin@nextgen.com"
              className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200"
            >
              Email Us
            </a>
            <a
              href="tel:+923001234567"
              className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200"
            >
              Call Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
