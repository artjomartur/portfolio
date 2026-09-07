import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'

const COMMANDS = ['help', 'ls', 'whoami', 'clear', 'contact', 'skills', 'projects', 'cat', 'open', 'pong', 'matrix', 'shake', 'sudo', 'follow', 'groupthink', 'snake']

const VIRTUAL_FILES = {
  'datenschutz_seminararbeit.pdf': {
    url: '/Datenminimierung_ArtjomBecker.pdf',
    descDe: 'Seminararbeit: Datenminimierung & Datenschutzkonzepte (TU Darmstadt)',
    descEn: 'Seminar Paper: Data Minimization & Privacy Concepts (TU Darmstadt)'
  },
  'datenschutz_slides.pdf': {
    url: '/Datenminimierung.pdf',
    descDe: 'Präsentationsfolien: Datenschutzseminar (TU Darmstadt)',
    descEn: 'Presentation Slides: Privacy Seminar (TU Darmstadt)'
  },
  'serious_games_seminararbeit.pdf': {
    url: '/SG_GamesForHealth_ArtjomBecker_StefanGoebel_Final.pdf',
    descDe: 'Seminararbeit: Serious Games - Games for Health (TU Darmstadt)',
    descEn: 'Seminar Paper: Serious Games - Games for Health (TU Darmstadt)'
  },
  'teamprojekt_bestaetigung.pdf': {
    url: '/Bestaetigung_Teamprojekt_TU_Darmstadt.pdf',
    descDe: 'Bestätigung Softwareprojektmanager: Teamprojekt Softwareentwicklung (TU Darmstadt)',
    descEn: 'Certificate Software Project Manager: Software Project (TU Darmstadt)'
  },
  'serious_games_slides.pptx': {
    url: '/SG_GamesForHealth_ArtjomBecker_StefanGoebel_Slides.pptx',
    descDe: 'Präsentationsfolien: Serious Games für Gesundheit (TU Darmstadt)',
    descEn: 'Presentation Slides: Serious Games for Health (TU Darmstadt)'
  },
  'social_psychology_slides.pptx': {
    url: '/Janis_Group_Decision_Making.pptx',
    descDe: 'Präsentationsfolien: Janis Group Decision Making (Goethe-Universität Frankfurt)',
    descEn: 'Presentation Slides: Janis Group Decision Making (Goethe University Frankfurt)'
  },
  'exercube_documentation.pdf': {
    url: '/Cyberquest.pdf',
    descDe: 'Projektdokumentation: ExerCube Painter (TU Darmstadt)',
    descEn: 'Project Documentation: ExerCube Painter (TU Darmstadt)'
  },
  'exercube_slides.pdf': {
    url: '/SG_P21_SS_2025_Cyberquest_GoebelHorn_Folien.pdf',
    descDe: 'Präsentationsfolien: Cyberquest ExerCube Painter (TU Darmstadt)',
    descEn: 'Presentation Slides: Cyberquest ExerCube Painter (TU Darmstadt)'
  },
  'exercube_repo.url': {
    url: 'https://github.com/serious-games-darmstadt/SS25-P21-ExerCube',
    descDe: 'GitHub-Repository: ExerCube Painter',
    descEn: 'GitHub Repository: ExerCube Painter'
  },
  'arcadesuite_documentation.pdf': {
    url: '/Project_Documentation.pdf',
    descDe: 'Projektdokumentation: ArcadeSuite (Atari RL Benchmarks)',
    descEn: 'Project Documentation: ArcadeSuite (Atari RL Benchmarks)'
  },
  'arcadesuite_slides.pdf': {
    url: '/2025-03-04_Gruppe_74_53_Slides.pdf',
    descDe: 'Präsentationsfolien: ArcadeSuite Atari-Agenten',
    descEn: 'Presentation Slides: ArcadeSuite Atari Agents'
  },
  'arcadesuite_repo.url': {
    url: 'https://github.com/artjomartur/ArcadeSuite',
    descDe: 'GitHub-Repository: ArcadeSuite',
    descEn: 'GitHub Repository: ArcadeSuite'
  },
  'kinopolis.url': {
    url: 'https://kinopolis.artjombecker.com',
    descDe: 'Webseite: Kinopolis Automation Dashboard',
    descEn: 'Website: Kinopolis Automation Dashboard'
  },
  'portfolio.url': {
    url: 'https://artjombecker.com',
    descDe: 'Webseite: Dieses Portfolio',
    descEn: 'Website: This Portfolio'
  },
  'first_aid_simulator.url': {
    url: 'https://artjomartur.itch.io/help-first-aids-simulator',
    descDe: 'Spielseite: First Aid Simulator auf itch.io',
    descEn: 'Game Page: First Aid Simulator on itch.io'
  },
  'highlights.txt': {
    contentDe: [
      '★ Kinopolis Automation (Live Dashboard)',
      '★ ExerCube (Note 1.0, Serious Games)',
      '★ ArcadeSuite (Atari RL Benchmarks)',
      '★ Datenschutz Seminararbeit (Note 2.0)',
      '★ Serious Games Seminararbeit (Note 1.7)'
    ],
    contentEn: [
      '★ Kinopolis Automation (Live Dashboard)',
      '★ ExerCube (Grade 1.0, Serious Games)',
      '★ ArcadeSuite (Atari RL Benchmarks)',
      '★ Privacy Seminar Paper (Grade 2.0)',
      '★ Serious Games Seminar Paper (Grade 1.7)'
    ]
  }
}

