export async function notifyNewUser(email: string) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  const webhookUrl = process.env.ADMIN_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  // Send email notification
  if (adminEmail && resendKey && fromEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: adminEmail,
          subject: `New BP Reversal signup: ${email}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:400px;padding:20px;">
              <h2 style="color:#1D2939;margin:0 0 8px;">New User Signup</h2>
              <p style="color:#667085;margin:0 0 16px;">Someone just requested a magic link.</p>
              <div style="background:#F3F4F6;border-radius:8px;padding:12px 16px;">
                <p style="margin:0 0 4px;font-size:14px;color:#667085;">Email</p>
                <p style="margin:0;font-size:16px;font-weight:600;color:#1D2939;">${email}</p>
              </div>
              <p style="color:#667085;font-size:12px;margin:16px 0 0;">${timestamp} CST</p>
              <p style="margin:12px 0 0;">
                <a href="https://bp-reversal.vercel.app/admin"
                   style="color:#EB9D2A;font-size:14px;font-weight:600;">
                  View Admin Dashboard →
                </a>
              </p>
            </div>
          `,
          text: `New BP Reversal signup: ${email} at ${timestamp} CST`,
        }),
      });
    } catch (err) {
      console.error("Admin email notification failed:", err);
    }
  }

  // Send Discord/Slack webhook
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🆕 **New BP Reversal signup**\n📧 ${email}\n🕐 ${timestamp} CST`,
        }),
      });
    } catch (err) {
      console.error("Webhook notification failed:", err);
    }
  }
}
