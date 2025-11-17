import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  const res = await resend.emails.send({
    from: "noreply@valpriad.online",
    to: email,
    subject: "Confirm your email",
    html: `
      <h2>Welcome to MyApp!</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  });
  console.log(res);
}
