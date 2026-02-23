import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-gray-300 hover:text-white mb-4 inline-block">← Back Home</Link>
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-300">Get in touch with our team</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Contact Info Cards */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <Mail className="mx-auto mb-4 text-black" size={32} />
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <a href="mailto:admin@nextgen.com" className="text-blue-600 hover:underline">
              admin@nextgen.com
            </a>
            <p className="text-gray-700 text-sm mt-2">Response within 24 hours</p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <Phone className="mx-auto mb-4 text-black" size={32} />
            <h3 className="text-lg font-semibold mb-2">Phone</h3>
            <a href="tel:+923001234567" className="text-blue-600 hover:underline">
              +92 300 1234567
            </a>
            <p className="text-gray-700 text-sm mt-2">Available 10 AM - 6 PM (PST)</p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <MapPin className="mx-auto mb-4 text-black" size={32} />
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p className="text-gray-700">
              Karachi, Pakistan
            </p>
            <p className="text-gray-700 text-sm mt-2">Available for visits by appointment</p>
          </div>

        </div>

        {/* Business Hours */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 mb-16">
          <div className="flex items-start gap-4">
            <Clock className="text-black mt-1" size={32} />
            <div>
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-semibold">Monday - Friday</p>
                  <p>10:00 AM - 6:00 PM (PST)</p>
                </div>
                <div>
                  <p className="font-semibold">Saturday</p>
                  <p>11:00 AM - 4:00 PM (PST)</p>
                </div>
                <div>
                  <p className="font-semibold">Sunday</p>
                  <p>Closed</p>
                </div>
                <div>
                  <p className="font-semibold">Public Holidays</p>
                  <p>Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            <p className="text-gray-700 mb-6">
              Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded">
                ✓ Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>

            </form>
          </div>

          {/* FAQ Link */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Common Questions?</h2>
            <p className="text-gray-700 mb-6">
              Before contacting us, please check our FAQs page where you might find quick answers to your questions.
            </p>
            
            <Link
              to="/faqs"
              className="block bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 text-center mb-8"
            >
              Visit FAQs
            </Link>

            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link to="/products" className="text-blue-600 hover:underline">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-blue-600 hover:underline">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-blue-600 hover:underline">
                  Pricing Information
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-blue-600 hover:underline">
                  Shipping Details
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-blue-600 hover:underline">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
