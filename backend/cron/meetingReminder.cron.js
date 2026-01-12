const cron = require("node-cron");
const Meeting = require("../models/meeting.model");
const sendEmail = require("../utils/SendEmail");
const logMeetingAudit = require("../utils/logMeetingAudit");

cron.schedule("* * * * *", async () => {
    try {
        console.log("⏰ Reminder Cron running...");
        const now = new Date();

        // 24 hours reminder window (±1 min)
        const reminder24hStart = new Date(now.getTime() + 24 * 60 * 60 * 1000 - 60000);
        const reminder24hEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 60000);

        // 15 minutes reminder window (±1 min)
        const reminder15mStart = new Date(now.getTime() + 15 * 60 * 1000 - 60000);
        const reminder15mEnd = new Date(now.getTime() + 15 * 60 * 1000 + 60000);

        const meetings = await Meeting.find({
            status: "scheduled",
            startTime: {
                $gte: reminder15mStart,
                $lte: reminder24hEnd,
            },
        }).populate("userId advocateId");

        for (const meeting of meetings) {
            let type = null;

            if (meeting.startTime >= reminder24hStart && meeting.startTime <= reminder24hEnd) {
                type = "24_HOURS";
            }

            if (meeting.startTime >= reminder15mStart && meeting.startTime <= reminder15mEnd) {
                type = "15_MINUTES";
            }

            if (!type) continue;

            const subject = `Meeting Reminder (${type.replace("_", " ")})`;

            const message = `
        <h3>${meeting.meetingTitle}</h3>
        <p>Your meeting is scheduled for:</p>
        <p><b>${meeting.startTime.toLocaleString()}</b></p>
        <p>Please go to your dashboard and join the meeting at the scheduled time.</p>
        <br/>
        <p>Thank you,<br/>Omm Documentation Team</p>
      `;

            /* =========================
               SEND MAIL TO USER
            ========================= */
            if (meeting.userId?.email) {
                await sendEmail({
                    email: meeting.userId.email,
                    subject,
                    message,
                });
            }

            /* =========================
               SEND MAIL TO ADVOCATE
            ========================= */
            if (meeting.advocateId?.email) {
                await sendEmail({
                    email: meeting.advocateId.email,
                    subject,
                    message,
                });
            }

            /* =========================
               AUDIT LOG
            ========================= */
            await logMeetingAudit({
                meetingId: meeting._id,
                action: "REMINDER_SENT",
                meta: {
                    type,
                    sentTo: ["user", "advocate"],
                },
            });
        }
    } catch (err) {
        console.error("❌ Reminder cron error:", err);
    }
});

