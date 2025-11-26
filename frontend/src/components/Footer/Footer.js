'use client';

import { Shield, Globe, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, IndianRupee, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Logo + Tagline */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-linear-to-br from-indigo-500 to-blue-600 text-white font-bold text-2xl w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                OM
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">Omm Documentation</h3>
                <p className="text-xs text-gray-400">India's First Online e-Notary</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get your legal documents notarized online from anywhere in the world. 
              100% court-accepted • Supreme Court Approved • Fully Digital.
            </p>

            {/* Trust Badge */}
            <div className="mt-6 inline-flex items-center gap-2 bg-green-900/50 text-green-300 px-4 py-2 rounded-full text-sm font-medium border border-green-800">
              <Shield className="w-4 h-4" />
              Supreme Court & All High Courts Approved
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-indigo-400">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              <li><a href="/resources" className="hover:text-white transition">Resources</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          {/* <div>
            <h4 className="text-lg font-bold mb-6 text-indigo-400">Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#documents" className="hover:text-white transition">All Documents</a></li>
              <li><a href="#affidavit" className="hover:text-white transition">Online Affidavit</a></li>
              <li><a href="#poa" className="hover:text-white transition">Power of Attorney</a></li>
              <li><a href="#agreement" className="hover:text-white transition">Agreements</a></li>
              <li><a href="#corporate" className="hover:text-white transition">Corporate Plans</a></li>
            </ul>
          </div> */}

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-indigo-400">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="/refund" className="hover:text-white transition">Refund Policy</a></li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-indigo-400">Contact Us</h4>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400" />
                <span>+91 9898989898</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <span>support@ommdocumentation.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-400" />
                <span>24×7 Live Support</span>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 mt-6">
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-indigo-600 transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-indigo-600 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-indigo-600 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-indigo-600 transition">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <p>&copy; 2025 Omm Documentation. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Made in</span>
              <span className="text-2xl">India</span>
            </div>
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              UPI • Cards • Netbanking
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <Lock className="w-4 h-4" />
              256-bit SSL Encrypted
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}