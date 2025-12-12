import { X } from "lucide-react";

export default function CreateMeetingModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-6 border-b border-black">
          <h2 className="text-lg text-black sm:text-2xl font-bold">Create Meeting</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-lg"
          >
            <X className="w-5 text-black h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Meeting Name */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Meeting Name *
            </label>
            <input
              type="text"
              className="w-full text-black px-3 sm:px-4 py-2.5 sm:py-3 border border-black rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="Enter meeting name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Meeting Description
            </label>
            <textarea
              rows={4}
              className="w-full text-black px-3 sm:px-4 py-2.5 sm:py-3 border border-black rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              placeholder="Optional"
            ></textarea>
          </div>

          {/* Signatories */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">Signatories</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                className="flex-1 text-black px-3 sm:px-4 py-2.5 sm:py-3 border border-black rounded-lg text-sm sm:text-base"
                placeholder="Signatory Email"
              />
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base">
                +
              </button>
            </div>
            <label className="flex text-black items-center gap-3 mt-4 text-sm sm:text-base">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5"
              />
              <span>Organizer is a signatory</span>
            </label>
          </div>

          {/* Document Confirmations */}
          <div className="border-t border-black pt-6 sm:pt-8">
            <h3 className="font-semibold text-black mb-4 text-base sm:text-lg">
              Document Upload Confirmations
            </h3>
            {[
              "I hereby confirm that I have read and prepared the PDF as per the Document Preparation Guide.",
              "The PDF is dated for the date of the appointment.",
              "The PDF is ready for signing, execution and notarisation.",
              'The PDF has “/electronically signed by <signatory name>/” wherever needed.',
            ].map((text, i) => (
              <label key={i} className="flex items-start gap-3 mb-3 sm:mb-4">
                <input type="checkbox" className="mt-1 text-black w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs text-black sm:text-sm">{text}</span>
              </label>
            ))}
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 sm:p-4 flex gap-3">
              <span className="text-yellow-700 text-xl sm:text-2xl">⚠</span>
              <p className="text-xs sm:text-sm text-black">
                Please complete all document confirmations above. All checkboxes
                must be checked to upload.
              </p>
            </div>
          </div>

          {/* Signing Mode */}
          <div>
            <label className="block text-sm text-black font-medium mb-3 sm:mb-4">
              Signing Mode
            </label>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              {["Aadhaar eSign", "DSC", "NE-KYC (What is NE-KYC?)"].map(
                (mode) => (
                  <label key={mode} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="mode"
                      defaultChecked={mode === "Aadhaar eSign"}
                      className="w-4 h-4 text-black sm:w-5 sm:h-5"
                    />
                    <span className="text-black">{mode}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border rounded-lg border-black text-black hover:bg-gray-50 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
