import nodemailer from 'nodemailer';
import { env } from '../config/env.config.js';
import { logger } from '../utils/logger.js';

export interface EmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export async function sendContactNotificationEmail(payload: EmailPayload): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const recipientEmail = env.CONTACT_RECEIVER_EMAIL || 'cocdhruv4444@gmail.com';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="background-color: #0058be; padding: 16px 20px; border-radius: 8px 8px 0 0; color: #ffffff;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">📬 New Contact Message Received</h2>
      </div>
      <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <p style="margin-top: 0; color: #475569; font-size: 14px;">You have received a new inquiry from your portfolio contact form:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; width: 100px;">Sender Name:</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${payload.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Sender Email:</td>
            <td style="padding: 8px 0; color: #0058be; font-size: 14px; font-weight: 500;">
              <a href="mailto:${payload.email}" style="color: #0058be; text-decoration: none;">${payload.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Subject:</td>
            <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${payload.subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Date & Time:</td>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">${payload.createdAt}</td>
          </tr>
        </table>

        <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #0058be; margin-top: 10px;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Message Content:</p>
          <p style="margin: 0; font-size: 14px; color: #1e293b; white-space: pre-wrap; line-height: 1.6;">${payload.message}</p>
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
          <a href="mailto:${payload.email}?subject=Re: ${encodeURIComponent(payload.subject)}" 
             style="display: inline-block; background-color: #2170e4; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
            Reply to ${payload.name}
          </a>
        </div>
      </div>
    </div>
  `;

  // Check if SMTP options are configured
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        secure: env.SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${payload.name} via Portfolio" <${env.SMTP_USER}>`,
        replyTo: payload.email,
        to: recipientEmail,
        subject: `[Portfolio Contact] ${payload.subject}`,
        html: htmlContent,
      });

      logger.info(`📧 Notification email sent to ${recipientEmail} via SMTP`);
      return { success: true };
    } catch (error: any) {
      logger.error(`❌ SMTP Email send failed: ${error.message}. Saved message to DB.`);
      return { success: true, simulated: true, error: error.message };
    }
  } else {
    // Log simulation if SMTP variables are not set yet
    logger.info(`📧 [EMAIL NOTIFICATION DISPATCHED] To: ${recipientEmail} | Subject: ${payload.subject} | From: ${payload.email} (${payload.name})`);
    return { success: true, simulated: true };
  }
}
