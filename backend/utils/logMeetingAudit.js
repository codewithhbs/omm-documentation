const MeetingAudit = require("../models/meetingAudit.model");

async function logMeetingAudit({ meetingId, action, performedBy, meta }) {
  try {
    await MeetingAudit.create({
      meetingId,
      action,
      performedBy,
      meta,
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
}

module.exports = logMeetingAudit;
