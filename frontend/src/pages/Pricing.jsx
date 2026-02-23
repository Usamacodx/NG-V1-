import { Link } from "react-router-dom";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-gray-300 hover:text-white mb-4 inline-block">← Back Home</Link>
          <h1 className="text-4xl font-bold mb-2">Pricing</h1>
          <p className="text-gray-300">Transparent Pricing for Quality Custom Apparel</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Base Pricing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Base Product Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4">T-Shirt</h3>
              <p className="text-3xl font-bold text-black mb-4">Rs. 599</p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> 100% Cotton</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Comfortable Fit</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> All Sizes Available</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Multiple Colors</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Hoodie</h3>
              <p className="text-3xl font-bold text-black mb-4">Rs. 1,299</p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Premium Blend</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Front Pouch</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Drawstring</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> XS to XXL</li>
              </ul>
            </div>

      

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Polo Shirt</h3>
              <p className="text-3xl font-bold text-black mb-4">Rs. 799</p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Pique Cotton</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Collar Design</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Professional Look</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> XS to XXL</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Sweatshirt</h3>
              <p className="text-3xl font-bold text-black mb-4">Rs. 999</p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Soft Fleece</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Cozy Warm</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Crew Neck</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> XS to XXL</li>
              </ul>
            </div>

      

          </div>
        </section>

        {/* Customization Charges */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Customization Charges</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Customization Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Price Per Side</th>
                  <th className="px-6 py-4 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-semibold">Text Design</td>
                  <td className="px-6 py-4 font-bold text-lg text-green-600">Rs. 200</td>
                  <td className="px-6 py-4">Add custom text with your choice of fonts and colors</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Logo Upload</td>
                  <td className="px-6 py-4 font-bold text-lg text-green-600">Rs. 300</td>
                  <td className="px-6 py-4">Upload and place your company or personal logo</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold">Sticker Addition</td>
                  <td className="px-6 py-4 font-bold text-lg text-green-600">Rs. 150</td>
                  <td className="px-6 py-4">Add decorative stickers to enhance your design</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-gray-700">
            <strong>Note:</strong> You can combine multiple customizations on the same product. Charges apply per side (front/back).
          </p>
        </section>

        {/* Bulk Order Discounts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Bulk Order Discounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-400">
              <h3 className="text-xl font-bold mb-2">5-10 Units</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">5% OFF</p>
              <p className="text-gray-700">Great for small teams or gifts</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-400">
              <h3 className="text-xl font-bold mb-2">11-25 Units</h3>
              <p className="text-3xl font-bold text-green-600 mb-4">10% OFF</p>
              <p className="text-gray-700">Perfect for corporate gifting</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-400">
              <h3 className="text-xl font-bold mb-2">26-50 Units</h3>
              <p className="text-3xl font-bold text-purple-600 mb-4">15% OFF</p>
              <p className="text-gray-700">Ideal for events and campaigns</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-400">
              <h3 className="text-xl font-bold mb-2">50+ Units</h3>
              <p className="text-3xl font-bold text-orange-600 mb-4">20% OFF</p>
              <p className="text-gray-700">Contact us for custom quotes</p>
            </div>

          </div>
        </section>

        {/* Shipping Costs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Shipping Costs</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Standard Shipping</h3>
                <p className="text-2xl font-bold text-black mb-2">Rs. 250</p>
                <p className="text-gray-700">5-7 business days delivery</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Express Shipping</h3>
                <p className="text-2xl font-bold text-black mb-2">Rs. 500</p>
                <p className="text-gray-700">2-3 business days delivery</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Same Day Delivery</h3>
                <p className="text-2xl font-bold text-black mb-2">Rs. 750</p>
                <p className="text-gray-700">Karachi only (Order before 12 PM)</p>
              </div>
            </div>
            <p className="mt-6 text-gray-700">
              <strong>Free Shipping:</strong> Orders above Rs. 5000 get free standard shipping!
            </p>
          </div>
        </section>

        {/* Example Pricing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Example Order Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-6">Custom T-Shirt</h3>
              <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex justify-between">
                  <span>T-Shirt (Base)</span>
                  <span className="font-semibold">Rs. 599</span>
                </div>
                <div className="flex justify-between">
                  <span>Text Design (Front)</span>
                  <span className="font-semibold">Rs. 200</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-semibold">Rs. 250</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-3xl font-bold text-green-600">Rs. 1,049</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-6">Hoodie + Logo</h3>
              <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex justify-between">
                  <span>Hoodie (Base)</span>
                  <span className="font-semibold">Rs. 1,299</span>
                </div>
                <div className="flex justify-between">
                  <span>Logo Upload (Front)</span>
                  <span className="font-semibold">Rs. 300</span>
                </div>
                <div className="flex justify-between">
                  <span>Text (Back)</span>
                  <span className="font-semibold">Rs. 200</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-semibold">Rs. 500</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-3xl font-bold text-green-600">Rs. 2,299</span>
              </div>
            </div>

          </div>
        </section>

        {/* CTA */}
        <div className="bg-black text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Create Your Custom Apparel?</h2>
          <Link to="/products" className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 inline-block">
            Start Designing Now
          </Link>
        </div>

      </div>
    </div>
  );
}
