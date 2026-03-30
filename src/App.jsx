import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useCursor } from './useCursor'
import Terminal from './Terminal'
import Chatbot from './Chatbot'
import CVSection from './CVSection'
import './App.css'

const PROJECTS = [
  {
    id: 'kinopolis-automation',
    title: 'Kinopolis Automation',
    short: 'Modernes Dashboard für Echtzeit-Monitoring und operative Automatisierung im Kinobetrieb.',
    image:
      'https://trailer.kinopolis.de/media/img/logos/kinopolis.png',
    details: {
      role: 'Fullstack Developer & Automation',
      context: 'Operative Unterstützung Kinopolis',
      impact: 'Effizientere Plakatwechsel und Echtzeit-Auslastungsübersicht',
      tech: 'Vanilla JS, Node.js, Cheerio, Vite',
      languages: ['JavaScript', 'HTML', 'CSS'],
      challenge: 'Echtzeit-Scraping von komplexen Sitzplänen und intuitive Aufbereitung für das Personal.',
      solution: 'Entwicklung eines reaktionsschnellen Dashboards mit automatisierten Alerts und Standort-Management.',
      result: 'Live im Einsatz zur Unterstützung der täglichen Abläufe.',
      tags: ['Web', 'UI/UX', 'Automation'],
      link: 'https://kinopolis.artjombecker.com',
    },
  },
  {
    id: 'tpse-orga',
    title: 'TPSE Orga-Plattform',
    short: 'Full-Stack Plattform zur Teamverwaltung und Abgabenmanagement am Fachbereich Informatik der TU Darmstadt.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
    details: {
      role: 'Fullstack Developer',
      context: 'Uni-Projekt Support',
      impact: 'Zentralisierung von Team-Kommunikation, Abgaben und Bewertungen für hunderte Studierende.',
      tech: 'Next.js, Prisma, Tailwind CSS, SQLite',
      languages: ['TypeScript', 'JavaScript', 'HTML', 'CSS'],
      challenge: 'Sichere Verwaltung von Abgaben und Teamstrukturen in einem dynamischen universitären Umfeld.',
      solution: 'Entwicklung einer modernen Web-App mit Rollen-Management (Admin/Student) und Dateiverarbeitung.',
      result: 'Erfolgreicher Einsatz im Modul-Betrieb.',
      tags: ['Team', 'Web', 'Full-Stack'],
      link: 'https://tpse.artjombecker.com',
    },
  },
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
      languages: ['C#', 'Unity Script'],
      challenge: 'Ein spielerisches Trainingserlebnis entwickeln, das Motivation und Bewegung verbindet.',
      solution: 'Konzeption eines klaren UX-Flows mit iterativen Tests und enger Teamabstimmung.',
      result: 'Stabiler Prototyp mit sehr gutem Feedback und Abschlussnote 1,0.',
      tags: ['Game Dev', 'Team', 'UX'],
      link: 'https://github.com/serious-games-darmstadt/SS25-P21-ExerCube',
      trailer: 'https://youtu.be/oTpbnMsudgs',
    },
  },
  {
    id: 'arcadesuite',
    title: 'ArcadeSuite',
    short: 'Eigenes Bachelor-Projekt mit Agenten auf Atari-Spielen.',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
    details: {
      role: 'Teamprojekt und UX/UI Mitgestaltung',
      context: 'Bachelor-Projekt',
      impact: 'PvP, PvE, EvE und visualisierte Agentenentscheidungen',
      tech: 'Python, OC_Atari, HackAtari, ScoBots',
      languages: ['Python'],
      challenge: 'Mehrere KI-Agenten in unterschiedlichen Atari-Szenarien vergleichbar machen.',
      solution: 'Modulare Agenten-Architektur mit reproduzierbaren Evaluations-Setups und Visualisierung.',
      result: 'Saubere Benchmark-Basis fuer Experimente und Demonstrationen.',
      tags: ['AI', 'Game Dev', 'Research', 'Team', 'UX', 'UI/UX'],
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
      languages: ['JavaScript', 'CSS'],
      challenge: 'Eine moderne Seite bauen, die persoenlich wirkt und trotzdem professionell bleibt.',
      solution: 'Apple-inspirierte UI mit klarer Struktur, Interaktion und zweisprachigem Content.',
      result: 'Recruiter-fokussiertes Portfolio mit hoher Lesbarkeit und starker Conversion.',
      tags: ['Web', 'UI/UX', 'Branding'],
      link: '#',
    },
  },
]

