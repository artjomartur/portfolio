import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUICK_ACTIONS = [
  'Wer bist du?',
  'Welche Projekte gibt es?',
  'Wie kann ich dich kontaktieren?',
  'Welche Skills hast du?',
]

const BASE_INFO = {
  intro:
    'Ich bin Artjom Becker, Informatik-Student mit Fokus auf Softwareentwicklung, UI/UX und technische Problemlösung.',
  projects:
    'Wichtige Projekte: ExerCube (Gruppenprojekt, Note 1,0), ArcadeSuite (eigenes Bachelor-Projekt) und dieses Portfolio.',
  contact:
    'Kontakt: artjomarturbecker@icloud.com, WhatsApp/Telegram: 015203322770, GitHub: github.com/DjamilB.',
  skills:
    'Skills: JavaScript/TypeScript, Python, Java, React, Vite, Node.js, SQL, Git, Linux, Algorithmen und Datenstrukturen.',
  leadership:
    'Ich habe im Bachelor-Praktikum die Teamleitung für drei Teams übernommen.',
}

function generateAnswer(input) {
  const q = input.toLowerCase()

  if (q.includes('wer') || q.includes('über') || q.includes('about')) {
    return `${BASE_INFO.intro} ${BASE_INFO.leadership}`
  }
  if (q.includes('projekt') || q.includes('arbeit') || q.includes('repo')) {
    return BASE_INFO.projects
  }
  if (q.includes('kontakt') || q.includes('email') || q.includes('mail') || q.includes('whatsapp') || q.includes('telegram')) {
    return BASE_INFO.contact
  }
  if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
    return BASE_INFO.skills
  }
  if (q.includes('team') || q.includes('leitung')) {
    return BASE_INFO.leadership
  }

  return 'Gute Frage! Frag mich gerne zu Artjom, Projekten, Skills oder Kontakt.'
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! Ich bin der Portfolio-Bot. Frag mich etwas über Artjom, Projekte oder Kontakt.',
    },
  ])

  const canSend = useMemo(() => input.trim().length > 0, [input])

  const sendMessage = (text) => {
    const value = text.trim()
    if (!value) return
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: value },
      { role: 'bot', text: generateAnswer(value) },
    ])
    setInput('')
  }

  return (
    <div className="chatbot">
      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Chatbot öffnen"
      >
        {isOpen ? '×' : '💬'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <div className="chatbot-header">
              <strong>Artjom Bot</strong>
              <span>Basisinfos</span>
            </div>

            <div className="chatbot-messages">
              {messages.map((m, idx) => (
                <div
                  key={`${m.role}-${idx}`}
                  className={`chatbot-msg ${m.role === 'user' ? 'chatbot-msg--user' : ''}`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="chatbot-quick">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chatbot-chip"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              className="chatbot-form"
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(input)
              }}
            >
              <input
                className="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Frag etwas über Artjom..."
              />
              <button type="submit" className="chatbot-send" disabled={!canSend}>
                Senden
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chatbot
