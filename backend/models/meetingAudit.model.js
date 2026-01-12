const mongoose = require("mongoose");

const meetingAuditSchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
    required: true,
  },

  action: {
    type: String,
    enum: [
      "MEETING_CREATED",
      "REMINDER_SENT",
      "JOIN_ATTEMPT",
      "MEETING_ENDED",
    ],
    required: true,
  },

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  meta: {
    type: Object,
  },

}, { timestamps: true });

module.exports = mongoose.model("MeetingAudit", meetingAuditSchema);
