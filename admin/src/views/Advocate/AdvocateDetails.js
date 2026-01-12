import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/api/api";
import { CSpinner, CCard, CCardBody } from "@coreui/react";

const AdvocateDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/api/admin/advocate-details/${id}`);
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="spin-style">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!user) return <p>User not found</p>;

  return (
    <div className="container-fluid px-4 py-4">
      <h3 className="mb-4 fw-bold">Advocate Details</h3>

      <div className="row g-4">
        {/* BASIC INFO */}
        <div className="col-md-6">
          <CCard className="shadow-sm">
            <CCardBody>
              <h5 className="mb-3">Basic Information</h5>

              <Detail label="Name" value={`${user.name} ${user.familyName}`} />
              <Detail label="Username" value={`@${user.userName}`} />
              <Detail label="Email" value={user.email} />
              <Detail label="Phone" value={user.phone} />
              <Detail label="Country" value={user.country} />
              <Detail label="Address" value={user.address} />
            </CCardBody>
          </CCard>
        </div>

        {/* NOTARY INFO */}
        <div className="col-md-6">
          <CCard className="shadow-sm">
            <CCardBody>
              <h5 className="mb-3">Notary Information</h5>

              <Detail
                label="Registration No"
                value={user.advocateRegistrationNo}
              />
              <Detail
                label="Jurisdiction"
                value={user.advocateJurisdiction}
              />
              <Detail
                label="Expiry Date"
                value={new Date(
                  user.advocateExpireDate
                ).toDateString()}
              />
              <Detail label="Role" value={user.role} />
            </CCardBody>
          </CCard>
        </div>

        {/* DOCUMENT INFO */}
        <div className="col-md-6">
          <CCard className="shadow-sm">
            <CCardBody>
              <h5 className="mb-3">Document & Verification</h5>

              <Detail
                label="KYC Status"
                value={user.kycStatus}
              />
              <Detail
                label="Email Verified"
                value={user.isEmailVerified ? "Yes" : "No"}
              />
              <Detail
                label="Phone Verified"
                value={user.isPhoneVerified ? "Yes" : "No"}
              />
              <Detail
                label="Document Verified"
                value={user.userIdImageVerify ? "Yes" : "No"}
              />

              {user.userIdImage?.pdf && (
                <a
                  href={user.userIdImage.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary mt-2"
                >
                  View ID PDF
                </a>
              )}
            </CCardBody>
          </CCard>
        </div>

        {/* META */}
        <div className="col-md-6">
          <CCard className="shadow-sm">
            <CCardBody>
              <h5 className="mb-3">Meta Info</h5>

              <Detail
                label="Created At"
                value={new Date(user.createdAt).toLocaleString()}
              />
              <Detail
                label="Updated At"
                value={new Date(user.updatedAt).toLocaleString()}
              />
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  );
};

export default AdvocateDetails;

/* 🔹 Reusable Row */
const Detail = ({ label, value }) => (
  <div className="d-flex justify-content-between border-bottom py-2">
    <span className="text-muted">{label}</span>
    <strong>{value || "N/A"}</strong>
  </div>
);
