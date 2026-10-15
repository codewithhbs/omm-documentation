"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import male from './male.jpg'
import female from './female.webp'

const testimonials = [
  {
    name: "Rohit Mehra",
    role: "NRI, Dubai",
    image: male,
    text: "I needed a Power of Attorney for my property in India while living in Dubai. The video meeting took around 20 minutes and I got the notarised copy on email the same day.",
  },
  {
    name: "Anna Thomas",
    role: "Business Owner",
    image: female,
    text: "Booking was simple. I uploaded my agreement, picked a slot, and signed with Aadhaar OTP. No running around for stamp papers or waiting in queues.",
  },
  {
    name: "Rohan",
    role: "Consultant, Canada",
    image: male,
    text: "As an NRI I was worried about the process, but the passport-based KYC worked smoothly. The advocate was polite and explained every step on the call.",
  },
  {
    name: "Amit Kapoor",
    role: "Software Engineer",
    image: male,
    text: "I got my affidavit notarised during my lunch break. Reminder emails came 24 hours and 15 minutes before the meeting, so I never missed the slot.",
  },
  {
    name: "Priya Verma",
    role: "Homemaker",
    image: female,
    text: "The guide on the website made it easy to follow, even for someone not used to online work. The advocate verified my ID on video and the stamped document arrived by email.",
  },
  {
    name: "Sandeep Singh",
    role: "Real Estate Consultant",
    image: male,
    text: "We had three signatories sitting in different cities. Everyone signed from their own phone and the final stamped copy was shared with all of us together. Saved a lot of time.",
  },
];

const PER_PAGE = 3;
const TOTAL_PAGES = Math.ceil(testimonials.length / PER_PAGE);

export default function Testimonials() {
  const [page, setPage] = useState(0);

  const prev = () => setPage((p) => (p - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  const next = () => setPage((p) => (p + 1) % TOTAL_PAGES);

  const visible = testimonials.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Client Testimonial</h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonials"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8 px-12">
            {visible.map((t) => (
              <div key={t.name} className="text-center">
                <img
  src={t.image.src}
  alt={t.name}
  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-200 object-cover"
/>
                <p className="text-sm text-gray-700 mb-4 italic">"{t.text}"</p>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonials"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Go to testimonials page ${i + 1}`}
                className={`w-2 h-2 rounded-full ${i === page ? "bg-gray-400" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}