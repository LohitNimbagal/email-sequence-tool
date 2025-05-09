import { Agenda } from "@hokify/agenda";
import { Request, Response } from "express";
import nodemailer from "nodemailer"
import "dotenv/config"

const agenda = new Agenda({
    db: {
        address: process.env.ATLAS_URI!, // Add this to your .env file
        collection: "agendaJobs",
    },
})

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "roman.nienow18@ethereal.email",
        pass: "JXM8tyvc1q9uCGc3Kz",
    },
})

agenda.define("send scheduled email", async (job) => {

    const { to, subject, body } = job.attrs.data as {
        to: string
        subject: string
        body: string
    }

    try {
        const info = await transporter.sendMail({
            from: '"Roman Nienow" <roman.nienow18@ethereal.email>',
            to,
            subject,
            text: body
        })

        console.log("Email sent via Agenda:", info.messageId)

    } catch (error) {
        console.error("Agenda job failed to send email:", error)
    }
})


export const sendAnEmail = async (req: Request, res: Response) => {

    const { to, subject, body, scheduleDate, scheduleTime } = req.body;

    try {
        let scheduleAt: Date | null = null;

        if (scheduleDate && scheduleTime) {
            // Combine date and time into ISO format and parse
            scheduleAt = new Date(`${scheduleDate}T${scheduleTime}:00`);
        } else if (scheduleDate) {
            // Default time to midnight if only date is provided
            scheduleAt = new Date(`${scheduleDate}T00:00:00`);
        } else if (scheduleTime) {
            // Schedule for today at the given time
            const today = new Date();
            const dateStr = today.toISOString().split("T")[0];
            scheduleAt = new Date(`${dateStr}T${scheduleTime}:00`);
        }

        await agenda.start();

        if (scheduleAt && !isNaN(scheduleAt.getTime())) {
            // Valid date, schedule the job
            await agenda.schedule(scheduleAt, "send scheduled email", {
                to,
                subject,
                body,
            });

            res.json({
                success: true,
                message: `Email scheduled for ${scheduleAt.toISOString()}`,
            });

        } else {
            // No valid schedule, send immediately
            await agenda.now("send scheduled email", {
                to,
                subject,
                body
            });

            res.json({
                success: true,
                message: `Email sent immediately`,
            });
        }
    } catch (error) {
        console.error("Failed to send/schedule email:", error);
        res.status(500).json({ success: false, error: "Failed to send/schedule email" });
    }
};
