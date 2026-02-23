import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-gray-300 hover:text-white mb-4 inline-block">← Back Home</Link>
          <h1 className="text-4xl font-bold mb-2">How It Works</h1>
          <p className="text-gray-300">Create Custom Apparel in 4 Easy Steps</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-lg border-2 border-black text-center">
            <div className="text-4xl font-bold text-black mb-4">1</div>
            <h3 className="text-xl font-bold mb-2">Choose a Product</h3>
            <p className="text-gray-700">Browse our collection of t-shirts, hoodies, caps, and more.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-lg border-2 border-black text-center">
            <div className="text-4xl font-bold text-black mb-4">2</div>
            <h3 className="text-xl font-bold mb-2">Design It</h3>
            <p className="text-gray-700">Use our design studio to add text, logos, stickers, and colors.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-lg border-2 border-black text-center">
            <div className="text-4xl font-bold text-black mb-4">3</div>
            <h3 className="text-xl font-bold mb-2">Review & Order</h3>
            <p className="text-gray-700">Preview your design and add to cart with your preferred size.</p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-8 rounded-lg border-2 border-black text-center">
            <div className="text-4xl font-bold text-black mb-4">4</div>
            <h3 className="text-xl font-bold mb-2">Get Delivered</h3>
            <p className="text-gray-700">Receive your custom apparel at your doorstep.</p>
          </div>
        </div>

        {/* Detailed Steps */}
        <section className="space-y-12">
          
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Step 1: Choose a Product</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Browse our product catalog including t-shirts, hoodies, caps, and more</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>View detailed product images and specifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Read customer reviews and ratings</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Click "Customize" to start designing your item</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Step 2: Design Your Apparel</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span><strong>Add Text:</strong> Type your message and customize font, size, and color</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span><strong>Upload Logo:</strong> Add your company or personal logo</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span><strong>Choose Stickers:</strong> Add decorative stickers to enhance your design</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span><strong>Customize Colors:</strong> Pick from 26+ color options</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span><strong>Design Both Sides:</strong> Create unique front and back designs</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span><strong>Save & Download:</strong> Export your design in PNG, JPG, or PDF</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Step 3: Review & Order</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>View your final design preview from multiple angles</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Select your preferred size (XS to XXL)</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Choose quantity for bulk orders</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Add special instructions or notes</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Review pricing and add to cart</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Step 4: Checkout & Delivery</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Proceed to secure checkout</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Enter shipping and billing information</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Choose your payment method</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Receive order confirmation via email</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Track your shipment and receive updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-black font-bold mr-3">•</span>
                <span>Enjoy your custom apparel!</span>
              </li>
            </ul>
          </div>

        </section>

        {/* FAQ Link */}
        <div className="mt-12 bg-black text-white p-8 rounded-lg text-center">
          <p className="mb-4">Have questions about the process?</p>
          <Link to="/faqs" className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 inline-block">
            Check Our FAQs
          </Link>
        </div>

      </div>
    </div>
  );
}
