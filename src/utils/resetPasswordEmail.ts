import { getServerURL } from "./serverURL";

function escapeHTML(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

export function resetPasswordURL(token: string) {
  return `${getServerURL()}/admin/reset/${encodeURIComponent(token)}`;
}

export function generateResetPasswordEmail({ email, token }: { email?: string; token?: string }) {
  if (!token) throw new Error("Reset-password token is missing.");

  const resetURL = resetPasswordURL(token);
  const safeURL = escapeHTML(resetURL);
  const safeEmail = email ? escapeHTML(email) : "akun admin Anda";

  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Atur ulang kata sandi</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f6fb;color:#17213a;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f6fb;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e3e9f3;border-radius:18px;overflow:hidden;box-shadow:0 12px 36px rgba(15,39,84,.08);">
            <tr>
              <td style="padding:26px 32px;background:#123d87;color:#ffffff;">
                <div style="font-size:20px;font-weight:700;line-height:1.3;">PT Mahaga Widya Cita</div>
                <div style="margin-top:5px;font-size:13px;line-height:1.5;color:#dce8ff;">Portal Administrasi</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 30px;">
                <div style="display:inline-block;padding:6px 11px;border-radius:999px;background:#edf4ff;color:#1859bd;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;">Keamanan akun</div>
                <h1 style="margin:18px 0 12px;font-size:28px;line-height:1.3;color:#102754;">Atur ulang kata sandi Anda</h1>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#526581;">Kami menerima permintaan untuk mengatur ulang kata sandi akun <strong style="color:#243b63;">${safeEmail}</strong>.</p>
                <p style="margin:0 0 26px;font-size:15px;line-height:1.7;color:#526581;">Klik tombol berikut untuk membuat kata sandi baru. Tautan ini hanya berlaku selama <strong>60 menit</strong>.</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td bgcolor="#1859bd" style="border-radius:10px;">
                      <a href="${safeURL}" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">Atur ulang kata sandi</a>
                    </td>
                  </tr>
                </table>
                <div style="margin:28px 0 0;padding:16px 18px;border-radius:12px;background:#fff8e8;border:1px solid #f4dfaa;color:#6d5520;font-size:13px;line-height:1.65;">
                  <strong>Anda tidak meminta perubahan ini?</strong><br />Abaikan email ini. Kata sandi Anda tidak akan berubah dan tidak ada tindakan lain yang diperlukan.
                </div>
                <p style="margin:26px 0 8px;font-size:12px;line-height:1.6;color:#7b8ba5;">Jika tombol tidak berfungsi, salin URL berikut ke browser:</p>
                <p style="margin:0;word-break:break-all;font-size:12px;line-height:1.6;"><a href="${safeURL}" style="color:#1859bd;text-decoration:underline;">${safeURL}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #e8edf5;background:#f9fbfe;color:#7b8ba5;font-size:12px;line-height:1.6;">
                Email otomatis dari PT Mahaga Widya Cita. Demi keamanan, jangan teruskan email atau tautan ini kepada siapa pun.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
