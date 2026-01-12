import api from "@/utils/api";
import { useEffect, useState } from "react";

/* =========================
   HELPERS
========================= */
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

// Sort by date + start time
const sortByDateTime = (a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);

  if (dateA.getTime() !== dateB.getTime()) {
    return dateA - dateB;
  }

  return a.startTime.localeCompare(b.startTime);
};

export default function SlotsTab() {
  const [allTimeSlots, setAllTimeSlots] = useState([]);

  /* =========================
     FETCH SLOTS
  ========================= */
  const fetchTimeSlots = async () => {
    try {
      const response = await api.get("/api/advocate/get-all-time-slots");
      console.log("response",response)
      if (response.data.success) {
        setAllTimeSlots(response.data.timeSlots);
      }
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  /* =========================
     SORT & SPLIT
  ========================= */
  const sortedSlots = [...allTimeSlots].sort(sortByDateTime);

  const todaySlots = sortedSlots.filter((slot) => isToday(slot.date));
  const laterSlots = sortedSlots.filter((slot) => !isToday(slot.date));

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl text-black sm:text-3xl font-bold">
        Available Timeslots
      </h2>

      <div className="bg-white rounded-xl shadow border border-black overflow-hidden">
        {/* Top info */}
        <div className="p-4 sm:p-6 bg-gray-50 border-black border-b">
          <p className="text-sm sm:text-base text-gray-700">
            Below are the currently available timeslots for notary services.
          </p>
        </div>

        {/* =========================
           MOBILE VIEW
        ========================= */}
        <div className="md:hidden p-4 space-y-6">
          {/* TODAY */}
          {todaySlots.length > 0 && (
            <div>
              <h3 className="text-[11px] font-semibold text-black mb-2">
                TODAY
              </h3>
              <div className="space-y-3">
                {todaySlots.map((slot) => (
                  <div
                    key={slot._id}
                    className="border border-black rounded-lg p-3 flex flex-col gap-1 bg-white"
                  >
                    <p className="text-xs text-black">
                      {formatDate(slot.date)}
                    </p>
                    <p className="text-sm font-medium text-black">
                      {slot.startTime} – {slot.endTime}
                    </p>
                    <span className="inline-flex w-fit px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[11px] font-medium">
                      Standard
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LATER */}
          {laterSlots.length > 0 && (
            <div>
              <h3 className="text-[11px] font-semibold text-gray-500 mt-4 mb-2">
                LATER
              </h3>
              <div className="space-y-3">
                {laterSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className="border border-black rounded-lg p-3 flex flex-col gap-1 bg-white"
                  >
                    <p className="text-xs text-gray-500">
                      {formatDate(slot.date)}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {slot.startTime} – {slot.endTime}
                    </p>
                    <span className="inline-flex w-fit px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[11px] font-medium">
                      Standard
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================
           DESKTOP / TABLE
        ========================= */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-indigo-900 text-white text-xs sm:text-sm">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">Date</th>
                <th className="px-4 sm:px-6 py-3 text-left">Time Slot</th>
                <th className="px-4 sm:px-6 py-3 text-left">Type</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {/* TODAY */}
              {todaySlots.length > 0 && (
                <>
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan={3} className="px-4 py-2 text-black">
                      TODAY
                    </td>
                  </tr>
                  {todaySlots.map((slot) => (
                    <tr
                      key={slot._id}
                      className="border-b border-black hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-black">
                        {formatDate(slot.date)}
                      </td>
                      <td className="px-4 py-3 text-black">
                        {slot.startTime} – {slot.endTime}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[11px]">
                          Standard
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              )}

              {/* LATER */}
              {laterSlots.length > 0 && (
                <>
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan={3} className="px-4 py-2 text-black">
                      LATER
                    </td>
                  </tr>
                  {laterSlots.map((slot) => (
                    <tr
                      key={slot._id}
                      className="border-b border-black hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-black">
                        {formatDate(slot.date)}
                      </td>
                      <td className="px-4 py-3 text-black">
                        {slot.startTime} – {slot.endTime}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[11px]">
                          Standard
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
