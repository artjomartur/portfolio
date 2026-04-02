import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'

const COMMANDS = ['help', 'ls', 'whoami', 'clear', 'contact', 'skills', 'projects', 'cat']

function Terminal({ lang = 'de', onMouseEnter, onMouseLeave, projectTitles = [] }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [renderedLines, setRenderedLines] = useState([])
  const [showCursor, setShowCursor] = useState(true)
  const [done, setDone] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  const INITIAL_LINES = useMemo(() => [
    { prefix: 'artjom@portfolio ~ % ', content: 'whoami', isCmd: true },
    { prefix: '', content: lang === 'de' ? 'Artjom Becker · Informatik-Student' : 'Artjom Becker · Computer Science Student', isCmd: false },
    { prefix: '', content: '', isCmd: false },
    { prefix: 'artjom@portfolio ~ % ', content: 'cat highlights.txt', isCmd: true },
    { prefix: '', content: '', isCmd: false },
    ...(Array.isArray(projectTitles) ? projectTitles.slice(0, 4) : []).map(title => ({ prefix: '', content: `★ ${title}`, isCmd: false })),
    { prefix: '', content: '', isCmd: false },
  ], [lang, projectTitles])

  // Focus input when animation is done
  useEffect(() => {
    if (done && inputRef.current) {
      // Use a longer timeout to ensure all layout shifts and animations are finished
      const t = setTimeout(() => {
        // Only auto-focus if the element is actually in the viewport
        const rect = inputRef.current?.getBoundingClientRect()
        const isInViewport = rect && rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        
        if (isInViewport) {
          inputRef.current?.focus({ preventScroll: true })
        }
      }, 300)
      return () => clearTimeout(t)
    }
  }, [done])

  // Typing animation for initial lines
  useEffect(() => {
    if (lineIndex >= INITIAL_LINES.length) {
      setDone(true)
      return
    }

    const line = INITIAL_LINES[lineIndex]
    const textToType = line.content
    
    // If it's a spacer line with no prefix and no content
    if (!line.prefix && line.content === '') {
      const t = setTimeout(() => {
        setRenderedLines((prev) => [...prev, { prefix: '', content: '', isCmd: false }])
        setLineIndex((i) => i + 1)
        setCharIndex(0)
      }, 200)
      return () => clearTimeout(t)
    }

    // Typing logic
    if (charIndex <= textToType.length) {
      const delay = line.isCmd ? 40 : 25
      const t = setTimeout(() => {
        setRenderedLines((prev) => {
          const next = [...prev]
          if (charIndex === 0) {
            next.push({
              prefix: line.prefix,
              content: textToType.slice(0, 1),
              isCmd: line.isCmd,
            })
          } else {
            next[next.length - 1] = {
              ...next[next.length - 1],
              content: textToType.slice(0, charIndex + 1),
            }
          }
          return next
        })

        if (charIndex >= textToType.length - 1) {
          setLineIndex((i) => i + 1)
          setCharIndex(0)
        } else {
          setCharIndex((c) => c + 1)
        }
      }, charIndex === 0 ? 150 : delay)
      return () => clearTimeout(t)
    }
  }, [lineIndex, charIndex, INITIAL_LINES])

  // Scroll to bottom (only when new lines are added, not while typing)
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [renderedLines])

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setShowCursor((c) => !c), 530)
    return () => clearInterval(id)
  }, [])

  const handleCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase()
    const args = cmd.split(' ')
    const baseCmd = args[0]
    
    let output = []
    
    if (cmd) {
      setHistory(prev => [rawCmd, ...prev])
      setHistoryIndex(-1)
    }

    switch (baseCmd) {
      case 'help':
        output = lang === 'de' 
          ? ['Verfügbare Befehle: help, ls, projects, whoami, skills, contact, clear, cat [file]']
          : ['Available commands: help, ls, projects, whoami, skills, contact, clear, cat [file]']
        break
      case 'ls':
      case 'projects':
        output = Array.isArray(projectTitles) && projectTitles.length > 0 
          ? projectTitles.map(t => `★ ${t}`)
          : (lang === 'de' ? ['Keine Projekte gefunden.'] : ['No projects found.'])
        break
      case 'whoami':
        output = [lang === 'de' ? 'Artjom Becker · Informatik-Student an der TU Darmstadt' : 'Artjom Becker · CS Student at TU Darmstadt']
        break
      case 'skills':
        output = ['JavaScript, TypeScript, Python, React, Node.js, SQL, Java']
        break
      case 'contact':
        output = ['Website: nexus.artjombecker.com', 'Email: hi@artjombecker.com', 'GitHub: github.com/artjomartur', 'Instagram: @artjomartur777']
        break
      case 'clear':
        setRenderedLines([])
        return
      case 'cat':
        if (args[1] === 'highlights.txt') {
          output = Array.isArray(projectTitles) ? projectTitles.slice(0, 4).map(t => `★ ${t}`) : []
        } else if (!args[1]) {
          output = [lang === 'de' ? 'Benutzung: cat [file]' : 'Usage: cat [file]']
        } else {
          output = [lang === 'de' ? `Datei nicht gefunden: ${args[1]}` : `File not found: ${args[1]}`]
        }
        break
      case '':
        break
      default:
        output = [lang === 'de' 
          ? `Befehl nicht gefunden: ${baseCmd}. Tippe 'help' für Hilfe.` 
          : `Command not found: ${baseCmd}. Type 'help' for help.`]
    }

    setRenderedLines(prev => [
      ...prev,
      { prefix: 'artjom@portfolio ~ % ', content: rawCmd, isCmd: true },
      ...output.map(line => ({ prefix: '', content: line, isCmd: false }))
    ])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex])
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = COMMANDS.filter(c => c.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        setInput(matches[0])
      }
    }
  }

  return (
    <motion.div
      className="terminal"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-btn terminal-btn--red" />
          <span className="terminal-btn terminal-btn--yellow" />
          <span className="terminal-btn terminal-btn--green" />
        </div>
        <span className="terminal-title">artjom — zsh</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {renderedLines.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.prefix && <span className="terminal-prompt">{line.prefix}</span>}
            <span className={line.isCmd ? 'terminal-cmd' : 'terminal-output'}>{line.content}</span>
          </div>
        ))}
        <div className="terminal-line">
          {done && <span className="terminal-prompt">artjom@portfolio ~ % </span>}
          {done ? (
            <div className="terminal-input-wrapper">
              <input
                ref={inputRef}
                className="terminal-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
              />
              {showCursor && <span className="terminal-cursor terminal-cursor--visible">|</span>}
            </div>
          ) : (
             <span className={`terminal-cursor ${showCursor ? 'terminal-cursor--visible' : ''}`}>|</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Terminal
