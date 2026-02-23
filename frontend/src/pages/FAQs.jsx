import { useState } from "react";
import { Link } from "react-router-dom";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How long does it take to design my apparel?",
      answer: "You can design your apparel in as little as 5-10 minutes using our intuitive design studio. The design process is completely up to you - take your time or create something quickly!"
    },
    {
      question: "What file formats can I download my design in?",
      answer: "You can download your design in PNG, JPG, or PDF formats. These are compatible with most printers and design software."
    },
    {
      question: "Can I design both the front and back of the apparel?",
      answer: "Yes! You can switch between front and back views to customize both sides of your product independently. Each side can have different text, logos, and stickers."
    },
    {
      question: "What is the minimum order quantity?",
      answer: "The minimum order quantity is 1 item. However, we offer bulk discounts for orders of 5 or more items."
    },
    {
      question: "How much does shipping cost?",
      answer: "Standard shipping costs Rs. 250 (5-7 days), Express shipping is Rs. 500 (2-3 days), and Same Day Delivery is Rs. 750 (Karachi only). Orders over Rs. 5000 get free standard shipping!"
    },
    {
      question: "Can I use my own logo or image?",
      answer: "Absolutely! You can upload your own logo or image during the design process. Make sure it's a clear image (PNG or JPG) for best results."
    },
    {
      question: "What happens if I'm not satisfied with the quality?",
      answer: "We offer a 30-day return policy if you're not satisfied with the quality of your order. Contact our support team with photos of the issue, and we'll help resolve it."
    },
    {
      question: "How do I care for my custom apparel?",
      answer: "Machine wash in cold water with similar colors, tumble dry on low heat, and avoid bleach. For best results, turn the garment inside out before washing to protect the print."
    },
    {
      question: "Can I order customized apparel for corporate gifts?",
      answer: "Yes! We specialize in bulk corporate orders with custom branding. Contact our sales team at admin@nextgen.com for bulk order pricing and customization options."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including credit/debit cards, online banking, and mobile wallets. Your payment is secure and encrypted."
    },
    {
      question: "Can I edit my order after placing it?",
      answer: "If your order hasn't been shipped yet, you can contact our support team within 2 hours to make changes. Please provide your order number and the changes you'd like to make."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship within Pakistan only. We're planning to expand to international shipping soon. Subscribe to our newsletter for updates!"
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking link via email. You can use this link to monitor your package's delivery status in real-time."
    },
    {
      question: "What if I need urgent/rush orders?",
      answer: "We offer express production for rush orders. Contact us directly at admin@nextgen.com with your requirements, and we'll provide a custom quote."
    },
    {
      question: "Are the colors exactly as shown on screen?",
      answer: "Colors may vary slightly due to screen display differences and lighting conditions. We ensure our printing matches the colors as closely as possible. If there's a significant difference, we offer replacement options."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-gray-300 hover:text-white mb-4 inline-block">← Back Home</Link>
          <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-300">Find answers to common questions about our services</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-left text-gray-800">{faq.question}</h3>
                <span className={`text-2xl transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-black text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-300 mb-6">Our support team is here to help!</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="mailto:admin@nextgen.com"
              className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 inline-block"
            >
              Email Us
            </a>
            <a
              href="tel:+923001234567"
              className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 inline-block"
            >
              Call Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
