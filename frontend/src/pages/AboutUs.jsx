import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-gray-300 hover:text-white mb-4 inline-block">← Back Home</Link>
          <h1 className="text-4xl font-bold mb-2">About NextGen</h1>
          <p className="text-gray-300">Custom Apparel Designed Your Way</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At NextGen Custom Apparel, our mission is to empower individuals and businesses to express themselves through custom-designed clothing. We believe that every design tells a story, and we're here to bring those stories to life with the highest quality materials and craftsmanship.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Founded in 2026, NextGen Custom Apparel is a modern design studio specializing in personalized clothing and merchandise. We combine cutting-edge design technology with traditional craftsmanship to create unique, high-quality custom apparel.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our team consists of talented designers, production specialists, and customer service professionals dedicated to delivering exceptional results for every project.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-2xl mr-4">✓</span>
              <div>
                <h3 className="font-semibold text-lg">Quality Materials</h3>
                <p className="text-gray-700">We use premium fabrics and printing techniques to ensure your designs last.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-4">✓</span>
              <div>
                <h3 className="font-semibold text-lg">Easy Design Studio</h3>
                <p className="text-gray-700">Our intuitive design tool makes it easy for anyone to create professional-looking apparel.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-4">✓</span>
              <div>
                <h3 className="font-semibold text-lg">Fast Turnaround</h3>
                <p className="text-gray-700">Quick production and shipping times without compromising quality.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-4">✓</span>
              <div>
                <h3 className="font-semibold text-lg">Affordable Pricing</h3>
                <p className="text-gray-700">Competitive prices for both individual and bulk orders.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-4">✓</span>
              <div>
                <h3 className="font-semibold text-lg">Dedicated Support</h3>
                <p className="text-gray-700">Our customer service team is here to help at every step.</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Creativity</h3>
              <p className="text-gray-700">We believe in fostering creativity and helping our customers bring their visions to life.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Quality</h3>
              <p className="text-gray-700">Every product is crafted with attention to detail and commitment to excellence.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Integrity</h3>
              <p className="text-gray-700">We maintain transparent pricing and honest communication with all our customers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Innovation</h3>
              <p className="text-gray-700">We continuously improve our technology and processes to serve you better.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
