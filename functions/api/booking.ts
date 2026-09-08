interface Env { RESEND_API_KEY: string; BOOKING_TO_EMAIL: string; TURNSTILE_SECRET_KEY: string; }

const required = ['pickup','dropoff','date','time','name','phone','email'] as const;

function clean(value: FormDataEntryValue | null) { return typeof value === 'string' ? value.trim().slice(0, 2000) : ''; }

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    for (const field of required) {
      if (!clean(form.get(field))) return new Response('Missing required field.', { status: 400 });
    }

    const email = clean(form.get('email'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response('Invalid email address.', { status: 400 });

    const token = clean(form.get('turnstileToken'));
    if (!token) return new Response('Spam protection verification is required.', { status: 400 });

    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get('CF-Connecting-IP') })
    });
    const turnstile = await verify.json<{ success?: boolean }>();
    if (!turnstile.success) return new Response('Spam protection verification failed.', { status: 400 });

    const payload = {
      from: 'SmartDrive247 Website <onboarding@resend.dev>',
      to: [env.BOOKING_TO_EMAIL],
      reply_to: email,
      subject: `New booking request: ${clean(form.get('pickup'))} → ${clean(form.get('dropoff'))}`,
      text: [
        `Name: ${clean(form.get('name'))}`,
        `Phone: ${clean(form.get('phone'))}`,
        `Email: ${email}`,
        `Pickup: ${clean(form.get('pickup'))}`,
        `Drop-off: ${clean(form.get('dropoff'))}`,
        `Date: ${clean(form.get('date'))}`,
        `Time: ${clean(form.get('time'))}`,
        `Passengers: ${clean(form.get('passengers'))}`,
        `Luggage: ${clean(form.get('luggage'))}`,
        `Special requests: ${clean(form.get('specialRequests'))}`
      ].join('\n')
    };

    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!sent.ok) return new Response('Unable to send booking request.', { status: 502 });

    return new Response(null, { status: 303, headers: { Location: '/booking?sent=1' } });
  } catch {
    return new Response('Unable to process your request.', { status: 500 });
  }
};
