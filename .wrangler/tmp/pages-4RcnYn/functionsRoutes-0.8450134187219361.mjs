import { onRequestPost as __api_chat_js_onRequestPost } from "/Users/artjombecker/Documents/Bildung/Projekte/portfolio-1/functions/api/chat.js"
import { onRequestPost as __api_send_js_onRequestPost } from "/Users/artjombecker/Documents/Bildung/Projekte/portfolio-1/functions/api/send.js"

export const routes = [
    {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_js_onRequestPost],
    },
  {
      routePath: "/api/send",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_send_js_onRequestPost],
    },
  ]