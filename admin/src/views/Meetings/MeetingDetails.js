import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../components/api/api";
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CBadge,
  CSpinner,
  CButton,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";

const MeetingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMeetingDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/get-meeting/${id}`);
      setMeeting(res.data.meeting);
    } catch (error) {
      console.log("Error fetching meeting details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="spin-style">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <>
      {/* 🔙 BACK */}
      <div className="mb-3">
        <CButton color="secondary" onClick={() => navigate(-1)}>
          ← Back
        </CButton>
      </div>

      {/* 🧾 MEETING INFO */}
      <CCard className="mb-4">
        <CCardBody>
          <h4>{meeting.meetingTitle}</h4>
          <p className="text-muted">{meeting.meetingDescription}</p>

          <div className="d-flex gap-3 flex-wrap">
            <CBadge color="info">{meeting.signingMode}</CBadge>
            <CBadge color={meeting.status === "ended" ? "success" : "warning"}>
              {meeting.status}
            </CBadge>
            <CBadge color={meeting.isSigned ? "success" : "danger"}>
              {meeting.isSigned ? "Signed" : "Not Signed"}
            </CBadge>
          </div>
        </CCardBody>
      </CCard>

      <CRow>
        {/* 👤 USER */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardBody>
              <h5>User Details</h5>
              <p><strong>Name:</strong> {meeting.userId?.name}</p>
              <p><strong>Email:</strong> {meeting.userId?.email}</p>
              <p><strong>Phone:</strong> {meeting.userId?.phone}</p>
              <p><strong>Country:</strong> {meeting.userId?.country}</p>
            </CCardBody>
          </CCard>
        </CCol>

        {/* ⚖ ADVOCATE */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardBody>
              <h5>Advocate Details</h5>
              <p><strong>Name:</strong> {meeting.advocateId?.name}</p>
              <p><strong>Email:</strong> {meeting.advocateId?.email}</p>
              <p><strong>Phone:</strong> {meeting.advocateId?.phone}</p>
              <p><strong>Jurisdiction:</strong> {meeting.advocateId?.advocateJurisdiction}</p>
              <p><strong>Reg No:</strong> {meeting.advocateId?.advocateRegistrationNo}</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ✍ SIGNATORIES */}
      <CCard className="mb-4">
        <CCardBody>
          <h5>Signatories ({meeting.signatoryCount})</h5>
          <CListGroup>
            {meeting.signatories.map((s, index) => (
              <CListGroupItem key={s._id}>
                <strong>{index + 1}. {s.name}</strong>  
                <div className="text-muted">
                  {s.email} | {s.MobileNo} | Page {s.PageNo} | {s.signPosition}
                </div>
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCardBody>
      </CCard>

      <CRow>
        {/* 💰 PAYMENT */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardBody>
              <h5>Payment</h5>
              <p><strong>Amount:</strong> ₹{meeting.amount} {meeting.currency}</p>
              <p><strong>Method:</strong> {meeting.payment?.method}</p>
              <p><strong>Status:</strong> 
                <CBadge className="ms-2" color="success">
                  {meeting.payment?.status}
                </CBadge>
              </p>
              <p><strong>Transaction ID:</strong> {meeting.payment?.transactionId}</p>
            </CCardBody>
          </CCard>
        </CCol>

        {/* 📄 DOCUMENTS */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardBody>
              <h5>Documents</h5>

              {meeting.documentUrl?.pdf && (
                <p>
                  <a href={meeting.documentUrl.pdf} target="_blank" rel="noreferrer">
                    View Original PDF
                  </a>
                </p>
              )}

              {/* {meeting.signedDocumentUrl && (
                <p>
                  <a href={meeting.signedDocumentUrl} target="_blank" rel="noreferrer">
                    View Signed Document
                  </a>
                </p>
              )} */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default MeetingDetails;
