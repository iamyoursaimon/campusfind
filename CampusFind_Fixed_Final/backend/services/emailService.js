const nodemailer = require("nodemailer");

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || SMTP_HOST === "smtp.example.com") return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

async function notifyUsersAboutReport(report, recipients) {
  const transporter = createTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const emails = [...new Set((recipients || []).filter(Boolean).map(String))];

  if (!transporter || !from || !emails.length) {
    return { sent: false, skipped: true };
  }

  const status = report.status === "lost" ? "Lost item" : "Found item";
  const campus = report.campus || "Campus";
  const subject = `CampusFind: ${status} reported - ${report.title}`;
  const text = [
    `A new ${status.toLowerCase()} was reported on CampusFind.`,
    `Item: ${report.title}`,
    `Campus: ${campus}`,
    `Location: ${report.location}`,
    `Description: ${report.description || "No description provided."}`,
    "",
    "Please open CampusFind to view the report and contact the reporter safely."
  ].join("\n");

  await transporter.sendMail({
    from,
    to: from,
    bcc: emails,
    subject,
    text
  });

  return { sent: true, count: emails.length };
}

module.exports = { notifyUsersAboutReport };
