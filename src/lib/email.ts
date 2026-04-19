const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY || '';
const FROM = 'Meridian Coffee <onboarding@resend.dev>';

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}) {
  if (!RESEND_API_KEY) {
    console.warn('[resend] RESEND_API_KEY missing — skipping send');
    return { id: null, skipped: true };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: opts.from || FROM,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn('[resend] send failed', res.status, body);
      return { id: null, error: body };
    }
    return (await res.json()) as { id: string };
  } catch (err) {
    console.warn('[resend] send threw', err);
    return { id: null, error: String(err) };
  }
}

export function waitlistConfirmationHtml(email: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f5efe6;font-family:Georgia,serif;color:#1a1613;">
  <div style="max-width:560px;margin:0 auto;padding:48px 32px;">
    <div style="font-family:Georgia,serif;font-size:28px;letter-spacing:-0.02em;margin-bottom:8px;">Meridian</div>
    <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#b87333;margin-bottom:32px;">Waitlist Confirmed</div>
    <h1 style="font-family:Georgia,serif;font-weight:400;font-size:34px;line-height:1.1;margin:0 0 24px;">You're in. Something good is brewing.</h1>
    <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Thank you for joining the Meridian waitlist. Your seat is reserved — ${email}.</p>
    <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">We're in the final weeks before the first roast leaves our doors. Between now and then, expect a quiet, occasional letter — a postcard from origin, a photograph from the roastery, and a private code on launch day that won't be shared publicly.</p>
    <p style="font-size:16px;line-height:1.7;margin:0 0 32px;">Until then, stay curious.</p>
    <div style="height:1px;background:#1a1613;opacity:0.15;margin:32px 0;"></div>
    <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#7a6f62;margin:0;">— The Meridian Team · Sourced with intention · Roasted with patience</p>
  </div>
  </body></html>`;
}
