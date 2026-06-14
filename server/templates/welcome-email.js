export const welcomeEmailTemplate = (name) => {
	return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>

  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:12px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td align="center"
                style="background:#2563eb;padding:30px;">
                <h1 style="margin:0;color:#ffffff;">
                  QuickShop
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px;">
                <h2 style="margin-top:0;color:#111827;">
                  Welcome, ${name}! 🎉
                </h2>

                <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                  Your account has been successfully created and verified.
                </p>

                <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                  You can now explore products, save favorites,
                  place orders, and enjoy exclusive deals.
                </p>

                <div style="text-align:center;margin:35px 0;">
                  <a
                    href="${process.env.CLIENT_URL}"
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:8px;
                      font-weight:bold;
                    "
                  >
                    Start Shopping
                  </a>
                </div>

                <p style="color:#6b7280;">
                  If you have any questions, simply reply to this email.
                </p>

                <p style="margin-top:30px;color:#111827;">
                  Thanks,<br />
                  <strong>QuickShop Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="
                  background:#f9fafb;
                  padding:20px;
                  color:#9ca3af;
                  font-size:13px;
                ">
                © 2026 QuickShop. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
