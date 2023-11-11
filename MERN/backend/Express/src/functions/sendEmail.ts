// Module for Node.js apps to allow for easy email sending.
import nodemailer from "nodemailer";

import { SMTP } from "../../config/config";
const sendEmail = async (options: any) => {
    try {
        const transporter = nodemailer.createTransport({
            host: SMTP.host,
            port: SMTP.port,
            auth: {
                user: SMTP.email,
                pass: SMTP.password,
            },
        });

        const msg = {
            from: `${SMTP.fromEmail}`, // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            html: options.html
        };

        const info = await transporter.sendMail(msg);

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.log(error);
    }
}
export { sendEmail };
