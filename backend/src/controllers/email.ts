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

// agenda.define('welcome', async () => {
//     console.log('welcome to agenda!!!');
// })


// await agenda.every('5 seconds', 'welcome')

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "roman.nienow18@ethereal.email",
        pass: "JXM8tyvc1q9uCGc3Kz",
    },
})

agenda.define("send scheduled email", async (job) => {

    const { to, subject, text, html } = job.attrs.data as {
        to: string
        subject: string
        text: string
        html: string
    }

    try {
        const info = await transporter.sendMail({
            from: '"Roman Nienow" <roman.nienow18@ethereal.email>',
            to,
            subject,
            text,
            html,
        })
        console.log("Email sent via Agenda:", info.messageId)
    } catch (error) {
        console.error("Agenda job failed to send email:", error)
    }
})


export const sendAnEmail = async (req: Request, res: Response) => {

    const { to, subject, text, html } = req.body;

    try {
        // Schedule for 1 hour from now
        const scheduleAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour in ms

        await agenda.start()

        // Schedule the email job
        await agenda.schedule(scheduleAt, "send scheduled email", {
            to,
            subject,
            text,
            html,
        });

        res.json({
            success: true,
            message: `Email scheduled for ${scheduleAt}`,
        });

    } catch (error) {
        console.error("Failed to schedule email:", error);
        res.status(500).json({ success: false, error: "Failed to schedule email" });
    }
};