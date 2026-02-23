import { Link } from "react-router-dom";
import { Truck, Clock, MapPin } from "lucide-react";

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-gray-300 hover:text-white mb-4 inline-block">← Back Home</Link>
          <h1 className="text-4xl font-bold mb-2">Shipping Information</h1>
          <p className="text-gray-300">Fast, Reliable Delivery</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Shipping Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-8 rounded-lg border-2 border-black">
              <Truck className="mb-4" size={32} />
              <h3 className="text-2xl font-bold mb-4">Standard Shipping</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-semibold text-black">Cost: Rs. 250</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Delivery Time</p>
                  <p>5-7 Business Days</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Coverage</p>
                  <p>All over Pakistan</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border-2 border-blue-500">
              <Truck className="mb-4 text-blue-500" size={32} />
              <h3 className="text-2xl font-bold mb-4">Express Shipping</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-semibold text-black">Cost: Rs. 500</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Delivery Time</p>
                  <p>2-3 Business Days</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Coverage</p>
                  <p>All major cities</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border-2 border-red-500">
              <Clock className="mb-4 text-red-500" size={32} />
              <h3 className="text-2xl font-bold mb-4">Same Day Delivery</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-semibold text-black">Cost: Rs. 750</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Delivery Time</p>
                  <p>Same Day (by 8 PM)</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Coverage</p>
                  <p>Karachi only*</p>
                </div>
              </div>
            </div>

          </div>
          <p className="mt-6 text-gray-700 bg-blue-50 p-4 rounded border border-blue-200">
            <strong>*Same Day Delivery Note:</strong> Orders must be placed before 12:00 PM (noon) for same-day delivery in Karachi. Orders after this time will be delivered the next morning.
          </p>
        </section>

        {/* Free Shipping */}
        <section className="mb-16 bg-green-50 p-8 rounded-lg border-2 border-green-500">
          <h2 className="text-2xl font-bold mb-4 text-green-800">🎉 Free Shipping Offer</h2>
          <p className="text-lg text-gray-700 mb-4">
            Get <strong>FREE Standard Shipping</strong> on orders above <strong>Rs. 5,000</strong>!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <div className="flex items-start">
              <span className="text-2xl mr-3">✓</span>
              <span>No minimum order quantity required</span>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✓</span>
              <span>Applies to all products</span>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✓</span>
              <span>Delivered to your door</span>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Service Areas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <MapPin className="mb-4 text-black" size={32} />
              <h3 className="text-xl font-bold mb-4">Available Regions</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Sindh</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Punjab</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Khyber Pakhtunkhwa</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Balochistan</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Gilgit-Baltistan</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Major Cities Covered</h3>
              <div className="grid grid-cols-2 gap-3 text-gray-700">
                <div>
                  <p className="font-semibold">Karachi</p>
                  <p className="text-sm text-gray-600">All areas</p>
                </div>
                <div>
                  <p className="font-semibold">Lahore</p>
                  <p className="text-sm text-gray-600">All areas</p>
                </div>
                <div>
                  <p className="font-semibold">Islamabad</p>
                  <p className="text-sm text-gray-600">All areas</p>
                </div>
                <div>
                  <p className="font-semibold">Peshawar</p>
                  <p className="text-sm text-gray-600">Main areas</p>
                </div>
                <div>
                  <p className="font-semibold">Quetta</p>
                  <p className="text-sm text-gray-600">Main areas</p>
                </div>
                <div>
                  <p className="font-semibold">Multan</p>
                  <p className="text-sm text-gray-600">Main areas</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Tracking */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Order Tracking</h2>
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">📧 Automatic Email Updates</h3>
                <p>You'll receive email notifications at each stage:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Order confirmed</li>
                  <li>Order shipped with tracking link</li>
                  <li>Out for delivery</li>
                  <li>Delivery completed</li>
                </ul>
              </div>
              <div className="border-t-2 border-gray-200 pt-4">
                <h3 className="font-semibold text-lg mb-2">🔗 Real-Time Tracking</h3>
                <p>Click the tracking link in your email to monitor your package in real-time. You can see the exact location and estimated delivery time.</p>
              </div>
              <div className="border-t-2 border-gray-200 pt-4">
                <h3 className="font-semibold text-lg mb-2">📱 WhatsApp Updates</h3>
                <p>Get WhatsApp notifications at each milestone. Provide your WhatsApp number at checkout for faster updates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Shipping FAQs</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">What happens if my order is damaged?</h3>
              <p className="text-gray-700">If your order arrives damaged, take photos and contact us immediately. We'll send a replacement or refund at no extra cost.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Can I change my delivery address?</h3>
              <p className="text-gray-700">If your order hasn't been shipped yet, you can change the address. Contact us within 2 hours of placing the order with your order number and new address.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">What if I'm not home when the delivery arrives?</h3>
              <p className="text-gray-700">Our delivery partner will leave a notice or attempt delivery again the next day. You can also coordinate with them via WhatsApp or phone during tracking.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Do you ship to P.O. boxes?</h3>
              <p className="text-gray-700">We can ship to P.O. boxes for express and standard shipping, but not for same-day delivery. Please ensure your P.O. box location is in a covered area.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">What's the refund if I refuse delivery?</h3>
              <p className="text-gray-700">Shipping charges are non-refundable if you refuse delivery. Product refund will be processed after inspection. A 10% restocking fee may apply.</p>
            </div>

          </div>
        </section>

        {/* Contact */}
        <div className="bg-black text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with Shipping?</h2>
          <p className="text-gray-300 mb-6">Contact our support team for assistance</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="mailto:admin@nextgen.com"
              className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200"
            >
              Email Support
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
