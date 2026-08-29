interface Env {
  RESEND_API_KEY: string;
  QUOTE_TO_EMAIL: string;
  QUOTE_FROM_EMAIL: string;
  TURNSTILE_SECRET_KEY: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const name = String(form.get('name') || '').trim();
  const phone = String(form.get('phone') || '').trim();
  const pickup = String(form.get('pickup') || '').trim();
  const dropoff = String(form.get('dropoff') || '').trim();
  const date = String(form.get('date') || '').trim();
  const time = String(form.get('time') || '').trim();
  const notes = String(form.get('notes') || '').trim();
  const honeypot = String(form.get('website') || '').trim();
  const turnstileToken = String(form.get('cf-turnstile-response') || '').trim();

  if (honeypot) return json({ ok: true });
  if (!name || !phone || !pickup || !dropoff || !date || !time) {
    return json({ error: 'Please complete the required fields.' }, 400);
  }
  if (!turnstileToken) return json({ error: 'Please complete the spam protection check.' }, 400);

  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: request.headers.get('CF-Connecting-IP') || undefined,
    }),
  });

  const verification = (await verify.json()) as { success?: boolean };
  if (!verification.success) return json({ error: 'The spam protection check failed. Please try again.' }, 403);

  const safe = (value: string) => value.replace(/[<>]/g, '');
  const subject = `Smart Drive 24/7 quote · ${safe(name)} · ${safe(date)} ${safe(time)}`;
  const text = [
    `New quote request from ${safe(name)}`,
    `Phone: ${safe(phone)}`,
    `Pickup: ${safe(pickup)}`,
    `Drop-off: ${safe(dropoff)}`,
    `Date: ${safe(date)}`,
    `Time: ${safe(time)}`,
    `Notes: ${safe(notes || 'None')}`,
  ].join('\n');
  const html = `<h2>New Smart Drive 24/7 quote request</h2><p><strong>Name:</strong> ${safe(name)}</p><p><strong>Phone:</strong> ${safe(phone)}</p><p><strong>Pickup:</strong> ${safe(pickup)}</p><p><strong>Drop-off:</strong> ${safe(dropoff)}</p><p><strong>Date:</strong> ${safe(date)}</p><p><strong>Time:</strong> ${safe(time)}</p><p><strong>Notes:</strong> ${safe(notes || 'None')}</p>`;

  const resend = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      from: env.QUOTE_FROM_EMAIL,
      to: [env.QUOTE_TO_EMAIL],
      reply_to: undefined,
      subject,
      text,
      html,
    }),
  });

  if (!resend.ok) {
    console.error('Resend error', await resend.text());
    return json({ error: 'We could not send your enquiry. Please text 07762 253 656 instead.' }, 502);
  }

  return json({ ok: true });
};
