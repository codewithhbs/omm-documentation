const cron = require("node-cron");
const Meeting = require("../models/meeting.model");
const logMeetingAudit = require("../utils/logMeetingAudit");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Cron job for end meeting");
    const now = new Date();

    const meetings = await Meeting.find({
      isMeetingEnded: { $ne: true },
      endTime: { $lt: now },
    });

    console.log("meetings", meetings.length);

    for (const meeting of meetings) {
      meeting.isMeetingEnded = true;
      await meeting.save();

      await logMeetingAudit({
        meetingId: meeting._id,
        action: "MEETING_ENDED",
      });
    }
  } catch (err) {
    console.error("Meeting end cron error:", err.message);
  }
});