function TerminalSnake({ lang = 'de', onClose }) {
  const COLS = 24
  const ROWS = 13
  const [snake, setSnake] = useState([
    { x: 10, y: 7 },
    { x: 9, y: 7 },
    { x: 8, y: 7 }
  ])
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [food, setFood] = useState({ x: 5, y: 5 })
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('terminal-snake-highscore') || 0)
  })
  const [gameOver, setGameOver] = useState(false)
  const dirRef = useRef(direction)
  dirRef.current = direction

  // Generate random food position not on snake
  const spawnFood = (currentSnake) => {
    let newFood
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      }
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) {
        break
      }
    }
    return newFood
  }

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        onClose()
        return
      }

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          setSnake([
            { x: 10, y: 7 },
            { x: 9, y: 7 },
            { x: 8, y: 7 }
          ])
          setDirection({ x: 1, y: 0 })
          setFood({ x: 5, y: 5 })
          setScore(0)
          setGameOver(false)
        }
        return
      }

      const key = e.key.toLowerCase()
      const curr = dirRef.current

      if ((key === 'arrowup' || key === 'w') && curr.y === 0) {
        e.preventDefault()
        setDirection({ x: 0, y: -1 })
      } else if ((key === 'arrowdown' || key === 's') && curr.y === 0) {
        e.preventDefault()
        setDirection({ x: 0, y: 1 })
      } else if ((key === 'arrowleft' || key === 'a') && curr.x === 0) {
        e.preventDefault()
        setDirection({ x: -1, y: 0 })
      } else if ((key === 'arrowright' || key === 'd') && curr.x === 0) {
        e.preventDefault()
        setDirection({ x: 1, y: 0 })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameOver, onClose])

  // Game loop tick
  useEffect(() => {
    if (gameOver) return

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0]
        const dir = dirRef.current
        const newHead = { x: head.x + dir.x, y: head.y + dir.y }

        // Wall collision
        if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
          setGameOver(true)
          return prevSnake
        }

        // Self collision
        if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true)
          return prevSnake
        }

        const nextSnake = [newHead, ...prevSnake]

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const nextScore = score + 10
          setScore(nextScore)
          if (nextScore > highScore) {
            setHighScore(nextScore)
            localStorage.setItem('terminal-snake-highscore', String(nextScore))
          }
          setFood(spawnFood(nextSnake))
        } else {
          nextSnake.pop()
        }

        return nextSnake
      })
    }, 130)

    return () => clearInterval(interval)
  }, [gameOver, food, score, highScore])

  // Render ASCII board
  const boardStr = useMemo(() => {
    let rows = []
    
    // Top border
    rows.push('+' + '-'.repeat(COLS) + '+')

    for (let y = 0; y < ROWS; y++) {
      let row = '|'
      for (let x = 0; x < COLS; x++) {
        if (snake[0].x === x && snake[0].y === y) {
          row += 'O' // Head
        } else if (snake.some((s, idx) => idx > 0 && s.x === x && s.y === y)) {
          row += 'o' // Body
        } else if (food.x === x && food.y === y) {
          row += '★' // Food
        } else {
          row += ' ' // Empty space
        }
      }
      row += '|'
      rows.push(row)
    }

    // Bottom border
    rows.push('+' + '-'.repeat(COLS) + '+')
    return rows.join('\n')
  }, [snake, food])

  return (
    <div className="terminal-snake">
      <div className="terminal-snake-header">
        <span>🐍 TERMINAL SNAKE</span>
        <span>SCORE: {score} | HIGH: {highScore}</span>
      </div>
      <pre className="terminal-snake-board">
        {boardStr}
      </pre>
      <div className="terminal-snake-footer">
        {gameOver ? (
          <div className="terminal-snake-gameover">
            {lang === 'de' ? 'SPIEL VORBEI! [ENTER] Neustart | [Q] Beenden' : 'GAME OVER! [ENTER] Restart | [Q] Quit'}
          </div>
        ) : (
          <div>
            {lang === 'de' 
              ? 'Steuerung: W/A/S/D / Pfeiltasten · [Q] Beenden' 
              : 'Controls: W/A/S/D / Arrow keys · [Q] Quit'}
          </div>
        )}
      </div>
    </div>
  )
}

