const AdvocateTimeSlotModel = require("../models/AdvocateTimeSlot.model");
const Meeting = require("../models/meeting.model");
const signedDocumentModel = require("../models/signedDocument.model");
const { uploadPDF, uploadImage, deleteImageFromCloudinary } = require("../utils/Cloudnary");
const { initiateDocumentSigning } = require("../utils/DocumentSigner");
const createGoogleMeet = require("../utils/googleMeet");
const logMeetingAudit = require("../utils/logMeetingAudit");
const { initiateRazorpay } = require("../utils/Pay");
const crypto = require("crypto");

function buildDateObject(date, time) {
  const datePart = new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
  return new Date(`${datePart}T${time}:00+05:30`);
}

function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const body = `${orderId}|${paymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

const toBoolean = (value) => value === true || value === "true";

async function createMeeting(req, res) {
  try {
    const {
      userId,
      meetingTitle,
      meetingDescription,
      signatories,
      signingMode,
      pdfReadCheckbox,
      dateOfAppointmentCheckbox,
      readyForSigningCheckbox,
      electronicSignatureCheckbox,
      agreedToTermsCheckbox,
    } = req.body;

    /* =========================
       BOOLEAN NORMALIZATION
    ========================= */
    const pdfRead = toBoolean(pdfReadCheckbox);
    const dateOfAppointment = toBoolean(dateOfAppointmentCheckbox);
    const readyForSigning = toBoolean(readyForSigningCheckbox);
    const electronicSignature = toBoolean(electronicSignatureCheckbox);
    const agreedToTerms = toBoolean(agreedToTermsCheckbox);

    /* =========================
       VALIDATIONS
    ========================= */
    if (!userId || !meetingTitle || !signatories) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (!agreedToTerms) {
      return res.status(400).json({
        success: false,
        message: "You must agree to the terms and conditions",
      });
    }

    if (
      !pdfRead ||
      !dateOfAppointment ||
      !readyForSigning ||
      !electronicSignature
    ) {
      return res.status(400).json({
        success: false,
        message: "All checkboxes must be checked",
      });
    }

    if (!["adhaarESign", "dsc", "NEKYC"].includes(signingMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid signing mode",
      });
    }

    /* =========================
       PDF VALIDATION
    ========================= */
    const pdfFile = req.files?.documentUrl?.[0];

    if (!pdfFile || pdfFile.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Valid PDF document is required",
      });
    }

    const { pdf, public_id } = await uploadPDF(pdfFile.buffer);

    if (!pdf || !public_id) {
      return res.status(500).json({
        success: false,
        message: "PDF upload failed",
      });
    }

    /* =========================
       NORMALIZE SIGNATORIES
    ========================= */
    const normalizedSignatories = Array.isArray(signatories)
      ? signatories
      : [signatories];

    const allowedPositions = [
      "bottom-left",
      "top-left",
      "top-right",
      "bottom-right",
      "bottom-center",
      "center",
    ];

    const formattedSignatories = await Promise.all(
      normalizedSignatories.map(async (s, index) => {

        let idProofData = null;

        // If idProof file exists for this signer
        const idProofFile =
          req.files?.[`signatories[${index}][idProof]`] ||
          req.files?.[`signatories.${index}.idProof`];

        if (idProofFile) {
          const upload = await uploadImage(idProofFile[0].buffer);

          idProofData = {
            image: upload.image,
            public_id: upload.public_id
          };
        }

        return {
          name: s.name,
          email: s.email,
          CountryCode: s.CountryCode,
          MobileNo: s.MobileNo,
          DOB: s.DOB,
          Gender: s.Gender,
          PageNo: s.PageNo,
          signPosition: allowedPositions.includes(s.signPosition)
            ? s.signPosition
            : "bottom-right",

          // 👇 this is the only new thing added
          idProof: idProofData
        };
      })
    );


    const signatoryCount = formattedSignatories.length;

    /* =========================
       PRICING LOGIC
    ========================= */
    let amount = 0;
    let currency = "INR";

    if (signingMode === "adhaarESign") {
      if (signatoryCount <= 2) amount = 1000;
      else if (signatoryCount <= 4) amount = 1500;
      else if (signatoryCount <= 9) amount = 3000;
      else {
        return res.status(400).json({
          success: false,
          message: "Maximum 9 signatories allowed for Aadhaar eSign",
        });
      }
    }

    if (signingMode === "dsc") {
      if (signatoryCount <= 2) amount = 5000;
      else if (signatoryCount <= 4) amount = 6000;
      else if (signatoryCount <= 9) amount = 8000;
      else {
        return res.status(400).json({
          success: false,
          message: "Maximum 9 signatories allowed for DSC",
        });
      }
    }

    if (signingMode === "NEKYC") {
      amount = 100;
      currency = "USD";
    }

    /* =========================
       CREATE MEETING
    ========================= */
    const meeting = await Meeting.create({
      userId,
      meetingTitle,
      meetingDescription,
      signatories: formattedSignatories,
      signingMode,
      signatoryCount,
      amount,
      currency,
      status: "scheduled",
      isPaid: false,
      pdfReadCheckbox: pdfRead,
      dateOfAppointmentCheckbox: dateOfAppointment,
      readyForSigningCheckbox: readyForSigning,
      electronicSignatureCheckbox: electronicSignature,
      agreedToTermsCheckbox: agreedToTerms,
      documentUrl: {
        pdf,
        public_id,
      },
    });

    return res.status(201).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error("Create meeting error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function createPayment(req, res) {
  console.log("🔔 createPayment API HIT");

  try {
    const { meetingId } = req.params;
    const userID = req.user?.sub;

    console.log("📥 Params & User:", { meetingId, userID });

    if (!meetingId || !userID) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    const meeting = await Meeting.findOne({
      _id: meetingId,
      userId: userID,
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // 🚫 Already paid protection
    if (meeting.isPaid) {
      return res.status(400).json({
        success: true,
        message: "Meeting already paid",
      });
    }

    console.log("✅ Meeting ready for payment:", {
      id: meeting._id,
      amount: meeting.amount,
    });

    // Mark as payment pending (optional but recommended)
    meeting.status = "payment_pending";
    await meeting.save();

    return await initiateRazorpay(req, res, meeting);

  } catch (error) {
    console.error("🔥 ERROR in createPayment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function checkStatus(req, res) {
  console.log("🔔 checkStatus API HIT");

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    // 1️⃣ Verify signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    console.log("🔐 Signature valid:", isValid);

    // 2️⃣ Find meeting by Razorpay order id
    const meeting = await Meeting.findOne({
      "payment.razorpayOrderId": razorpay_order_id,
    }).populate("userId");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // ❌ Payment failed
    if (!isValid) {
      meeting.payment.status = "failed";
      meeting.payment.transactionId = razorpay_payment_id;
      meeting.isPaid = false;
      meeting.status = "payment_failed";

      await meeting.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        redirectUrl: `http://localhost:3000/payment-failed?order_id=${razorpay_order_id}`,
      });
    }

    // ✅ Payment success
    meeting.payment.transactionId = razorpay_payment_id;
    meeting.payment.status = "success";
    meeting.payment.paidAt = new Date();

    meeting.isPaid = true;
    meeting.status = "paid";

    await meeting.save();

    console.log("✅ Meeting payment marked as PAID");

    const successRedirect = `http://localhost:3000/Receipt/order-confirmed?id=${meeting._id}&success=true`;

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      redirectUrl: successRedirect,
    });

  } catch (error) {
    console.error("🔥 ERROR in checkStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function updateTimeSlot(req, res) {
  try {
    const userID = req.user?.sub;
    const { id } = req.params;
    const { timeSlotId } = req.body;

    // console.log("body",userID,id,timeSlotId)

    const meeting = await Meeting.findOne({ _id: id, userId: userID });
    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    if (meeting.isPaid === false) {
      return res.status(400).json({ success: false, message: "Meeting is not paid" });
    }
    console.log("timeSlotId", timeSlotId)
    const timeSlot = await AdvocateTimeSlotModel.findById(timeSlotId);
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: "Time slot not found" });
    }

    if (new Date(timeSlot.startTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Start time must be in the future",
      });
    }

    const meetLink = await createGoogleMeet({
      title: meeting.meetingTitle,
      date: timeSlot.date,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
    });


    await logMeetingAudit({
      meetingId: meeting._id,
      action: "MEETING_CREATED",
      performedBy: meeting.userId,
    });

    const startDateTime = buildDateObject(timeSlot.date, timeSlot.startTime);
    const endDateTime = buildDateObject(timeSlot.date, timeSlot.endTime);

    // ⛔ Extra safety
    if (endDateTime <= startDateTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    meeting.meetLink = meetLink;
    meeting.startTime = startDateTime;
    meeting.endTime = endDateTime;
    meeting.timeSlotId = timeSlot._id;
    meeting.advocateId = timeSlot.advocateId;

    console.log("🕒 Final meeting times:", {
      start: meeting.startTime,
      end: meeting.endTime,
    });

    await meeting.save();


    res.status(200).json({ success: true, message: "Meeting updated" });
  } catch (error) {
    console.log("Internal server error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function joinMeeting(req, res) {
  const meeting = await Meeting.findById(req.params.id);

  const now = new Date();
  const allowed = now >= meeting.startTime && now <= meeting.endTime;

  await logMeetingAudit({
    meetingId: meeting._id,
    action: "JOIN_ATTEMPT",
    performedBy: req.user?.id,
    meta: { allowed },
  });

  if (!allowed) {
    return res.status(403).json({ message: "Meeting is expired" });
  }

  if (meeting.isPaid === false) {
    return res.status(400).json({ success: false, message: "Meeting is not paid" });
  }

  res.json({ meetLink: meeting.meetLink });
}

async function getMeetingByUserAndAdvocate(req, res) {
  try {
    const userId = req.user?.sub; // logged-in user / advocate id

    // =========================
    // QUERY PARAMS
    // =========================
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sort = req.query.sort === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    // =========================
    // FILTER
    // ========================= 
    const filter = {
      $or: [
        { userId: userId },
        { advocateId: userId }
      ]
    };


    // =========================
    // TOTAL COUNT
    // =========================
    const total = await Meeting.countDocuments(filter);

    // =========================
    // FETCH MEETINGS
    // =========================
    const meetings = await Meeting.find()
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(limit);

    if (!meetings || meetings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No meetings found for this user",
      });
    }

    // =========================
    // RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      meetings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Internal server error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getMeetingDetails(req, res) {
  try {
    const userID = req.user?.sub;
    const { id } = req.params;
    // console.log("id",id)

    const meeting = await Meeting.findOne({ _id: id }).populate("timeSlotId userId advocateId");
    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    return res.status(200).json({ success: true, meeting });
  } catch (error) {
    console.error("Internal server error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function advSignDetail(req, res) {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      CountryCode,
      MobileNo,
      DOB,
      Gender,
      PageNo,
      signPosition
    } = req.body;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // 🔒 Optional: Meeting already signed check
    if (meeting.isSigned) {
      return res.status(400).json({
        success: false,
        message: "Meeting already sent for signing",
      });
    }

    // 🔍 Optional: Duplicate signer email check
    const exists = meeting.signatories.find(
      (s) => s.email === email
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Signer already exists",
      });
    }

    // ✅ Create signer object
    const signer = {
      name,
      email,
      CountryCode,
      MobileNo,
      DOB,
      Gender,
      PageNo,
      signPosition,
    };

    // ➕ Push signer
    meeting.signatories.push(signer);

    // 🔢 Update count
    meeting.signatoryCount = meeting.signatories.length;

    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Signer details added successfully",
      signer,
      signatories: meeting.signatories,
    });

  } catch (error) {
    console.log("Internal server error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function sendDocumentForSign(req, res) {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id)
      .populate("timeSlotId userId advocateId");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    if (!meeting.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Meeting is not paid",
      });
    }

    if (!meeting.signatories?.length) {
      return res.status(400).json({
        success: false,
        message: "No signatories found",
      });
    }

    // 🔹 Call signing API
    const response = await initiateDocumentSigning(meeting);

    if (!response?.IsSuccess || !response?.Response) {
      return res.status(500).json({
        success: false,
        message: "Failed to initiate document signing",
      });
    }

    const {
      WorkflowId,
      DocumentNumberList,
      DocumentIdList,
      URL
    } = response.Response;

    const exists = await signedDocumentModel.findOne({ WorkflowId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Document already sent for signing",
      });
    }


    // 🔹 Save in SignedDocument table
    const signedDocument = await signedDocumentModel.create({
      meetingId: meeting._id,
      WorkflowId,
      DocumentNumberList,
      DocumentIdList,
      url: URL
    });

    // 🔹 Update meeting
    meeting.isSigned = true;
    meeting.signedDocumentWorkflowId = signedDocument.WorkflowId;
    meeting.signedDocumentUrl = signedDocument.url;
    meeting.status = 'ended';
    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Document sent for signing",
      signedDocument
    });

  } catch (error) {
    console.log("Internal server error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function uploadFaceImage(req, res) {
  try {
    const { id } = req.params;
    const { signerIndex } = req.body;

    if (signerIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "signerIndex is required",
      });
    }

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    if (!meeting.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Meeting is not paid",
      });
    }

    if (!meeting.signatories[signerIndex]) {
      return res.status(400).json({
        success: false,
        message: "Invalid signer index",
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const signer = meeting.signatories[signerIndex];

    // 🔥 STEP 1: Agar pehle image hai → delete karo
    if (signer.faceImage?.public_id) {
      console.log("Deleting old image:", signer.faceImage.public_id);
      await deleteImageFromCloudinary(signer.faceImage.public_id);
    }

    // 🔥 STEP 2: Upload new image
    const uploaded = await uploadImage(req.file.buffer);
    const { image, public_id } = uploaded;

    // 🔥 STEP 3: Save new image
    signer.faceImage = {
      image,
      public_id,
    };

    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Signer document uploaded successfully",
      signer,
    });

  } catch (error) {
    console.log("Internal server error", error)
    return res.status(500).josn({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

async function uploadDocOfSigner(req, res) {
  try {
    const { id } = req.params;
    const { signerIndex } = req.body;

    if (signerIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "signerIndex is required",
      });
    }

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    if (!meeting.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Meeting is not paid",
      });
    }

    if (!meeting.signatories[signerIndex]) {
      return res.status(400).json({
        success: false,
        message: "Invalid signer index",
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const signer = meeting.signatories[signerIndex];

    // 🔥 STEP 1: Agar pehle image hai → delete karo
    if (signer.doc?.public_id) {
      console.log("Deleting old image:", signer.doc.public_id);
      await deleteImageFromCloudinary(signer.doc.public_id);
    }

    // 🔥 STEP 2: Upload new image
    const uploaded = await uploadImage(req.file.buffer);
    const { image, public_id } = uploaded;

    // 🔥 STEP 3: Save new image
    signer.doc = {
      image,
      public_id,
    };

    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Signer document uploaded successfully",
      signer,
    });

  } catch (error) {
    console.error("Internal server error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  createMeeting,
  createPayment,
  checkStatus,
  updateTimeSlot,
  joinMeeting,
  getMeetingByUserAndAdvocate,
  getMeetingDetails,
  uploadDocOfSigner,
  advSignDetail,
  sendDocumentForSign,
  uploadFaceImage
};