const PROJECT_FILTERS = ['All', 'AI', 'Game Dev', 'Web', 'Team', 'UX', 'Research', 'UI/UX', 'Branding', 'Automation', 'Full-Stack']

const TIMELINE = [
  { year: '2026', de: 'Bereit fuer den naechsten Impact - gerne mit Ihrem Unternehmen.', en: 'Ready for the next impact - ideally with your company.' },
  { year: '2025', de: 'Teamleitung fuer drei Teams im Bachelor-Praktikum', en: 'Led three teams in a bachelor internship' },
  { year: '2025', de: 'ExerCube Gruppenprojekt mit Note 1,0', en: 'ExerCube group project graded 1.0' },
  { year: '2023', de: 'Start Informatik-Studium an der TU Darmstadt', en: 'Started computer science studies at TU Darmstadt' },
]

const STACK = [
  {
    groupDe: 'Frontend',
    groupEn: 'Frontend',
    items: [
      { label: 'React', level: 92, contextDe: 'Produktive UI-Entwicklung', contextEn: 'Production UI development' },
      { label: 'TypeScript', level: 82, contextDe: 'Typsichere Komponenten', contextEn: 'Type-safe components' },
      { label: 'CSS', level: 88, contextDe: 'Responsive, sauberes Design', contextEn: 'Responsive, clean design' },
    ],
  },
  {
    groupDe: 'Backend & Daten',
    groupEn: 'Backend & Data',
    items: [
      { label: 'Node.js', level: 78, contextDe: 'APIs und Tooling', contextEn: 'APIs and tooling' },
      { label: 'SQL', level: 72, contextDe: 'Abfragen und Datenmodelle', contextEn: 'Queries and data models' },
      { label: 'Python', level: 90, contextDe: 'Skripting und KI-Prototyping', contextEn: 'Scripting and AI prototyping' },
    ],
  },
  {
    groupDe: 'Informatik-Grundlagen',
    groupEn: 'CS Foundations',
    items: [
      { label: 'Algorithmen', level: 84, contextDe: 'Effizienz und Problemloesung', contextEn: 'Efficiency and problem solving' },
      { label: 'Datenstrukturen', level: 83, contextDe: 'Robuste Modellierung', contextEn: 'Robust modeling' },
      { label: 'OOP', level: 86, contextDe: 'Wartbare Architektur', contextEn: 'Maintainable architecture' },
    ],
  },
]

const NAV_ITEMS = [
  { id: 'about', labelDe: 'Über mich', labelEn: 'About' },
  { id: 'skills', labelDe: 'Skills', labelEn: 'Skills' },
  { id: 'timeline', labelDe: 'Timeline', labelEn: 'Timeline' },
  { id: 'projects', labelDe: 'Projekte', labelEn: 'Projects' },
  { id: 'cv', labelDe: 'CV', labelEn: 'CV' },
  { id: 'contact', labelDe: 'Kontakt', labelEn: 'Contact' },
]