function Terminal({ lang = 'de', onMouseEnter, onMouseLeave, projectTitles = [], items = [], onPlayPong, onTriggerShake, onTriggerMatrix, onTriggerDestruction, onTriggerFollow }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [renderedLines, setRenderedLines] = useState([])
  const [showCursor, setShowCursor] = useState(true)
  const [done, setDone] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isSnakeActive, setIsSnakeActive] = useState(false)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  const INITIAL_LINES = useMemo(() => [
    { prefix: 'artjom@portfolio ~ % ', content: 'whoami', isCmd: true },
    { prefix: '', content: lang === 'de' ? 'Artjom Becker · Informatik-Student' : 'Artjom Becker · Computer Science Student', isCmd: false },
    { prefix: '', content: '', isCmd: false },
    { prefix: 'artjom@portfolio ~ % ', content: 'cat highlights.txt', isCmd: true },
    { prefix: '', content: '', isCmd: false },
    ...VIRTUAL_FILES['highlights.txt'][lang === 'de' ? 'contentDe' : 'contentEn'].map(line => ({ prefix: '', content: line, isCmd: false })),
    { prefix: '', content: '', isCmd: false },
  ], [lang])

  // Focus input when animation is done
  useEffect(() => {
    if (done && inputRef.current) {
      const t = setTimeout(() => {
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
    
    if (!line.prefix && line.content === '') {
      const t = setTimeout(() => {
        setRenderedLines((prev) => [...prev, { prefix: '', content: '', isCmd: false }])
        setLineIndex((i) => i + 1)
        setCharIndex(0)
      }, 200)
      return () => clearTimeout(t)
    }

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

  // Scroll to bottom
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
    const cmd = rawCmd.trim()
    const args = cmd.split(' ')
    const baseCmd = args[0].toLowerCase()
    
    let output = []
    
    if (cmd) {
      setHistory(prev => [rawCmd, ...prev])
      setHistoryIndex(-1)
    }

    switch (baseCmd) {
      case 'help':
        output = lang === 'de' 
          ? ['Verfügbare Befehle: help, ls, whoami, skills, contact, clear, cat [file], open [file], pong, matrix, shake, follow, groupthink, snake']
          : ['Available commands: help, ls, whoami, skills, contact, clear, cat [file], open [file], pong, matrix, shake, follow, groupthink, snake']
        break
      case 'ls':
      case 'projects':
        output = [
          lang === 'de' ? 'Dateien im aktuellen Verzeichnis:' : 'Files in current directory:',
          ...Object.keys(VIRTUAL_FILES).map(k => `  ${k}`)
        ]
        break
      case 'whoami':
        output = [lang === 'de' ? 'Artjom Becker · Informatik-Student an der TU Darmstadt' : 'Artjom Becker · CS Student at TU Darmstadt']
        break
      case 'skills':
        output = ['JavaScript, TypeScript, Python, React, Node.js, SQL, Java']
        break
      case 'contact':
        output = ['Website: artjombecker.com', 'Email: hi@artjombecker.com', 'GitHub: github.com/artjomartur', 'Itch.io: artjomartur.itch.io', 'Instagram: @artjomartur777']
        break
      case 'clear':
        setRenderedLines([])
        return
      case 'cat':
      case 'open':
        const targetArg = args.slice(1).join(' ').toLowerCase()
        if (!targetArg) {
          output = [lang === 'de' ? `Benutzung: ${baseCmd} [file]` : `Usage: ${baseCmd} [file]`]
        } else if (targetArg === 'highlights.txt') {
          output = VIRTUAL_FILES['highlights.txt'][lang === 'de' ? 'contentDe' : 'contentEn']
        } else {
          // Loose matching logic
          const matchedKey = Object.keys(VIRTUAL_FILES).find(k => k.toLowerCase().includes(targetArg))
          if (matchedKey && matchedKey !== 'highlights.txt') {
            const file = VIRTUAL_FILES[matchedKey]
            output = [
              lang === 'de' ? `Öffne ${matchedKey}...` : `Opening ${matchedKey}...`,
              `↳ ${lang === 'de' ? file.descDe : file.descEn}`,
              `↳ ${file.url}`
            ]
            window.open(file.url, '_blank')
          } else {
            output = [lang === 'de' ? `Datei nicht gefunden: ${targetArg}` : `File not found: ${targetArg}`]
          }
        }
        break
      case '':
        break
      case 'matrix':
        output = lang === 'de' ? ['Starte Matrix Rain...'] : ['Starting Matrix Rain...']
        if (onTriggerMatrix) {
          onTriggerMatrix()
        }
        break
      case 'shake':
        output = lang === 'de' ? ['Erschüttere Seite...'] : ['Shaking page...']
        if (onTriggerShake) {
          onTriggerShake()
        }
        break
      case 'follow':
      case 'groupthink':
        output = lang === 'de' ? ['Starte Gruppenentscheidungs-Simulation (Janis Groupthink)...'] : ['Starting group decision simulation (Janis Groupthink)...']
        if (onTriggerFollow) {
          onTriggerFollow()
        }
        break
      case 'sudo':
        const subArg = args.slice(1).join(' ')
        if (subArg === 'rm -rf /') {
          output = ['CRITICAL WARNING: INITIALIZING MOCK DESTRUCTION SEQUENCE...']
          if (onTriggerDestruction) {
            setTimeout(() => onTriggerDestruction(), 1000)
          }
        } else {
          output = ['usage: sudo rm -rf /']
        }
        break
      case 'pong':
      case 'play':
        if (baseCmd === 'pong' || args[1] === 'pong') {
          output = lang === 'de' ? ['Starte ArcadeSuite (Pong)...'] : ['Starting ArcadeSuite (Pong)...']
          if (onPlayPong) {
            setTimeout(() => onPlayPong(), 800)
          }
        } else {
          output = [lang === 'de' 
            ? `Befehl nicht gefunden: ${baseCmd}. Tippe 'help' für Hilfe.` 
            : `Command not found: ${baseCmd}. Type 'help' for help.`]
        }
        break
      case 'snake':
        setIsSnakeActive(true)
        output = [lang === 'de' ? 'Starte Terminal Snake...' : 'Starting Terminal Snake...']
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

  const suggestion = useMemo(() => {
    if (!input.trim()) return ''
    const parts = input.split(' ')
    const cmd = parts[0].toLowerCase()

    if (parts.length > 1) {
      if (cmd === 'cat' || cmd === 'open') {
        const filePart = parts.slice(1).join(' ').toLowerCase()
        const match = Object.keys(VIRTUAL_FILES).find(k => k.toLowerCase().startsWith(filePart))
        if (match) {
          return match.slice(filePart.length)
        }
      }
    } else {
      const match = COMMANDS.find(c => c.startsWith(input.toLowerCase()))
      if (match && match !== input.toLowerCase()) {
        return match.slice(input.length)
      }
    }
    return ''
  }, [input])

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
    } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
      if (suggestion) {
        e.preventDefault()
        const parts = input.split(' ')
        if (parts.length > 1) {
          const cmd = parts[0]
          const filePart = parts.slice(1).join(' ')
          const matchedKey = Object.keys(VIRTUAL_FILES).find(k => k.toLowerCase().startsWith(filePart.toLowerCase()))
          if (matchedKey) {
            setInput(`${cmd} ${matchedKey}`)
          }
        } else {
          const matchedCmd = COMMANDS.find(c => c.startsWith(input.toLowerCase()))
          if (matchedCmd) {
            setInput(matchedCmd)
          }
        }
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const parts = input.split(' ')
        if (parts.length > 1) {
          const cmd = parts[0].toLowerCase()
          if (cmd === 'cat' || cmd === 'open') {
            const filePart = parts.slice(1).join(' ').toLowerCase()
            const fileMatches = Object.keys(VIRTUAL_FILES).filter(k => k.toLowerCase().startsWith(filePart))
            if (fileMatches.length === 1) {
              setInput(`${parts[0]} ${fileMatches[0]}`)
            }
          }
        } else {
          const matches = COMMANDS.filter(c => c.startsWith(input.toLowerCase()))
          if (matches.length === 1) {
            setInput(matches[0] + ' ')
          }
        }
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
        {isSnakeActive ? (
          <TerminalSnake
            lang={lang}
            onClose={() => {
              setIsSnakeActive(false)
              setRenderedLines(prev => [
                ...prev,
                { prefix: '', content: lang === 'de' ? 'Terminal Snake beendet.' : 'Terminal Snake game closed.', isCmd: false }
              ])
            }}
          />
        ) : (
          <>
            {renderedLines.map((line, i) => (
              <div key={i} className="terminal-line">
                {line.prefix && <span className="terminal-prompt">{line.prefix}</span>}
                <span className={line.isCmd ? 'terminal-cmd' : 'terminal-output'}>{line.content}</span>
              </div>
            ))}
            <div className="terminal-line">
              {done && <span className="terminal-prompt">artjom@portfolio ~ % </span>}
              {done ? (
                <div className="terminal-input-wrapper" style={{ position: 'relative', display: 'flex', flexGrow: 1 }}>
                  <input
                    ref={inputRef}
                    className="terminal-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    style={{ background: 'transparent', position: 'relative', zIndex: 2, color: 'inherit', width: '100%', border: 'none', outline: 'none' }}
                  />
                  {suggestion && (
                    <span 
                      className="terminal-suggestion-ghost" 
                      style={{ position: 'absolute', left: 0, top: 0, color: 'rgba(255, 255, 255, 0.35)', pointerEvents: 'none', zIndex: 1, fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}
                    >
                      <span style={{ opacity: 0, whiteSpace: 'pre' }}>{input}</span>
                      {suggestion}
                    </span>
                  )}
                  {showCursor && <span className="terminal-cursor terminal-cursor--visible" style={{ zIndex: 3 }}>|</span>}
                </div>
              ) : (
                 <span className={`terminal-cursor ${showCursor ? 'terminal-cursor--visible' : ''}`}>|</span>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default Terminal

