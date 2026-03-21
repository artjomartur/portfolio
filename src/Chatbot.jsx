import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUICK_ACTIONS_DE = [
  '👋 Wer bist du?',
  '🚀 Welche Projekte gibt es?',
  '📬 Wie kann ich dich kontaktieren?',
  '🧠 Welche Skills hast du?',
]

const QUICK_ACTIONS_EN = [
  '👋 Who are you?',
  '🚀 What projects do you have?',
  '📬 How can I contact you?',
  '🧠 What skills do you have?',
]

const BASE_INFO_DE = {
  intro:
    'Ich bin Artjom Becker, Informatik-Student mit Fokus auf Softwareentwicklung, UI/UX und technische Problemlösung.',
  projects:
    'Wichtige Projekte: ExerCube (Gruppenprojekt, Note 1,0), ArcadeSuite (eigenes Bachelor-Projekt) und dieses Portfolio.',
  contact:
    'Kontakt: hi@artjombecker.com, WhatsApp/Telegram: 015203322770, GitHub: github.com/DjamilB.',
  skills:
    'Skills: JavaScript/TypeScript, Python, Java, React, Vite, Node.js, SQL, Git, Linux, Algorithmen und Datenstrukturen.',
  leadership:
    'Ich habe im Bachelor-Praktikum die Teamleitung für drei Teams übernommen.',
}

const BASE_INFO_EN = {
  intro:
    'I am Artjom Becker, a computer science student focused on software development, UI/UX, and technical problem solving.',
  projects:
    'Key projects: ExerCube (group project, grade 1.0), ArcadeSuite (own bachelor project), and this portfolio.',
  contact:
    'Contact: hi@artjombecker.com, WhatsApp/Telegram: 015203322770, GitHub: github.com/DjamilB.',
  skills:
    'Skills: JavaScript/TypeScript, Python, Java, React, Vite, Node.js, SQL, Git, Linux, algorithms and data structures.',
  leadership:
    'I led three teams during a bachelor internship.',
}

function generateAnswer(input, lang) {
  const BASE_INFO = lang === 'de' ? BASE_INFO_DE : BASE_INFO_EN
  const q = input.toLowerCase()

  if (q.includes('wer') || q.includes('über') || q.includes('about') || q.includes('who')) {
    return `${BASE_INFO.intro} ${BASE_INFO.leadership}`
  }
  if (q.includes('projekt') || q.includes('arbeit') || q.includes('repo') || q.includes('project')) {
    return BASE_INFO.projects
  }
  if (q.includes('kontakt') || q.includes('email') || q.includes('mail') || q.includes('whatsapp') || q.includes('telegram') || q.includes('contact')) {
    return BASE_INFO.contact
  }
  if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
    return BASE_INFO.skills
  }
  if (q.includes('team') || q.includes('leitung') || q.includes('lead')) {
    return BASE_INFO.leadership
  }

  return lang === 'de'
    ? 'Gute Frage! Frag mich gerne zu Artjom, Projekten, Skills oder Kontakt.'
    : 'Great question! Ask me about Artjom, projects, skills, or contact.'
}

function Chatbot({ lang = 'de' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const quickOnlyMode = true
  const messagesEndRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text:
        lang === 'de'
          ? 'Hi! 👋 Ich bin der Portfolio-Bot. Frag mich etwas über Artjom, Projekte oder Kontakt.'
          : 'Hi! 👋 I am the portfolio bot. Ask me something about Artjom, projects, or contact.',
    },
  ])

  const canSend = useMemo(() => input.trim().length > 0, [input])
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  useEffect(() => {
    if (!isOpen) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isThinking, isOpen])

  const personaPrompt =
    lang === 'de'
      ? 'Du bist der Portfolio-Assistent von Artjom Becker. Sprich natürlich, freundlich, prägnant und mit etwas Charakter. Bleibe bei Fakten über Artjom: Informatikstudent in Darmstadt, Projekte ExerCube (1,0), ArcadeSuite, Teamleitung für 3 Teams, Kontakt per Mail/WhatsApp/Telegram. Wenn etwas unbekannt ist, sag es ehrlich und schlage vor nachzufragen.'
      : 'You are Artjom Becker\'s portfolio assistant. Speak naturally, friendly, concise, with a little personality. Stay factual about Artjom: computer science student in Darmstadt, projects ExerCube (grade 1.0), ArcadeSuite, team lead for 3 teams, contact via email/WhatsApp/Telegram. If unknown, be honest and suggest asking directly.'

  const localStyledAnswer = (value) => {
    const base = generateAnswer(value, lang)
    const extrasDe = [
      'Wenn du willst, zeige ich dir direkt den passenden Abschnitt auf der Seite.',
      'Dazu kann ich dir auch die wichtigsten Punkte als Kurzfassung geben.',
      'Sag einfach „mehr Details“, dann gehe ich tiefer rein.',
    ]
    const extrasEn = [
      'If you want, I can point you to the exact section on this page.',
      'I can also give you a short executive summary.',
      'Say “more details” and I will expand.',
    ]
    const extras = lang === 'de' ? extrasDe : extrasEn
    return `${base} ${extras[Math.floor(Math.random() * extras.length)]}`
  }

  const askLLM = async (userText) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: personaPrompt },
          ...messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          { role: 'user', content: userText },
        ],
        temperature: 0.7,
        max_tokens: 220,
      }),
    })

    if (!response.ok) throw new Error('LLM request failed')
    const data = await response.json()
    return data?.choices?.[0]?.message?.content?.trim()
  }

  const sendMessage = async (text) => {
    const value = text.trim()
    if (!value) return
    setMessages((prev) => [...prev, { role: 'user', text: value }])
    setInput('')
    setIsThinking(true)

    try {
      let reply
      if (apiKey) {
        reply = await askLLM(value)
      } else {
        reply = localStyledAnswer(value)
      }
      setMessages((prev) => [...prev, { role: 'bot', text: reply || localStyledAnswer(value) }])
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: localStyledAnswer(value) }])
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="chatbot">
      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={lang === 'de' ? 'Chatbot öffnen' : 'Open chatbot'}
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
              <span>{lang === 'de' ? 'Basisinfos' : 'Base info'}</span>
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
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-quick">
              {(lang === 'de' ? QUICK_ACTIONS_DE : QUICK_ACTIONS_EN).map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chatbot-chip"
                  onClick={() => void sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              className={`chatbot-form ${quickOnlyMode ? 'chatbot-form--locked' : ''}`}
              onSubmit={(e) => {
                e.preventDefault()
                if (quickOnlyMode) return
                void sendMessage(input)
              }}
            >
              <input
                className="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'de' ? 'Bitte nutze die Buttons oben' : 'Please use the buttons above'}
                disabled={quickOnlyMode}
              />
              <button type="submit" className="chatbot-send" disabled={quickOnlyMode || !canSend}>
                {lang === 'de' ? 'Senden' : 'Send'}
              </button>
            </form>
            {isThinking && (
              <div className="chatbot-thinking">
                {lang === 'de' ? '🤖 Artjom Bot denkt nach ...' : '🤖 Artjom Bot is thinking ...'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chatbot
