import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LINES = [
  { prefix: 'artjom@portfolio ~ % ', content: 'whoami', isCmd: true },
  { prefix: '', content: 'Artjom Becker · Informatik-Student', isCmd: false },
  { prefix: '', content: '', isCmd: false },
  { prefix: 'artjom@portfolio ~ % ', content: 'cat highlights.txt', isCmd: true },
  { prefix: '', content: '', isCmd: false },
  { prefix: '', content: '★ ExerCube – Gruppenprojekt (Note 1,0)', isCmd: false },
  { prefix: '', content: '★ ArcadeSuite – Eigenes Bachelor-Projekt', isCmd: false },
  { prefix: '', content: '★ Teamleitung für 3 Teams (Bachelor-Praktikum)', isCmd: false },
  { prefix: '', content: '★ Cyber Quest – Ethical Hacking Lernplattform', isCmd: false },
  { prefix: '', content: '', isCmd: false },
]

function Terminal({ onMouseEnter, onMouseLeave }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [renderedLines, setRenderedLines] = useState([])
  const [showCursor, setShowCursor] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (lineIndex >= LINES.length) {
      setDone(true)
      return
    }

    const line = LINES[lineIndex]
    const textToType = line.content
    const delay = line.content === '' ? 400 : (line.isCmd ? 45 : 38)

    if (line.content === '' && !line.prefix) {
      const t = setTimeout(() => {
        setRenderedLines((prev) => [...prev, { prefix: '', content: '', isCmd: false }])
        setLineIndex((i) => i + 1)
      }, 350)
      return () => clearTimeout(t)
    }

    if (charIndex <= textToType.length) {
      const t = setTimeout(() => {
        const contentSoFar = textToType.slice(0, charIndex)
        setRenderedLines((prev) => {
          const next = [...prev]
          if (charIndex === 0) {
            next.push({
              prefix: line.prefix,
              content: contentSoFar,
              isCmd: line.isCmd,
            })
          } else {
            next[next.length - 1] = {
              ...next[next.length - 1],
              content: contentSoFar,
            }
          }
          return next
        })
        if (charIndex >= textToType.length) {
          setLineIndex((i) => i + 1)
          setCharIndex(0)
        } else {
          setCharIndex((c) => c + 1)
        }
      }, charIndex === 0 ? 180 : delay)
      return () => clearTimeout(t)
    }
  }, [lineIndex, charIndex])

  useEffect(() => {
    const id = setInterval(() => setShowCursor((c) => !c), 530)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      className="terminal"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-btn terminal-btn--red" />
          <span className="terminal-btn terminal-btn--yellow" />
          <span className="terminal-btn terminal-btn--green" />
        </div>
        <span className="terminal-title">artjom — zsh</span>
      </div>
      <div className="terminal-body">
        {renderedLines.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.prefix && <span className="terminal-prompt">{line.prefix}</span>}
            <span className={line.isCmd ? 'terminal-cmd' : 'terminal-output'}>{line.content}</span>
          </div>
        ))}
        <div className="terminal-line">
          {done && <span className="terminal-prompt">artjom@portfolio ~ % </span>}
          <span className={`terminal-cursor ${showCursor ? 'terminal-cursor--visible' : ''}`}>|</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Terminal
