import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCursor } from './useCursor'
import Terminal from './Terminal'
import Chatbot from './Chatbot'
import CVSection from './CVSection'
import './App.css'

const PROJECTS = [
  {
    id: 'exercube',
    title: 'ExerCube',
    short: 'Gruppenprojekt (Note 1,0) - Serious Games, TU Darmstadt.',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
    details: {
      role: 'Teammitglied im Gruppenprojekt',
      context: 'Serious Games Darmstadt',
      impact: 'Abschluss mit Note 1,0',
      tech: 'Interaktive Spielmechanik, UX, Entwicklungsworkflow',
      link: 'https://github.com/serious-games-darmstadt/SS25-P21-ExerCube',
    },
  },
  {
    id: 'arcadesuite',
    title: 'ArcadeSuite',
    short: 'Eigenes Bachelor-Projekt mit Agenten auf Atari-Spielen.',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
    details: {
      role: 'Eigenersteller und Entwickler',
      context: 'Bachelor-Projekt',
      impact: 'PvP, PvE, EvE und visualisierte Agentenentscheidungen',
      tech: 'Python, OC_Atari, HackAtari, ScoBots',
      link: 'https://github.com/DjamilB/ArcadeSuite',
    },
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    short: 'Apple-Style Portfolio mit Dark Mode und Custom Cursor.',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80',
    details: {
      role: 'Konzept, Design, Umsetzung',
      context: 'Persönliche Web-Präsenz',
      impact: 'Interaktives Auftreten fuer Recruiter & Projekte',
      tech: 'React, Vite, Framer Motion, Custom UI',
      link: '#',
    },
  },
]

