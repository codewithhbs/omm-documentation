import React, { useState } from "react";
import Form from "../../components/Form/Form";
import {
  CCol,
  CFormInput,
  CFormLabel,
  CButton,
} from "@coreui/react";
import toast from "react-hot-toast";
import api from "../../components/api/api";

const AddAdvocate = () => {
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    familyName: "",
    userName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    country: "",
    advocateRegistrationNo: "",
    advocateJurisdiction: "",
    advocateExpireDate: "",
  });


  /* =========================
     INPUT HANDLER
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (pdfFile) {
        payload.append("userIdImage", pdfFile);
      }

      const res = await api.post(
        "/api/admin/register-advocate",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res?.data?.message || "Advocate added successfully");

      setFormData({
        name: "",
        familyName: "",
        userName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        country: "",
        advocateRegistrationNo: "",
        advocateJurisdiction: "",
        advocateExpireDate: "",
      });

      setPdfFile(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Internal server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Add Advocate"
      btnText="Back"
      btnURL="/advocate/all-advocates"
      onSubmit={handleSubmit}
      formContent={
        <>
          {/* First Name */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">First Name</CFormLabel>
            <CFormInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </CCol>

          {/* Last Name */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">Last Name</CFormLabel>
            <CFormInput
              name="familyName"
              value={formData.familyName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </CCol>

          {/* Username */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">Username</CFormLabel>
            <CFormInput
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </CCol>

          {/* Email */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">Email</CFormLabel>
            <CFormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </CCol>

          {/* Password */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">Password</CFormLabel>
            <CFormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </CCol>

          {/* Phone */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">Phone</CFormLabel>
            <CFormInput
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </CCol>

          {/* Address */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">Address</CFormLabel>
            <CFormInput
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />
          </CCol>

          {/* Country */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">Country</CFormLabel>
            <CFormInput
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
              required
            />
          </CCol>

          {/* Advocate Registration No */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">
              Registration Number
            </CFormLabel>
            <CFormInput
              name="advocateRegistrationNo"
              value={formData.advocateRegistrationNo}
              onChange={handleChange}
              placeholder="Enter registration number"
              required
            />
          </CCol>

          {/* Advocate Jurisdiction */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">
              Jurisdiction
            </CFormLabel>
            <CFormInput
              name="advocateJurisdiction"
              value={formData.advocateJurisdiction}
              onChange={handleChange}
              placeholder="Enter jurisdiction"
              required
            />
          </CCol>

          {/* Advocate Expiry Date */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">
              Registration Expiry Date
            </CFormLabel>
            <CFormInput
              type="date"
              name="advocateExpireDate"
              value={formData.advocateExpireDate}
              onChange={handleChange}
              required
            />
          </CCol>


          {/* PDF Upload */}
          <CCol md={6} sm={12}>
            <CFormLabel className="form_label">
              Upload ID Proof (PDF)
            </CFormLabel>
            <CFormInput
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </CCol>

          {/* Submit */}
          <CCol xs={12} className="mt-3">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? "Please Wait..." : "Add Advocate"}
            </CButton>
          </CCol>
        </>
      }
    />
  );
};

export default AddAdvocate;
