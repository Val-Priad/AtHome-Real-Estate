"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailToAgent(
  agentEmail: string,
  data: {
    name: string;
    email: string;
    phone: string;
    description: string;
    estateTitle?: string;
    estateUrl?: string;
  },
) {
  try {
    const { name, email, phone, description, estateTitle, estateUrl } = data;

    const html = `
      <h2>New inquiry from ${name}</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Phone:</strong> ${phone}</p>

      ${estateTitle ? `<p><strong>Estate:</strong> ${estateTitle}</p>` : ""}
      ${estateUrl ? `<p><a href="${estateUrl}">Open Estate Listing</a></p>` : ""}

      <h3>Message:</h3>
      <p>${description}</p>

      <br/>
      <p>This message was sent through your real estate platform.</p>
    `;

    const res = await resend.emails.send({
      from: "noreply@valpriad.online",
      to: agentEmail,
      subject: `New inquiry from ${name}`,
      html,
    });

    if (res.error) {
      throw new Error(res.error.message || "Failed to send email");
    }

    return res.data;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}
