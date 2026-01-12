'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'

const Page = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 px-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center">

                {/* SUCCESS ICON */}
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 rounded-full p-4">
                        <CheckCircle className="text-green-600 w-12 h-12" />
                    </div>
                </div>

                {/* TITLE */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                    Thank You for Signing!
                </h1>

                {/* SUBTEXT */}
                <p className="text-gray-600 mb-6">
                    Your document has been successfully signed using
                    <span className="font-medium text-indigo-600">
                        {' '}OMM Documentation
                    </span>.
                </p>

                {/* INFO BOX */}
                <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600 mb-6">
                    The signed document is now securely stored and legally valid.
                    You will receive a confirmation email shortly.
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    >
                        Go to Dashboard
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                        Go to Home
                    </button>
                </div>

                {/* FOOTER */}
                <p className="text-xs text-gray-400 mt-6">
                    © {new Date().getFullYear()} OMM Documentation. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default Page
