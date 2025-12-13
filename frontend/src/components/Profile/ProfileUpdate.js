"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";

const ProfileUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  const [existingPdf, setExistingPdf] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    familyName: "",
    phone: "",
    address: "",
    country: "IN",
  });

  // 🔹 Fetch logged-in user (SAFE)
  const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      const user = res?.data?.user || {};

      setFormData({
        name: user?.name ?? "",
        familyName: user?.familyName ?? "",
        phone: user?.phone ?? "",
        address: user?.address ?? "",
        country: user?.country ?? "IN",
      });

      setExistingPdf(user?.userIdImage?.pdf ?? null);
      setIsVerified(Boolean(user?.userIdImageVerify));
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔹 Handle input safely
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  // 🔹 Handle PDF safely
  const handlePdfChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.warn("Only PDF files are allowed");
      return;
    }

    setPdfFile(file);
  };

  // 🔹 Update profile safely
  const updateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          data.append(key, value);
        }
      });

      if (pdfFile && !isVerified) {
        data.append("userIdImage", pdfFile);
      }

      await api.put("/api/auth/update_user_profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully ✅");
      setPdfFile(null);
      fetchUser();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={updateUser}
        className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Update Profile
        </h2>

        <Input
          label="First Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Family Name"
          name="familyName"
          value={formData.familyName}
          onChange={handleChange}
        />

        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />

        {/* 🔹 PDF Upload Section */}
        <div className="border rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium">
            ID Document (PDF)
          </label>

          {/* Existing PDF */}
          {existingPdf && (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <a
                href={existingPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline"
              >
                View Uploaded PDF
              </a>

              {isVerified ? (
                <span className="text-green-600 text-xs font-semibold">
                  ✅ Verified
                </span>
              ) : (
                <span className="text-orange-500 text-xs font-semibold">
                  ⏳ Pending Verification
                </span>
              )}
            </div>
          )}

          <input
            type="file"
            accept="application/pdf"
            disabled={isVerified}
            onChange={handlePdfChange}
            className="w-full border rounded-lg p-2 disabled:bg-gray-100"
          />

          {pdfFile && (
            <p className="text-xs text-green-600">
              Selected: {pdfFile.name}
            </p>
          )}

          {isVerified && (
            <p className="text-xs text-green-700">
              Document verified. Upload disabled.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;

/* 🔹 Reusable Input Component (SAFE) */
const Input = ({ label = "", ...props }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
    )}
    <input
      {...props}
      value={props.value ?? ""}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
    />
  </div>
);
