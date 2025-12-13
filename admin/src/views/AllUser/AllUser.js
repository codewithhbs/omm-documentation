import React, { useEffect, useState } from "react";
import api from "../../components/api/api";
import {
  CTableDataCell,
  CTableRow,
  CSpinner,
  CFormSwitch,
} from "@coreui/react";
import Table from "../../components/Table/Table";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // 🔹 Fetch users
  const handleFetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/users");
      const filtered =
        res?.data?.users?.filter((u) => u?.role !== "admin") || [];
      setUsers(filtered);
    } catch (error) {
      console.log("internal server error", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchUser();
  }, []);

  // 🔹 Verify / Unverify handler
  const handleVerifyToggle = async (user) => {
    const nextStatus = !user?.userIdImageVerify;

    const result = await Swal.fire({
      title: nextStatus ? "Verify Document?" : "Unverify Document?",
      text: nextStatus
        ? "User document will be marked as verified"
        : "User document will be marked as unverified",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdatingId(user._id);

      await api.put(`/api/admin/userIdVerify/${user._id}`, {
        userIdImageVerify: nextStatus,
      });

      toast.success(
        `Document ${nextStatus ? "verified" : "unverified"} successfully`
      );

      handleFetchUser();
    } catch (error) {
      toast.error("Verification update failed");
    console.log(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const heading = [
    "S.No",
    "User",
    "Contact",
    "Country",
    "ID Document",
    "Verify",
  ];

  return (
    <>
      {loading ? (
        <div className="spin-style">
          <CSpinner color="primary" variant="grow" />
        </div>
      ) : (
        <Table
          heading="All Users"
          tableHeading={heading}
          tableContent={users.map((user, index) => (
            <CTableRow key={user?._id}>
              {/* S.No */}
              <CTableDataCell>{index + 1}</CTableDataCell>

              {/* User Info */}
              <CTableDataCell>
                <div>
                  <strong>{user?.name ?? "N/A"}</strong>
                  <p className="mb-0 text-muted text-sm">
                    @{user?.userName ?? "username"}
                  </p>
                </div>
              </CTableDataCell>

              {/* Contact */}
              <CTableDataCell>
                <div>
                  <p className="mb-0">{user?.email ?? "N/A"}</p>
                  <small className="text-muted">
                    {user?.phone ?? "N/A"}
                  </small>
                </div>
              </CTableDataCell>

              {/* Country */}
              <CTableDataCell>
                {user?.country ?? "N/A"}
              </CTableDataCell>

              {/* PDF */}
              <CTableDataCell>
                {user?.userIdImage?.pdf ? (
                  <a
                    href={user.userIdImage.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-underline"
                  >
                    View PDF
                  </a>
                ) : (
                  <span className="text-muted">No PDF</span>
                )}
              </CTableDataCell>

              {/* Verify Switch */}
              <CTableDataCell>
                <CFormSwitch
                  checked={Boolean(user?.userIdImageVerify)}
                  disabled={
                    !user?.userIdImage?.pdf ||
                    updatingId === user._id
                  }
                  onChange={() => handleVerifyToggle(user)}
                />
                <small
                  className={`d-block mt-1 ${
                    user?.userIdImageVerify
                      ? "text-success"
                      : "text-warning"
                  }`}
                >
                  {user?.userIdImageVerify
                    ? "Verified"
                    : "Not Verified"}
                </small>
              </CTableDataCell>
            </CTableRow>
          ))}
        />
      )}
    </>
  );
};

export default AllUser;
