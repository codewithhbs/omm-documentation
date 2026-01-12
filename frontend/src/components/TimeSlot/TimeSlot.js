import api from "@/utils/api";
import React, { useEffect, useState } from "react";

const TimeSlot = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/advocate/get-time-slot");
      setSlots(res.data.timeSlot || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddSlot = async (e) => {
    e.preventDefault();
    await api.post("/api/advocate/add-time-slot", formData);
    setOpenModal(false);
    setFormData({ date: "", startTime: "", endTime: "" });
    fetchSlots();
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/advocate/delete-time-slot/${id}`);
    setSlots((prev) => prev.filter((s) => s._id !== id));
  };

  const normalizeDate = (date) =>
  new Date(date).toISOString().split("T")[0];

const today = normalizeDate(new Date());
const tomorrow = normalizeDate(new Date(Date.now() + 86400000));

const groups = {
  Today: slots.filter((s) => normalizeDate(s.date) === today),
  Tomorrow: slots.filter((s) => normalizeDate(s.date) === tomorrow),
  Later: slots.filter((s) => normalizeDate(s.date) > tomorrow),
};


  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    return `${dayName} ${day}${suffix} ${month} ${year}`;
  };


  return (
    <div className="max-w-5xl mx-auto p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Time Slots
        </h1>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900"
        >
          + Add Time Slot
        </button>
      </div>

      {/* Slots */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        Object.entries(groups).map(
          ([title, list]) =>
            list.length > 0 && (
              <div key={title} className="mb-8">
                <h2 className="text-lg font-medium mb-4 text-gray-700">
                  {title}
                </h2>

                <div className="space-y-4">
                  {list.map((slot) => (
                    <div
                      key={slot._id}
                      className="bg-white rounded-xl border p-5 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm text-gray-500">
                          {formatDate(slot.date)}
                        </p>
                        <p className="text-base font-medium text-gray-800">
                          {slot.startTime} – {slot.endTime}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(slot._id)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
        )
      )}

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Add Time Slot
            </h3>

            <form onSubmit={handleAddSlot} className="space-y-4">
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="flex gap-3">
                <input
                  type="time"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="time"
                  name="endTime"
                  required
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-black text-white"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlot;
