"use client";
import api from "@/utils/api";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CreateMeetingModal({ open, onClose }) {
  if (!open) return null;

  /* =========================
     USER (STABLE)
  ========================= */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  /* =========================
     STATE
  ========================= */
  const [meetingData, setMeetingData] = useState({
    meetingTitle: "",
    meetingDescription: "",
    signatories: [],
    signingMode: "adhaarESign",
    pdfReadCheckbox: false,
    dateOfAppointmentCheckbox: false,
    readyForSigningCheckbox: false,
    electronicSignatureCheckbox: false,
    agreedToTermsCheckbox: false,
  });

  const [signatoryEmail, setSignatoryEmail] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  /* =========================
     AUTO ADD ORGANIZER
  ========================= */
  useEffect(() => {
    if (!user?.email) return;

    setMeetingData((prev) =>
      prev.signatories.includes(user.email)
        ? prev
        : { ...prev, signatories: [user.email] }
    );
  }, [user?.email]);

  /* =========================
     HANDLERS
  ========================= */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMeetingData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addSignatory = () => {
    if (!signatoryEmail) return;

    const email = signatoryEmail.trim().toLowerCase();

    setMeetingData((prev) =>
      prev.signatories.includes(email)
        ? prev
        : { ...prev, signatories: [...prev.signatories, email] }
    );

    setSignatoryEmail("");
  };

  const removeSignatory = (email) => {
    if (email === user?.email) return;
    setMeetingData((prev) => ({
      ...prev,
      signatories: prev.signatories.filter((e) => e !== email),
    }));
  };

  const canUploadPDF =
    meetingData.pdfReadCheckbox &&
    meetingData.dateOfAppointmentCheckbox &&
    meetingData.readyForSigningCheckbox &&
    meetingData.electronicSignatureCheckbox;

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!pdfFile) return alert("PDF is required");

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("meetingTitle", meetingData.meetingTitle);
    formData.append("meetingDescription", meetingData.meetingDescription);
    formData.append("signingMode", meetingData.signingMode);

    meetingData.signatories.forEach((email) =>
      formData.append("signatories[]", email)
    );

    Object.entries(meetingData).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(key, value.toString());
      }
    });

    formData.append("documentUrl", pdfFile);
    setLoading(true);

    await api.post("/api/meeting/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // alert("Meeting created successfully");
    toast.success("Meeting created successfully");
    setLoading(false);
    onClose();
    } catch (error) {
      console.log("Internal server error:", error);
      toast.error(
        error.response?.data?.message || "Internal server error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Create Meeting</h2>
          <button onClick={onClose} className="p-2 rounded bg-gray-100">
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-5 sm:space-y-6"
        >

          {/* Meeting Info */}
          <div className="space-y-3">
            <input
              name="meetingTitle"
              placeholder="Meeting Name *"
              value={meetingData.meetingTitle}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <textarea
              name="meetingDescription"
              placeholder="Meeting Description"
              value={meetingData.meetingDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Signatories */}
          <div className="border rounded-xl p-4 space-y-3">
            <h3 className="font-medium">Signatories</h3>

            {/* Organizer */}
            <div className="bg-green-50 border rounded-lg p-2 text-sm">
              Organizer is a signatory ({user?.email})
            </div>

            {/* Added signatories */}
            {meetingData.signatories
              .filter((email) => email !== user?.email)
              .map((email, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border rounded-lg px-3 py-2 text-sm"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => removeSignatory(email)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}

            {/* Add */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={signatoryEmail}
                onChange={(e) => setSignatoryEmail(e.target.value)}
                placeholder="Signatory email"
                className="flex-1 border rounded-lg px-4 py-2"
              />
              <button
                type="button"
                onClick={addSignatory}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Signing Mode */}
          <div className="border rounded-xl p-4 space-y-3">
            <h3 className="font-medium">Signing Mode</h3>

            {[
              ["adhaarESign", "Aadhaar eSign"],
              ["dsc", "Digital Signature Certificate (DSC)"],
              ["NEKYC", "NE-KYC"],
            ].map(([value, label]) => (
              <label key={value} className="flex gap-3 items-center text-sm">
                <input
                  type="radio"
                  name="signingMode"
                  value={value}
                  checked={meetingData.signingMode === value}
                  onChange={handleInputChange}
                />
                {label}
              </label>
            ))}

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              The signatories will have the option(s) to sign the document based on
              your choice of signing mode(s) above. For example, if you choose
              "Aadhaar eSign or DSC", then the signatories will have the option of
              signing using Aadhaar eSign or the USB token based DSC.
            </p>
          </div>

          {/* Document Preparation */}
          <div className="border rounded-xl p-4 space-y-3">
            <h3 className="font-medium">Document Preparation</h3>

            {[
              ["pdfReadCheckbox", "I have read and prepared the PDF as per the guide."],
              ["dateOfAppointmentCheckbox", "The PDF is dated for the appointment."],
              ["readyForSigningCheckbox", "The PDF is ready for signing."],
              ["electronicSignatureCheckbox", "The PDF is electronically signed."],
            ].map(([name, label]) => (
              <label key={name} className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  name={name}
                  checked={meetingData[name]}
                  onChange={handleInputChange}
                />
                {label}
              </label>
            ))}

            <p className="text-sm text-indigo-600 font-medium">
              Before uploading a document, please check our Document Preparation Guide.
            </p>
          </div>

          {/* PDF Upload */}
          <div className={`border rounded-xl p-4 ${!canUploadPDF && "opacity-50"}`}>
            <label className="font-medium block mb-2">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              disabled={!canUploadPDF}
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full"
            />
            {!canUploadPDF && (
              <p className="text-sm text-red-600 mt-2">
                Complete all document confirmations to enable upload.
              </p>
            )}
          </div>

          {/* Terms */}
          <label className="flex gap-3 items-start border rounded-xl p-4 text-xs sm:text-sm leading-relaxed">
            <input
              type="checkbox"
              name="agreedToTermsCheckbox"
              checked={meetingData.agreedToTermsCheckbox}
              onChange={handleInputChange}
              className="mt-1"
            />
            I hereby confirm that if the PDF contains affidavits, the signatories are
            aware of the contents of accompanying pleadings / documents, which are
            ready to produce before the notary, if requested, during the appointment.
          </label>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!meetingData.agreedToTermsCheckbox}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