function App() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeProject, setActiveProject] = useState(null)
  const [isCvView, setIsCvView] = useState(
    typeof window !== 'undefined' && window.location.hash === '#cv'
  )
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return (
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    )
  })
  const { mouse, smoothMouse, isHovering, isVisible, handleHover, handleLeave } =
    useCursor()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 20)
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') setActiveProject(null)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  useEffect(() => {
    const onHashChange = () => setIsCvView(window.location.hash === '#cv')
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const [hasPointer, setHasPointer] = useState(false)
  useEffect(() => {
    const check = () => {
      const fine = window.matchMedia('(pointer: fine)').matches
      setHasPointer(fine)
      if (fine) document.body.classList.add('custom-cursor')
    }
    check()
    return () => document.body.classList.remove('custom-cursor')
  }, [])

  return (
    <>
      {hasPointer && (
        <div className="cursor-wrapper" aria-hidden>
          <motion.div
            className={`cursor-glow ${isHovering ? 'cursor-glow--hover' : ''}`}
            style={{ left: smoothMouse.x, top: smoothMouse.y, opacity: isVisible ? 1 : 0 }}
          />
          <motion.div
            className={`cursor-dot ${isHovering ? 'cursor-dot--hover' : ''}`}
            style={{ left: mouse.x, top: mouse.y, opacity: isVisible ? 1 : 0 }}
          />
        </div>
      )}

      {activeProject && (
        <div className="modal-backdrop" onClick={() => setActiveProject(null)}>
          <motion.div
            className="project-modal"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setActiveProject(null)}>
              ×
            </button>
            <img src={activeProject.image} alt={activeProject.title} className="modal-image" />
            <h3>{activeProject.title}</h3>
            <p>{activeProject.short}</p>
            <ul className="modal-facts">
              <li><strong>Rolle:</strong> {activeProject.details.role}</li>
              <li><strong>Kontext:</strong> {activeProject.details.context}</li>
              <li><strong>Impact:</strong> {activeProject.details.impact}</li>
              <li><strong>Tech:</strong> {activeProject.details.tech}</li>
            </ul>
            <a
              href={activeProject.details.link}
              className="link"
              target={activeProject.details.link.startsWith('http') ? '_blank' : undefined}
              rel={activeProject.details.link.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              Projekt ansehen
            </a>
          </motion.div>
        </div>
      )}

      <nav className={`nav ${navScrolled ? 'nav--scrolled' : ''}`}>
        <a href="#hero" className="nav-logo">Portfolio</a>
        <ul className="nav-links">
          <li><a href="#about" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Über mich</a></li>
          <li><a href="#skills" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Skills</a></li>
          <li><a href="#projects" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Projekte</a></li>
          <li><a href="#cv" onMouseEnter={handleHover} onMouseLeave={handleLeave}>CV</a></li>
          <li><a href="#contact" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Kontakt</a></li>
          <li>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
              aria-label={theme === 'dark' ? 'Hell-Modus aktivieren' : 'Dark-Modus aktivieren'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </li>
        </ul>
      </nav>

      <main className={isCvView ? 'main-cv-only' : ''}>
        {isCvView ? (
          <CVSection />
        ) : (
          <>
        <section id="hero" className="hero">
          <div
            className="hero-spotlight"
            style={{
              background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, var(--spotlight), transparent 45%)`,
              opacity: Math.max(0, 1 - scrollY / 400),
            }}
          />
          <motion.p className="hero-eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Informatik-Student
          </motion.p>
          <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            Hallo, ich bin<br />
            <span className="hero-title-name">Artjom Becker.</span>
          </motion.h1>
          <motion.p className="hero-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            Ich entwickle Software, löse Probleme und erkunde die Welt der Technologie.
          </motion.p>
        </section>

        <section id="about" className="section">
          <motion.div className="section-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 className="section-title">Über mich</h2>
            <Terminal onMouseEnter={handleHover} onMouseLeave={handleLeave} />
            <p className="section-text section-text--mt">
              Ich studiere Informatik und bin fasziniert von der Verbindung zwischen Theorie und Praxis. Teamleitung im Bachelor-Praktikum, Gruppenprojekte mit Bestnote - ich liebe es, komplexe Probleme zu zerlegen und elegante Lösungen zu entwickeln.
            </p>
          </motion.div>
        </section>

        <section id="skills" className="section section--alt">
          <motion.div className="section-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              {[
                { label: 'Sprachen', list: 'JavaScript, TypeScript, Python, Java' },
                { label: 'Frontend', list: 'React, HTML, CSS, Vite' },
                { label: 'Backend & Tools', list: 'Node.js, Git, SQL, Linux' },
                { label: 'Konzepte', list: 'Algorithmen, Datenstrukturen, OOP, Clean Code' },
              ].map((skill) => (
                <div key={skill.label} className="skill-group" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                  <h3 className="skill-label">{skill.label}</h3>
                  <p className="skill-list">{skill.list}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="projects" className="section">
          <motion.div className="section-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 className="section-title">Ausgewählte Projekte</h2>
            <div className="projects-list">
              {PROJECTS.map((project) => (
                <article key={project.id} className="project" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.short}</p>
                    <div className="project-actions">
                      <button className="link link-button" onClick={() => setActiveProject(project)}>
                        Details öffnen
                      </button>
                      {project.details.link.startsWith('http') && (
                        <a href={project.details.link} target="_blank" rel="noopener noreferrer" className="link project-direct">Repo ↗</a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <a href="https://github.com/DjamilB?tab=repositories" target="_blank" rel="noopener noreferrer" className="link link--center" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
              Alle Projekte auf GitHub
            </a>
          </motion.div>
        </section>

        <section id="contact" className="section section--alt section--contact">
          <motion.div className="contact-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="contact-title">Lass uns vernetzen.</h2>
            <p className="contact-text">Ob Zusammenarbeit, Fragen zu Projekten oder einfach nur Austausch - ich freue mich über jede Nachricht.</p>
            <a href="mailto:artjomarturbecker@icloud.com" className="btn" onMouseEnter={handleHover} onMouseLeave={handleLeave}>E-Mail schreiben</a>
            <p className="contact-mail">artjomarturbecker@icloud.com</p>
            <div className="contact-links">
              <a href="https://github.com/DjamilB" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="GitHub" onMouseEnter={handleHover} onMouseLeave={handleLeave}><GitHubIcon /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="LinkedIn" onMouseEnter={handleHover} onMouseLeave={handleLeave}><LinkedInIcon /></a>
              <a href="https://wa.me/4915203322770" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="WhatsApp" onMouseEnter={handleHover} onMouseLeave={handleLeave}><WhatsAppIcon /></a>
              <a href="https://t.me/+4915203322770" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="Telegram" onMouseEnter={handleHover} onMouseLeave={handleLeave}><TelegramIcon /></a>
            </div>
          </motion.div>
        </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Artjom Becker. Designed & gebaut mit Liebe zum Detail.</p>
      </footer>

      {!isCvView && <Chatbot />}
    </>
  )
}

function GitHubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.14 1.59 5.95L0 24l6.35-1.67a11.83 11.83 0 0 0 5.72 1.46h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.14-3.44-8.43Zm-8.44 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.77.99 1.01-3.67-.24-.38a9.86 9.86 0 0 1-1.52-5.25c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.91a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.89-9.86 9.89Zm5.43-7.42c-.3-.15-1.78-.88-2.05-.98-.28-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49a9.13 9.13 0 0 1-1.67-2.07c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.79.37-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.22 3.1.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.71.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z"/>
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0Zm5.9 8.2-1.97 9.29c-.15.66-.54.83-1.1.52l-3.05-2.25-1.47 1.41c-.16.16-.3.3-.62.3l.22-3.11 5.66-5.11c.25-.22-.05-.35-.38-.13L8.2 13.5l-2.98-.93c-.65-.2-.66-.65.14-.96l11.66-4.5c.54-.2 1.01.13.88 1.09Z"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default App
