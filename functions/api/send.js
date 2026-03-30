export async function onRequestPost({ request, env }) {
  try {
    const { name, email, message } = await request.json()
    const apiKey = env.RESEND_API_KEY

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Portfolio Contact Form <portfolio@artjombecker.com>',
        to: 'hi@artjombecker.com',
        subject: `New Message from ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
        reply_to: email,
      }),
    })

    const data = await response.json()
    console.log('Resend API Response Status:', response.status)

    if (!response.ok) {
      console.error('Resend API Error Details:', JSON.stringify(data, null, 2))
      return new Response(JSON.stringify({
        error: data.message || 'Failed to send email',
        resend_details: data
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
