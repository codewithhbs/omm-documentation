export default function SlotsTab() {
  const today = [
    {
      date: "Fri 21st November 2025",
      time: "16:30 – 17:00",
      type: "Standard",
    },
    {
      date: "Fri 21st November 2025",
      time: "17:00 – 17:30",
      type: "Standard",
    },
  ];
  const later = [
    {
      date: "Mon 24th November 2025",
      time: "13:00 – 13:30",
      type: "Standard",
    },
    {
      date: "Mon 24th November 2025",
      time: "13:30 – 14:00",
      type: "Standard",
    },
    {
      date: "Mon 24th November 2025",
      time: "14:00 – 14:30",
      type: "Standard",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold">Available Timeslots</h2>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        {/* Top info bar */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b">
          <p className="text-sm sm:text-base text-gray-700">
            Below are the currently available timeslots for notary services.
          </p>
        </div>

        {/* ✅ Mobile view: cards */}
        <div className="md:hidden p-4 space-y-6">
          {/* Today section */} 
          <div>
            <h3 className="text-[11px] font-semibold text-gray-500 mb-2">
              TODAY
            </h3>
            <div className="space-y-3">
              {today.map((slot, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 flex flex-col gap-1 bg-white"
                >
                  <p className="text-xs text-gray-500">{slot.date}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {slot.time}
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[11px] font-medium">
                      {slot.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Later section */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-500 mt-4 mb-2">
              LATER
            </h3>
            <div className="space-y-3">
              {later.map((slot, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 flex flex-col gap-1 bg-white"
                >
                  <p className="text-xs text-gray-500">{slot.date}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {slot.time}
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[11px] font-medium">
                      {slot.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Desktop / tablet view: table */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-indigo-900 text-white text-xs sm:text-sm">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">
                  Time Slot
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Type</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="bg-gray-100 font-semibold text-xs sm:text-sm">
                <td colSpan={3} className="px-4 sm:px-6 py-2.5 sm:py-3">
                  TODAY
                </td>
              </tr>
              {today.map((slot, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4">{slot.date}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">{slot.time}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[11px] sm:text-sm">
                      {slot.type}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold text-xs sm:text-sm">
                <td colSpan={3} className="px-4 sm:px-6 py-2.5 sm:py-3">
                  LATER
                </td>
              </tr>
              {later.map((slot, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4">{slot.date}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">{slot.time}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[11px] sm:text-sm">
                      {slot.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
