'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
 
export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {sent ? (
                <CheckCircle className="w-12 h-12 text-indigo-600" />
              ) : (
                <Mail className="w-12 h-12 text-indigo-600" />
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {sent ? "Check Your Email" : "Forgot Password?"}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {sent
                ? "We’ve sent a password reset link to your email."
                : "No worries! Enter your email and we’ll send you a reset link."}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
            {!sent ? (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 transition shadow-lg flex items-center justify-center gap-3"
                >
                  Send Reset Link
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-8">
                  If an account exists for <span className="font-semibold">you@example.com</span>, you will receive a password reset email shortly.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  <ArrowRight className="w-5 h-5" /> Back to Sign In
                </Link>
              </div>
            )}

            <p className="mt-10 text-center text-sm text-gray-500">
              Remember your password?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}