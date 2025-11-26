"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Globe, Mail, ArrowRight } from "lucide-react";

const SIGNATURE_TYPES = [
  { id: "aadhaar", label: "Aadhaar E-sign", currency: "INR" },
  { id: "dsc", label: "DSC", currency: "INR" },
  { id: "nekyc", label: "NE-KYC", currency: "USD" },
];

const BASE_PRICES = {
  aadhaar: 1000, // INR
  dsc: 5000, // INR
  nekyc: 100, // USD
};

function getTotalPrice(signatureType, signatories, documents) {
  let total = BASE_PRICES[signatureType] || 0;

  if (signatureType === "aadhaar") {
    if (signatories <= 2) total = 1000;
    else if (signatories <= 4) total = 1500;
    else total = 3000;
  } else if (signatureType === "dsc") {
    if (signatories <= 2) total = 5000;
    else if (signatories <= 4) total = 6000;
    else total = 8000;
  } else if (signatureType === "nekyc") {
    // Fixed 100 USD per appointment right now
    total = 100;
  }

  // multiple documents currently disabled on site, but keeping formula scalable
  return total * documents;
}

export default function Page() {
  const [signatureType, setSignatureType] = useState("aadhaar");
  const [signatories, setSignatories] = useState(1);
  const [documents, setDocuments] = useState(1);

  const basePrice = BASE_PRICES[signatureType];
  const { currency, label } =
    SIGNATURE_TYPES.find((t) => t.id === signatureType) || SIGNATURE_TYPES[0];

  const totalPrice = useMemo(
    () => getTotalPrice(signatureType, signatories, documents),
    [signatureType, signatories, documents]
  );

  return (
    <>
      {/* Hero Heading */}
      <section className="bg-linear-to-b from-indigo-50 to-white py-15">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6"
          >
            Simple & Transparent Pricing
          </motion.h1>
          <p className="text-xl md:text-xl text-gray-700 max-w-4xl mx-auto">
            Choose the method that works best for you. Limited-time 50% OFF on
            Aadhaar e-Sign & NE-KYC!
          </p>

          <div className="mt-10 inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold">
            <Shield className="w-6 h-6" />
            Omm Documentation is India's only trusted platform whose eNotarised
            documents have been accepted by courts in India.
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Plan 1: Aadhaar e-Sign (Most Popular) */}
            <motion.div
              whileHover={{ y: -10 }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-indigo-600"
            >
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-bl-2xl font-bold">
                MOST POPULAR
              </div>
              <div className="p-10 text-center">
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">
                  Aadhaar e-Sign
                </h3>
                <p className="text-gray-600 mb-6">
                  For Indian residents with Aadhaar
                </p>

                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-indigo-600">
                    ₹1,000
                  </span>
                  <span className="text-xl text-gray-500 line-through ml-3">
                    ₹2,000
                  </span>
                  <div className="mt-3 bg-red-100 text-red-700 px-4 py-1 rounded-full inline-block text-sm font-bold">
                    50% OFF (Limited Time)
                  </div>
                </div>

                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />{" "}
                    Mobile-linked Aadhaar required
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />{" "}
                    Max 10MB file size
                  </li>
                </ul>

                <h4 className="font-bold text-lg mb-4">
                  Additional Signatories
                </h4>
                <ul className="text-sm text-gray-600 space-y-2 mb-8">
                  <li>• Up to 2 signatories: ₹1,000</li>
                  <li>• Up to 4 signatories: ₹1,500</li>
                  <li>• Up to 9 signatories: ₹3,000</li>
                </ul>

                <a
                  href="/"
                  className="block w-full bg-linear-to-r from-indigo-600 to-blue-700 text-white font-bold py-5 rounded-xl hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  Get Started <ArrowRight className="w-6 h-6" />
                </a>
              </div>
            </motion.div>

            {/* Plan 2: DSC */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-10 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">DSC</h3>
                <p className="text-gray-600 mb-6">
                  Digital Signature Certificate
                </p>

                <div className="mb-10">
                  <span className="text-5xl font-extrabold text-gray-900">
                    ₹5,000
                  </span>
                  <span className="text-sm text-gray-500 block mt-2">
                    per appointment
                  </span>
                </div>

                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />{" "}
                    USB-based DSC required
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />{" "}
                    Max 10MB file size
                  </li>
                </ul>

                <h4 className="font-bold text-lg mb-4">
                  Additional Signatories
                </h4>
                <ul className="text-sm text-gray-600 space-y-2 mb-8">
                  <li>• Up to 2 signatories: ₹5,000</li>
                  <li>• Up to 4 signatories: ₹6,000</li>
                  <li>• Up to 9 signatories: ₹8,000</li>
                </ul>

                <a
                  href="/"
                  className="block w-full bg-gray-900 text-white font-bold py-5 rounded-xl hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  Get Started <ArrowRight className="w-6 h-6" />
                </a>
              </div>
            </motion.div>

            {/* Plan 3: NE-KYC (International) */}
            <motion.div
              whileHover={{ y: -10 }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-500"
            >
              <div className="absolute top-0 right-0 bg-green-600 text-white px-6 py-2 rounded-bl-2xl font-bold">
                50% OFF
              </div>
              <div className="p-10 text-center">
                <h3 className="text-2xl font-bold text-green-700 mb-2 flex items-center justify-center gap-2">
                  <Globe className="w-8 h-8" /> NE-KYC
                </h3>
                <p className="text-gray-600 mb-6">
                  For international users (NRIs)
                </p>

                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-green-600">
                    $100
                  </span>
                  <span className="text-xl text-gray-500 line-through ml-3">
                    $200
                  </span>
                  <div className="mt-3 bg-red-100 text-red-700 px-4 py-1 rounded-full inline-block text-sm font-bold">
                    50% OFF (Limited Time)
                  </div>
                </div>

                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />{" "}
                    Passport required (Aadhaar not needed)
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />{" "}
                    KYC video meeting
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />{" "}
                    Max 10MB file size
                  </li>
                </ul>

                <a
                  href="/"
                  className="block w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold py-5 rounded-xl hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  Get Started <ArrowRight className="w-6 h-6" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Need Help Choosing?</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Not sure which option is right for you? Have questions about our
            pricing or services?
            <br />
            We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="mailto:hello@ommdocumentation.com"
              className="flex items-center gap-3 text-indigo-600 font-bold hover:underline"
            >
              <Mail className="w-6 h-6" />
              hello@ommdocumentation.com
            </a>
            <span className="text-gray-500 hidden sm:block">|</span>
            <p className="text-gray-600">
              Need stamp paper? Custom slots? Bulk pricing?
              <br />
              Just email us — we’ve got you covered.
            </p>
          </div>
        </div>
      </section>

            {/* Calculate Your Price - Redesigned Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            {/* Heading + Subheading */}
            <div className="text-center mb-10">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3"
              >
                Calculate Your Price
              </motion.h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Use this smart calculator to estimate your cost based on{" "}
                <span className="font-semibold">signature type</span> and{" "}
                <span className="font-semibold">number of signatories</span>.
                Same rules as the plans above apply.
              </p>
            </div>

            {/* Layout: Calculator + Info */}
            <div className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 items-start">
              {/* Left: Calculator Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Price Calculator
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Adjust the options below to see your estimated price.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                    <Shield className="w-4 h-4" />
                    Court-accepted eNotarisation
                  </div>
                </div>

                {/* Type of Signature */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-2 uppercase">
                    Type of Signature
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SIGNATURE_TYPES.map((type) => {
                      const active = signatureType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSignatureType(type.id)}
                          className={`group relative border text-sm rounded-2xl px-3 py-3 text-left transition-all ${
                            active
                              ? "border-indigo-500 bg-indigo-50 shadow-sm"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-semibold ${
                                active ? "text-indigo-700" : "text-gray-800"
                              }`}
                            >
                              {type.label}
                            </span>
                            {active && (
                              <CheckCircle className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-gray-500">
                            {type.id === "aadhaar" &&
                              "Best for Indian residents"}
                            {type.id === "dsc" &&
                              "For users with DSC token"}
                            {type.id === "nekyc" &&
                              "For international / NRI users"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Number of Signatories */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-2 uppercase">
                    Number of Signatories
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={9}
                      value={signatories}
                      onChange={(e) =>
                        setSignatories(Number(e.target.value))
                      }
                      className="flex-1 accent-indigo-600"
                    />
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center justify-center w-11 h-11 border border-indigo-100 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold">
                        {signatories}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-1">
                        1–9 signers
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Pricing slabs change at{" "}
                    <span className="font-medium">2</span> and{" "}
                    <span className="font-medium">4</span> signatories, similar
                    to the plans above.
                  </p>
                </div>

                {/* Number of Documents */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-2 uppercase">
                    Number of Documents
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={1}
                      value={documents}
                      disabled
                      readOnly
                      className="flex-1 opacity-60 cursor-not-allowed"
                    />
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center justify-center w-11 h-11 border border-gray-200 bg-gray-50 text-gray-800 rounded-full text-sm font-semibold">
                        {documents}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-1">
                        Fixed
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-600 mt-1">
                    Multiple documents are currently disabled — pricing is per
                    appointment.
                  </p>
                </div>

                {/* Estimate Box */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    Your Estimate
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      Instant
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    {/* Left: Details */}
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium text-gray-600">
                          Selected plan:{" "}
                        </span>
                        <span className="text-gray-900">{label}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Base price:{" "}
                        </span>
                        <span className="text-gray-900">
                          {basePrice} {currency}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Signatories:{" "}
                        </span>
                        <span className="text-gray-900">
                          {signatories}{" "}
                          {signatories === 1 ? "person" : "people"}
                        </span>
                      </p>
                    </div>

                    {/* Right: Big Total */}
                    <div className="sm:text-right">
                      <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
                        Estimated total
                      </p>
                      <p className="text-3xl font-extrabold text-indigo-700">
                        {totalPrice} {currency}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Taxes, stamp paper & other add-ons (if any) are extra.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Helper / Info Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="bg-white rounded-3xl shadow-md border border-indigo-100 p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    How pricing works
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <span className="font-medium">Aadhaar e-Sign</span> and{" "}
                      <span className="font-medium">DSC</span> are billed in INR
                      per appointment.
                    </li>
                    <li>
                      • <span className="font-medium">NE-KYC</span> is billed in
                      USD for international users / NRIs.
                    </li>
                    <li>
                      • Additional signatories follow the same slabs as shown in
                      the pricing cards above.
                    </li>
                    <li>• One appointment covers one document at the moment.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-dashed border-gray-300 p-5 bg-gray-50">
                  <p className="text-sm text-gray-700">
                    Need{" "}
                    <span className="font-semibold">
                      custom slots, bulk pricing
                    </span>{" "}
                    or have a unique use case?
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Just drop us an email at{" "}
                    <a
                      href="mailto:hello@ommdocumentation.com"
                      className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
                    >
                      hello@ommdocumentation.com
                    </a>{" "}
                    and we'll share a tailored quote.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Final CTA */}
      {/* <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Notarize Your Document?</h2>
          <a
            href=""
            className="inline-flex items-center gap-4 px-12 py-6 bg-white text-indigo-600 font-bold text-xl rounded-full hover:scale-110 transition shadow-2xl"
          >
            Start Now — 50% OFF Ends Soon <ArrowRight className="w-8 h-8" />
          </a>
        </div>
      </section> */}
    </>
  );
}
