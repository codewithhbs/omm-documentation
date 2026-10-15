"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Download, ExternalLink, X, ArrowRight } from "lucide-react";

// PDF lives in /public so it is served from the site root.
export const GUIDE_PDF_URL = "/OMM_Simple_Guide_Client_and_Advocate.pdf";

/**
 * Step-by-step guide popup.
 *
 * mandatory = true  -> no close (X) button; user must tick
 *                      "I have read the guide" and press Continue (onAccept).
 * mandatory = false -> plain viewer, can be closed any time (onClose).
 */
export default function GuideModal({ open, mandatory = false, onAccept, onClose }) {
  const [read, setRead] = useState(false);

  // Reset the checkbox every time the modal is opened
  useEffect(() => {
    if (open) setRead(false);
  }, [open]);

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-3 py-4">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="h-1 bg-gradient-to-r from-[#005F5A] to-[#00A896] shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E6F4F3] rounded-xl flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-[#005F5A]" />
            </div>
            <div>
              <h3
                className="text-lg font-bold text-gray-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                How to Get Your Document Notarised Online
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Please read this guide first, then follow the steps one by one.
                Clients: follow <b>Part 1</b>.
              </p>
            </div>
          </div>

          {!mandatory && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close guide"
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* PDF viewer (desktop / tablet) */}
        <div className="px-6 flex-1 min-h-0">
          <iframe
            src={`${GUIDE_PDF_URL}#view=FitH&navpanes=0`}
            title="Omm Documentation step-by-step guide"
            className="hidden md:block w-full h-[55vh] rounded-2xl border border-gray-200 bg-gray-50"
          />

          {/* Mobile fallback: phones can't preview PDFs inside an iframe reliably */}
          <div className="md:hidden rounded-2xl border border-[#005F5A]/15 bg-[#E6F4F3]/40 p-5 text-center">
            <p className="text-sm text-gray-700 mb-4">
              Open the guide in a new tab (or download it) and read all the steps
              before continuing.
            </p>
            <a
              href={GUIDE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#005F5A] text-white"
            >
              <ExternalLink size={15} /> Open Guide
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3">
            <a
              href={GUIDE_PDF_URL}
              download
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005F5A] hover:underline"
            >
              <Download size={13} /> Download PDF
            </a>
            <a
              href={GUIDE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#005F5A] hover:underline"
            >
              <ExternalLink size={13} /> Open in new tab
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 shrink-0">
          {mandatory ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-start gap-2.5 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={read}
                  onChange={(e) => setRead(e.target.checked)}
                  className="mt-0.5 accent-[#005F5A]"
                />
                <span>I have read the guide and will follow the steps.</span>
              </label>
              <button
                type="button"
                disabled={!read}
                onClick={onAccept}
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-gradient-to-br from-[#005F5A] to-[#004845] text-white rounded-xl shadow-md shadow-[#005F5A]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
