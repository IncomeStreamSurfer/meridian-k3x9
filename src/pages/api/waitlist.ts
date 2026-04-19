import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { sendEmail, waitlistConfirmationHtml } from '../../lib/email';

export const prerender = false;

async function hashIp(ip: string) {
  try {
    const data = new TextEncoder().encode(ip + ':meridian');
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .slice(0, 16)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return null;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const source = typeof body?.source === 'string' ? body.source.slice(0, 120) : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ua = request.headers.get('user-agent')?.slice(0, 240) || null;
    const ipRaw = clientAddress || request.headers.get('x-forwarded-for')?.split(',')[0] || '';
    const ip_hash = ipRaw ? await hashIp(ipRaw) : null;

    const { error } = await supabase.from('meridian_waitlist').insert({ email, source, ip_hash, user_agent: ua });

    if (error) {
      if ((error as any).code === '23505' || /duplicate/i.test(error.message)) {
        return new Response(JSON.stringify({ ok: true, duplicate: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      console.error('[waitlist] insert error', error);
      return new Response(JSON.stringify({ error: 'Could not save right now. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    sendEmail({ to: email, subject: "You're on the Meridian waitlist", html: waitlistConfirmationHtml(email), text: `You're in. Thanks for joining the Meridian waitlist — we'll be in touch before launch.` }).catch((e) => console.warn('[waitlist] email error', e));

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[waitlist] unhandled', err);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
