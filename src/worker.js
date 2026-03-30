import { onRequestPost as handleSend } from '../functions/api/send.js'
import { onRequestPost as handleChat } from '../functions/api/chat.js'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Route API requests
    if (url.pathname === '/api/send' && request.method === 'POST') {
      return handleSend({ request, env })
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat({ request, env })
    }

    // Serve static assets for all other requests
    return env.ASSETS.fetch(request)
  }
}
