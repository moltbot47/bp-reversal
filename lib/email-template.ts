export function magicLinkEmail({
  url,
  host,
}: {
  url: string;
  host: string;
}): { html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#EEEFE9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEEFE9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background-color:#FDFDF8;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <div style="width:56px;height:56px;background:#FEE2E2;border-radius:50%;margin:0 auto 16px;line-height:56px;font-size:28px;">
                ❤️
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#1D2939;">
                BP Reversal
              </h1>
              <p style="margin:8px 0 0;font-size:14px;color:#667085;">
                Your magic link is ready
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#1D2939;line-height:1.6;">
                Click the button below to sign in to your 90-day protocol tracker. This link expires in 24 hours.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${url}"
                       style="display:inline-block;padding:14px 32px;background-color:#EB9D2A;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:10px;box-shadow:0 2px 0 0 #C4800F;">
                      Sign in to BP Reversal
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:13px;color:#667085;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#EB9D2A;word-break:break-all;line-height:1.4;">
                ${url}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #E5E7EB;">
              <p style="margin:0;font-size:12px;color:#667085;text-align:center;line-height:1.5;">
                You received this email because someone requested a sign-in link for ${host}.
                If you didn't request this, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>

        <!-- Sub-footer -->
        <p style="margin:20px 0 0;font-size:11px;color:#98A2B3;text-align:center;">
          BP Reversal — Free health habit tracking
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Sign in to BP Reversal\n\nClick this link to sign in:\n${url}\n\nThis link expires in 24 hours.\n\nIf you didn't request this, you can safely ignore this email.`;

  return { html, text };
}