function App() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeProject, setActiveProject] = useState(null)
  const [isCvView, setIsCvView] = useState(
    typeof window !== 'undefined' && window.location.hash === '#cv'
  )
  const projectTitles = useMemo(() => PROJECTS.map((p) => p.title), [])

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return (
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    )
  })
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'de'
    return localStorage.getItem('lang') || 'de'
  })
  const [projectFilter, setProjectFilter] = useState('All')
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const { mouse, smoothMouse, isHovering, isVisible, handleHover, handleLeave } =
    useCursor()

  // Form state
  const [formStatus, setFormStatus] = useState(null) // 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    document.documentElement.lang = lang
    const title =
      lang === 'de'
        ? 'Artjom Becker | Informatik-Portfolio'
        : 'Artjom Becker | Computer Science Portfolio'
    const description =
      lang === 'de'
        ? 'Informatik-Portfolio von Artjom Becker: Projekte, Case Studies, Teamleitung und Kontakt.'
        : 'Computer science portfolio by Artjom Becker: projects, case studies, team leadership, and contact.'

    document.title = title
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) metaDescription.setAttribute('content', description)

    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogTitle) ogTitle.setAttribute('content', title)
    if (ogDescription) ogDescription.setAttribute('content', description)
  }, [lang])

  useEffect(() => {
    const key = `portfolio-view-count-${new Date().toISOString().slice(0, 10)}`
    const views = Number(localStorage.getItem(key) || '0') + 1
    localStorage.setItem(key, String(views))
  }, [])

  const trackEvent = (name, payload = {}) => {
    const item = { name, payload, ts: Date.now() }
    const events = JSON.parse(localStorage.getItem('portfolio-events') || '[]')
    events.push(item)
    localStorage.setItem('portfolio-events', JSON.stringify(events.slice(-60)))
  }

  const filteredProjects =
    projectFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.details.tags?.includes(projectFilter))

  const visibleProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 4)
  const hasMoreProjects = filteredProjects.length > 4

  const levelLabel = (value) => {
    if (value >= 88) return lang === 'de' ? 'Sehr stark' : 'Advanced'
    if (value >= 78) return lang === 'de' ? 'Sehr gut' : 'Strong'
    return lang === 'de' ? 'Solide' : 'Solid'
  }

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const toggleLang = () => setLang((l) => (l === 'de' ? 'en' : 'de'))

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

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'timeline', 'projects', 'contact']
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActiveSection(visible[0].target.id)
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: '-20% 0px -55% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isCvView])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
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

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus(null)

    const formData = new FormData(e.target)
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        setFormStatus('success')
        e.target.reset()
        trackEvent('contact_form_success')
      } else {
        setFormStatus('error')
        console.error('Submission failed:', result.error)
      }
    } catch (err) {
      setFormStatus('error')
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <li><strong>{lang === 'de' ? 'Rolle' : 'Role'}:</strong> {activeProject.details.role}</li>
              <li><strong>{lang === 'de' ? 'Kontext' : 'Context'}:</strong> {activeProject.details.context}</li>
              <li><strong>Impact:</strong> {activeProject.details.impact}</li>
              <li><strong>Tech:</strong> {activeProject.details.tech}</li>
              <li>
                <strong>{lang === 'de' ? 'Sprache(n)' : 'Language(s)'}:</strong>{' '}
                {activeProject.details.languages?.join(', ')}
              </li>
            </ul>
            <div className="case-study">
              <h4>{lang === 'de' ? 'Case Study' : 'Case Study'}</h4>
              <p><strong>{lang === 'de' ? 'Challenge' : 'Challenge'}:</strong> {activeProject.details.challenge}</p>
              <p><strong>{lang === 'de' ? 'Loesung' : 'Solution'}:</strong> {activeProject.details.solution}</p>
              <p><strong>{lang === 'de' ? 'Ergebnis' : 'Result'}:</strong> {activeProject.details.result}</p>
            </div>
            <a
              href={activeProject.details.link}
              className="link"
              target={activeProject.details.link.startsWith('http') ? '_blank' : undefined}
              rel={activeProject.details.link.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {lang === 'de' ? 'Projekt ansehen' : 'View project'}
            </a>
            {activeProject.details.trailer && (
              <a
                href={activeProject.details.trailer}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginLeft: '14px' }}
              >
                {lang === 'de' ? 'Trailer ansehen' : 'Watch trailer'}
              </a>
            )}
          </motion.div>
        </div>
      )}

      <nav className={`nav ${navScrolled ? 'nav--scrolled' : ''}`}>
        <a href="#hero" className="nav-logo" onClick={() => setActiveSection('hero')}>
          <span className="nav-logo-title">Artjom Becker</span>
          <span className="nav-logo-subtitle">{lang === 'de' ? 'Informatik' : 'Computer Science'}</span>
        </a>
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={lang === 'de' ? 'Menü öffnen' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          ☰
        </button>
        <ul className={`nav-links ${mobileMenuOpen ? 'nav-links--open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeSection === item.id ? 'nav-link-active' : ''}
                onClick={() => {
                  setMobileMenuOpen(false)
                  setActiveSection(item.id)
                }}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                {lang === 'de' ? item.labelDe : item.labelEn}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleLang}
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
              aria-label="Sprache wechseln"
            >
              {lang === 'de' ? 'EN' : 'DE'}
            </button>
          </li>
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
          <CVSection lang={lang} />
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
                {lang === 'de' ? 'Informatik-Student' : 'Computer Science Student'}
              </motion.p>
              <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                Hallo, ich bin<br />
                <span className="hero-title-name">Artjom Becker.</span>
              </motion.h1>
              <motion.p className="hero-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
                {lang === 'de'
                  ? 'Ich entwickle Software, löse Probleme und erkunde die Welt der Technologie.'
                  : 'I build software, solve problems, and explore the world of technology.'}
              </motion.p>
            </section>

            <section id="about" className="section">
              <motion.div className="section-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
                <h2 className="section-title">{lang === 'de' ? 'Über mich' : 'About me'}</h2>
                <Terminal
                  lang={lang}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeave}
                  projectTitles={projectTitles}
                />
                <p className="section-text section-text--mt">
                  {lang === 'de'
                    ? 'Ich studiere Informatik und bin fasziniert von der Verbindung zwischen Theorie und Praxis. Teamleitung im Bachelor-Praktikum, Gruppenprojekte mit Bestnote - ich liebe es, komplexe Probleme zu zerlegen und elegante Lösungen zu entwickeln.'
                    : 'I study computer science and I am fascinated by connecting theory and practice. I led teams in a bachelor internship and enjoy breaking down complex problems into elegant solutions.'}
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
                <div className="stack-radar">
                  <h3 className="section-subtitle">{lang === 'de' ? 'Tech Stack im Einsatz' : 'Tech Stack in Practice'}</h3>
                  {STACK.map((group, groupIndex) => (
                    <div key={group.groupDe} className="stack-group">
                      <p className="stack-group-title">{lang === 'de' ? group.groupDe : group.groupEn}</p>
                      {group.items.map((item, itemIndex) => (
                        <div key={item.label} className="stack-row">
                          <div className="stack-row-head">
                            <span>{item.label}</span>
                            <span className="stack-level">{levelLabel(item.level)}</span>
                          </div>
                          <div className="stack-bar">
                            <motion.div
                              className="stack-fill"
                              initial={{ width: 0, opacity: 0.35 }}
                              whileInView={{ width: `${item.level}%`, opacity: 1 }}
                              viewport={{ once: true, amount: 0.5 }}
                              transition={{
                                duration: 0.9,
                                delay: groupIndex * 0.08 + itemIndex * 0.08,
                                ease: [0.2, 0.65, 0.3, 1],
                              }}
                            />
                          </div>
                          <p className="stack-context">{lang === 'de' ? item.contextDe : item.contextEn}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            <section id="timeline" className="section">
              <motion.div className="section-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
                <h2 className="section-title">{lang === 'de' ? 'Timeline' : 'Timeline'}</h2>
                <div className="timeline">
                  {TIMELINE.map((entry) => (
                    <article key={`${entry.year}-${entry.de}`} className="timeline-item">
                      <p className="timeline-year">{entry.year}</p>
                      <p className="timeline-text">{lang === 'de' ? entry.de : entry.en}</p>
                    </article>
                  ))}
                </div>
              </motion.div>
            </section>

            <section id="projects" className="section">
              <motion.div className="section-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
                <h2 className="section-title">{lang === 'de' ? 'Ausgewählte Projekte' : 'Selected Projects'}</h2>
                <div className="project-filters">
                  {PROJECT_FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={`filter-chip ${projectFilter === filter ? 'filter-chip--active' : ''}`}
                      onClick={() => {
                        setProjectFilter(filter)
                        trackEvent('project_filter', { filter })
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="projects-list">
                  {visibleProjects.map((project) => (
                    <article key={project.id} className="project" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                      <div className="project-content">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-desc">{project.short}</p>
                        <div className="project-actions">
                          <button className="link link-button" onClick={() => setActiveProject(project)}>
                            {lang === 'de' ? 'Details öffnen' : 'Open details'}
                          </button>
                          {project.details.link.startsWith('http') && (
                            <a href={project.details.link} target="_blank" rel="noopener noreferrer" className="link project-direct">
                              {project.details.link.includes('github.com') ? 'Repo ↗' : 'Live ↗'}
                            </a>
                          )}
                          {project.details.trailer && (
                            <a href={project.details.trailer} target="_blank" rel="noopener noreferrer" className="link project-direct">
                              Trailer ↗
                            </a>
                          )}
                        </div>
                        <div className="project-tags">
                          {project.details.languages?.map((language) => (
                            <span key={`${project.id}-${language}`} className="project-tag project-tag--language">
                              {lang === 'de' ? `Sprache: ${language}` : `Language: ${language}`}
                            </span>
                          ))}
                          {project.details.tags?.map((tag) => (
                            <span key={`${project.id}-${tag}`} className="project-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {hasMoreProjects && (
                  <div className="projects-more">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowAllProjects(!showAllProjects)
                        trackEvent('project_toggle', { state: !showAllProjects })
                      }}
                      onMouseEnter={handleHover}
                      onMouseLeave={handleLeave}
                    >
                      {showAllProjects
                        ? (lang === 'de' ? 'Weniger anzeigen' : 'Show less')
                        : (lang === 'de' ? `Alle Projekte anzeigen (${filteredProjects.length})` : `Show all projects (${filteredProjects.length})`)}
                    </button>
                  </div>
                )}
                <a href="https://github.com/DjamilB?tab=repositories" target="_blank" rel="noopener noreferrer" className="link link--center" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                  {lang === 'de' ? 'Alle Projekte auf GitHub' : 'All projects on GitHub'}
                </a>
              </motion.div>
            </section>

            <section id="contact" className="section section--alt section--contact">
              <motion.div className="contact-inner" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="contact-title">{lang === 'de' ? 'Lass uns vernetzen.' : 'Let us connect.'}</h2>
                <p className="contact-text">{lang === 'de' ? 'Ob Zusammenarbeit, Fragen zu Projekten oder einfach nur Austausch - ich freue mich über jede Nachricht.' : 'For collaboration, project questions, or just a quick exchange - I am happy to hear from you.'}</p>
                
                <form className="contact-form" onSubmit={handleFormSubmit}>
                  {formStatus === 'success' && (
                    <div className="form-status form-status--success">
                      {lang === 'de' ? 'Vielen Dank! Deine Nachricht wurde erfolgreich gesendet.' : 'Thank you! Your message has been sent successfully.'}
                    </div>
                  )}
                  {formStatus === 'error' && (
                    <div className="form-status form-status--error">
                      {lang === 'de' ? 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.' : 'Something went wrong. Please try again later.'}
                    </div>
                  )}
                  <div className="form-group">
                    <input name="name" type="text" placeholder={lang === 'de' ? 'Dein Name' : 'Your Name'} required disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <input name="email" type="email" placeholder={lang === 'de' ? 'Deine E-Mail' : 'Your Email'} required disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <textarea name="message" placeholder={lang === 'de' ? 'Deine Nachricht' : 'Your Message'} rows="5" required disabled={isSubmitting}></textarea>
                  </div>
                  <button type="submit" className={`btn ${isSubmitting ? 'btn--loading' : ''}`} disabled={isSubmitting}>
                    {isSubmitting 
                      ? (lang === 'de' ? 'Wird gesendet...' : 'Sending...') 
                      : (lang === 'de' ? 'Nachricht senden' : 'Send message')}
                  </button>
                </form>

                <p className="contact-mail">hi@artjombecker.com</p>
                <div className="contact-links">
                  <a href="https://github.com/artjomartur" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="GitHub" onMouseEnter={handleHover} onMouseLeave={handleLeave}><GitHubIcon /></a>
                  <a href="https://www.linkedin.com/in/artjom-becker-aba5413a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="LinkedIn" onMouseEnter={handleHover} onMouseLeave={handleLeave}><LinkedInIcon /></a>
                  <a href="https://wa.me/4915203322770" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="WhatsApp" onMouseEnter={handleHover} onMouseLeave={handleLeave}><WhatsAppIcon /></a>
                  <a href="https://t.me/+4915203322770" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="Telegram" onMouseEnter={handleHover} onMouseLeave={handleLeave}><TelegramIcon /></a>
                  <a href="https://instagram.com/_artjomartur777" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="Instagram" onMouseEnter={handleHover} onMouseLeave={handleLeave}><InstagramIcon /></a>
                </div>
              </motion.div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Artjom Becker. Designed & gebaut mit Liebe zum Detail.</p>
      </footer>

      {!isCvView && <Chatbot lang={lang} />}
    </>
  )
}

function GitHubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.14 1.59 5.95L0 24l6.35-1.67a11.83 11.83 0 0 0 5.72 1.46h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.14-3.44-8.43Zm-8.44 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.77.99 1.01-3.67-.24-.38a9.86 9.86 0 0 1-1.52-5.25c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.91a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.89-9.86 9.89Zm5.43-7.42c-.3-.15-1.78-.88-2.05-.98-.28-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49a9.13 9.13 0 0 1-1.67-2.07c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.79.37-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.22 3.1.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.71.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0Zm5.9 8.2-1.97 9.29c-.15.66-.54.83-1.1.52l-3.05-2.25-1.47 1.41c-.16.16-.3.3-.62.3l.22-3.11 5.66-5.11c.25-.22-.05-.35-.38-.13L8.2 13.5l-2.98-.93c-.65-.2-.66-.65.14-.96l11.66-4.5c.54-.2 1.01.13.88 1.09Z" />
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

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export default App
