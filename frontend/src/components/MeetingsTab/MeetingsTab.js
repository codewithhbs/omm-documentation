import { Plus, Calendar } from "lucide-react";

export default function MeetingsTab({ openModal }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-8">
        <h2 className="text-2xl text-black sm:text-3xl font-bold">Meetings</h2>
        <button
          onClick={openModal}
          className="w-full sm:w-auto bg-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Create Meeting
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-600">
            Sort by: Created Date ↓
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm">
            1 meeting
          </span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="border rounded-xl p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-start">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <h3 className="text-xl text-black sm:text-2xl font-bold">Shivam</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Pending
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                  Discover the perfect property from our extensive collection of
                  premium listings
                </p>
                <a
                  href="#"
                  className="text-sm sm:text-base text-indigo-600 font-medium"
                >
                  Aadhaar eSign
                </a>
                <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 flex flex-col gap-1 sm:gap-2">
                  <span>Created At: 21/11/2025</span>
                  <span>Meeting Date not finalised</span>
                  <span>Signatory: 1</span>
                  <span>Documents: 1</span>
                </div>
              </div>
              <div className="flex lg:block">
                <button className="w-full lg:w-auto bg-indigo-600 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
