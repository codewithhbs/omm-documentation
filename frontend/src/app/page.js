'use client';

import { motion } from 'framer-motion';
import { Shield, Globe, Clock, FileText, Video, Download, CheckCircle, ArrowRight, Gavel, Lock, Users, Headphones, ChevronDown, Landmark, Zap, Award, IndianRupee } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* Hero Section - SEO Optimized */}
      <section className="relative bg-linear-to-b from-indigo-50 via-white to-blue-50 overflow-hidden">
        <div className="container mx-auto px-6 pt-12 md:pt-16 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-8"
          >
            <Shield className="w-5 h-5" /> Supreme Court & All High Courts Approved
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight max-w-6xl mx-auto"
          >
            India's First & Only Court-Approved<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-700">
              Online e-Notary Platform
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            Get your Affidavits, Power of Attorney, Agreements & all legal documents notarized online from anywhere in the world — 
            Dubai, USA, UK, Canada, Singapore, Australia — in just 15-30 minutes via video call. 
            100% legally valid • Court accepted across India • No physical presence required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button className="px-8 py-4 md:py-0 bg-linear-to-r from-indigo-600 to-blue-700 text-white font-bold rounded-full shadow-2xl hover:shadow-indigo-500/50 transition transform hover:scale-105 flex items-center gap-3">
              Book Appointment Now <ArrowRight className="w-6 h-6" />
            </button>
            <button className="px-10 py-4 border-2 border-indigo-600 text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition flex items-center gap-3">
              <Headphones className="w-5 h-5" /> Live Support 24×7
            </button>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-6 text-center">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center text-sm font-medium text-gray-600">
            <div><CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" /> Supreme Court Approved</div>
            <div><Award className="w-8 h-8 mx-auto mb-2 text-blue-600" /> 5000+ Documents Notarized</div>
            <div><Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" /> Trusted by 200+ Law Firms</div>
            <div><Lock className="w-8 h-8 mx-auto mb-2 text-red-600" /> Bank-Grade Encryption</div>
            <div><Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" /> Instant Delivery</div>
            <div><Globe className="w-8 h-8 mx-auto mb-2 text-purple-600" /> 50+ Countries Served</div>
          </div>
        </div>
      </section>

      {/* Court Orders */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Legally Accepted Across India</h2>
          <p className="text-center text-gray-600 text-lg mb-12">Our online notarization has been upheld by the highest courts</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { court: "Supreme Court of India", case: "Writ Petition (Civil) No. 791 of 2023", desc: "Online notarization declared valid" },
              { court: "Delhi High Court", case: "CM(M) 123/2024", desc: "e-Notary documents accepted as original" },
              { court: "Bombay High Court", case: "Multiple immigration & property cases", desc: "Accepted in 1000+ matters" },
            ].map((c, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl shadow-xl">
                <Landmark className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold">{c.court}</h3>
                <p className="text-sm text-gray-500 mt-2">{c.case}</p>
                <p className="text-gray-700 mt-4">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents We Notarize - SEO Goldmine */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">Documents We Notarize Online</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              "General Affidavit", "Income Affidavit", "Name Change Affidavit", "Address Proof Affidavit",
              "Power of Attorney (General)", "Special Power of Attorney", "Property PoA", "Medical PoA",
              "Sale Agreement", "Rent Agreement", "Leave & License", "NOC from Landlord",
              "Undertaking Letter", "Declaration", "Indemnity Bond", "Guarantee Letter",
              "Employment Documents", "Education Certificates", "Marriage Certificate", "All Legal Documents"
            ].map((doc, i) => (
              <div key={i} className="p-6 bg-linear-to-br from-indigo-50 to-blue-50 rounded-xl hover:shadow-lg transition">
                <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                <p className="font-medium">{doc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">How Online Notarization Works</h2>
          <div className="grid md:grid-cols-4 gap-10 text-center">
            {[
              { step: "1", title: "Upload Document", desc: "Fill form & upload your document", icon: FileText },
              { step: "2", title: "Identity Verification", desc: "Verify via Aadhaar/Passport", icon: Shield },
              { step: "3", title: "Video Call with Notary", desc: "Live verification in 5 minutes", icon: Video },
              { step: "4", title: "Get Notarized Document", desc: "Download instantly with digital stamp", icon: Download },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-5xl font-bold text-indigo-100 mb-4">{s.step}</div>
                <s.icon className="w-15 h-15 text-indigo-600 mx-auto my-6" />
                <h3 className="text-1xl font-bold">{s.title}</h3>
                <p className="text-gray-600 mt-3">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Simple & Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { plan: "Single Person", price: "₹799", per: "+GST", desc: "1 document • 1 signer" },
              { plan: "Two Persons", price: "₹1,299", per: "+GST", desc: "1 document • 2 signers" },
              { plan: "Corporate Plan", price: "Custom", per: "", desc: "Bulk & law firms • Special rates" },
            ].map((p, i) => (
              <div key={i} className={`p-10 rounded-3xl shadow-2xl border-4 ${i === 1 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                {i === 1 && <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">Most Popular</span>}
                <h3 className="text-2xl font-bold mt-4">{p.plan}</h3>
                <p className="text-4xl font-bold text-indigo-600 my-4">{p.price} <span className="text-lg text-gray-600">{p.per}</span></p>
                <p className="text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Rich Snippets Ready */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          {[
            { q: "Is online notarization legally valid in India?", a: "Yes. The Supreme Court and multiple High Courts have upheld the validity of electronically notarized documents." },
            { q: "Can I notarize documents from abroad?", a: "Absolutely. NRIs from UAE, USA, UK, Canada, Singapore, Australia, etc. use our platform daily." },
            { q: "How long does the process take?", a: "The entire process takes 15-30 minutes including video verification." },
            { q: "Do I need to visit any office?", a: "No. Everything is 100% online. No printing, scanning, or courier required." },
          ].map((faq, i) => (
            <div key={i} className="mb-4">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left p-6 bg-white rounded-2xl shadow-md flex justify-between items-center text font-semibold hover:bg-gray-50 transition">
                {faq.q}
                <ChevronDown className={`w-6 h-6 transition ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <div className="p-6 bg-indigo-50 rounded-2xl mt-2 text-gray-700">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-linear-to-r from-indigo-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Ready to Notarize Your Document Online?</h2>
          <p className="text-xl mb-12 opacity-90">Join 10,000+ satisfied users • Available 24×7 • Instant slots</p>
          <button className="px-12 py-6 bg-white text-indigo-600 font-bold text-xl rounded-full hover:scale-110 transition shadow-2xl transform">
            Book Your Slot Now <ArrowRight className="inline ml-3" />
          </button>
        </div>
      </section>
    </>
  );
}