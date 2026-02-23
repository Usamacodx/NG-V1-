import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
                NG
              </div>
              <span className="font-semibold">NextGen</span>
            </div>
            <p className="text-sm text-gray-300">
              Custom apparel designed your way. Quality you can trust.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/about" className="hover:underline">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:underline">How It Works</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:underline">Pricing</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:underline">FAQs</Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:underline">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/contact" className="hover:underline">Contact Us</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:underline">Shipping</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:underline">Returns</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Mail size={16} /> admin@nextgen.com
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} /> +92 3497994442
                              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} /> Karachi, Pakistan
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2025 NextGen Custom Apparel. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              <Facebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors"
            >
              <Instagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <Twitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;