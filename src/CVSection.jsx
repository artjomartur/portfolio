import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const personal = {
  name: 'Artjom Artur Becker',
  location: 'Darmstadt, Deutschland',
  email: 'hi@artjombecker.com',
  phone: '+49 1520 3322770',
}

const experience = [
  {
    role: 'Studentische Aushilfe',
    company: 'Kinopolis, Darmstadt',
    period: 'April 2025 - Heute',
    points: [
      'Freiwillige Entwicklung eines digitalen Dashboards zur betrieblichen Prozessoptimierung (Web-Technologien).',
      'Verantwortung für effiziente Serviceabläufe und Sicherstellung der Qualität im Saalbetrieb.',
      'Kassiertätigkeiten und fundierte Kundenberatung bei hoher Taktung im Arbeitsalltag.',
      'Teamorientierte Zusammenarbeit in einem dynamischen, serviceorientierten Umfeld.',
      'Aktive Mitgestaltung und Unterstützung von Marketing- und Promotionmaßnahmen zur Kundenbindung.',
    ],
  },
  {
    role: 'Werkstudent',
    company: 'Exinpa, Frankfurt am Main',
    period: 'August 2024 - Februar 2025',
    zeugnis: '/exinpa_zeugnis.pdf',
    points: [
      'Strukturierte Aufbereitung und Analyse von Daten mittels Excel zur Vorbereitung von Management-Präsentationen.',
      'Visualisierung komplexer Sachverhalte aus wissenschaftlichen Studien für Entscheidungsträger.',
      'Unterstützung bei der Digitalisierungsberatung durch datenbasierte Auswertungen und zielgruppengerechte Präsentationen.',
    ],
  },
  {
    role: 'Aushilfe Dienstleistung & Einzelhandel',
    company: 'Aramark, REWE, dm, Frankfurt am Main',
    period: 'September 2018 - August 2024',
    zeugnis: '/dm_zeugnis.pdf',
    points: [
      'Kundenorientierte Beratung und proaktive Unterstützung in hochfrequentierten Arbeitsumfeldern. Verantwortung für effiziente Warenprozesse.',
      'Sicherstellung eines reibungslosen Kassenbetriebs unter Einhaltung von Kassenabschluss- und Sicherheitsvorgaben.',
      'Stärkung der Teamfähigkeit und Belastbarkeit durch Arbeit in dynamischen, zeitkritischen Dienstleistungsstrukturen.',
    ],
  },
]

const projects = [
  {
    title: 'Exercube - Cyberquest',
    context: 'TU-Darmstadt, SG (Serious Games) • 2026',
    role: 'Gruppenprojekt (4 Personen) • C#, Unity, Steam VR',
    link: 'https://github.com/serious-games-darmstadt/SS25-P21-ExerCube',
    points: [
      'VR & Fitness-Entwicklung: Konzeption und Implementierung eines interaktiven und bewegungsintensiven Serious Games für das ExerCube-System mittels Unity3D und SteamVR.',
      'Gameplay-Programmierung: Entwicklung zentraler Spielmechaniken, insbesondere der Punch-Mechaniken zur physischen Interaktion der Spieler, sowie Implementierung von Encounter-Logiken und Enemy-Spawning.',
      'Rhythmus- & Metagame-Systeme: Integration von Rhythmus-Elementen (HitZones, Beatlines) und Mitwirkung an dynamischen Spielumgebungen (City, Dungeon, Sci-Fi) zur Steigerung der Spieler-Motivation.',
      'UI & Architektur: Strukturierung von Spieldaten mittels Unity ScriptableObjects, Aufbau von Szenenübergängen und Implementierung von Benutzeroberflächen. Team-Kollaboration: Agile Zusammenarbeit unter systematischer Nutzung von Git/GitHub für die Versionskontrolle.',
      'Abschlussnote 1,0',
    ],
  },
  {
    title: 'First Aid Simulator',
    context: 'TU-Darmstadt • 2026',
    role: 'Gruppenprojekt (3 Personen) • C#, Unity',
    link: 'https://artjomartur.itch.io/help-first-aids-simulator',
    points: [
      'Serious Game Entwicklung: Eigenständige Softwarearchitektur und Entwicklung eines 2D-Lernspiels in Unity3D (C#) zur interaktiven Vermittlung von Erste-Hilfe-Maßnahmen.',
      'Medizinische Minispiele & Simulationen: Konzeption und Programmierung diverser modularer Notfall-Szenarien, darunter Reanimations-Mechaniken (HLW), Defibrillator-Einsätze sowie Behandlungen von Verbrennungen, Vergiftungen und Stromschlägen.',
      'Core-Gameplay & Systemarchitektur: Entwicklung robuster Kernsysteme zur Spielsteuerung, Implementierung interaktiver Quiz- und Triage-Mechaniken, eines dynamischen Punktesystems sowie von Drag-and-Drop-Interaktionen für das virtuelle Notfall-Kit.',
      'World Building & Game Feel: Programmierung von Charakter-Controllern und autarkem NPC-Verhalten (inklusive Dialog-Systemen und Bewegungslogik) sowie Einbau von Szenenübergängen, Kamera-Effekten, Parallax-Hintergründen und einem Tag-Nacht-Zyklus zur Steigerung der Immersion.',
      'UI/UX & Audio-Engineering: Aufbau zentraler Systeme zur dynamischen Generierung von Benutzeroberflächen und kontextsensitiven Interaktionshinweisen sowie Entwicklung von Audio-Controllern für fließende visuelle und akustische Übergänge.',
    ],
  },
  {
    title: 'Arcade Suite',
    context: 'AIML Lab (Artificial Intelligence & Machine Learning Lab) • 2025',
    role: 'Gruppenprojekt (5 Personen) • Python',
    link: 'https://github.com/artjomartur/ArcadeSuite',
    points: [
      'Zielsetzung: Entwicklung einer Simulations- und Spielumgebung, in der KI-Agenten modifizierte Atari-2600-Spiele spielen können.',
      'Spielmodi: Konzeption und Implementierung verschiedener Interaktionsmodi wie Player-vs-Player (PvP), Player-vs-AI (PvE) sowie AI-vs-AI (EvE) für über 15 unterstützte Atari-Klassiker.',
      'KI-Analyse & Visualisierung: Integration des SCoBots-Frameworks zur Live-Visualisierung und detaillierten Analyse der Entscheidungsfindung von Reinforcement-Learning-Agenten.',
      'Technologien & Frameworks: Python, Gymnasium (Reinforcement Learning Environments), Stable-Baselines3, Integration externer Forschungs-Repositories via Git Submodules.',
      'UI & Steuerung: Entwicklung eines interaktiven Hauptmenüs und einer In-Game-Steuerung (inklusive Pausieren, Frame-Stepping und Echtzeit-Overlays für die KI-Analyse).',
    ],
  },
  {
    title: 'Kinopolis Automation Dashboard',
    context: 'Eigenständiges Projekt • 2026',
    role: 'Einzelprojekt • JavaScript, React, Node.js',
    link: 'https://kinopolis.artjombecker.com',
    points: [
      'Entwicklung eines Echtzeit-Dashboards zur Prozessautomatisierung und Auslastungsüberwachung für Kinopolis-Standorte.',
      'Kernfunktionen: Live-Datenextraktion von Spielzeiten, Implementierung eines automatisierten Alert-Systems für operative Aufgaben und Multi-Standort-Verwaltung. Inklusive Inventur Tools und Admin Seite.',
      'UI/UX-Design: Gestaltung einer responsiven, modernen "Glassmorphism" Dark-Theme-Oberfläche für Desktop- und mobile Endgeräte.',
    ],
  },
  {
    title: 'ATOSS Calendar Sync',
    context: 'Eigenständiges Automatisierungsprojekt • 2026',
    role: 'Einzelprojekt • Python, AppleScript, macOS Mail',
    link: 'https://github.com/artjomartur/atoss-sync',
    points: [
      'Automatisierung: Entwicklung eines vollautomatisierten Workflows zur Synchronisation von ATOSS-Dienstplänen in den Apple Calendar.',
      'PDF-Parsing: Implementierung eines Python-Skripts mit pdfplumber zur robusten Extraktion und Validierung von Schichtzeiten aus PDF-Tabellendokumenten.',
      'System-Integration: Erstellung eines AppleScript-Mail-Regel-Skripts zur vollautomatischen Ausführung des Sync-Prozesses direkt bei Erhalt der Dienstplan-E-Mail.',
      'Kalender-Management: Dynamische Bereinigung veralteter Schichtzeiträume und konfliktfreie Eintragung neuer Termine via AppleScript-Schnittstelle.',
    ],
  },
  {
    title: 'SkinStock CS2 Portfolio Tracker',
    context: 'Eigenständiges Projekt • 2026',
    role: 'Einzelprojekt • Swift, React, Capacitor, Firebase',
    link: 'https://skinstock.artjombecker.com',
    points: [
      'Entwicklung einer plattformübergreifenden Web- und mobilen Applikation zur Echtzeit-Portfolio- und Preisüberwachung für CS2-Skins.',
      'Native iOS-Integration: Einbindung nativer Systemkomponenten mit Capacitor und benutzerdefinierten Swift-Brücken für optimale Performance.',
      'Fintech-Visualisierung: Hochperformante Echtzeit-Charts unter Verwendung von TradingView Lightweight Charts zur Darstellung historischer Preisdaten.',
    ],
  },
]

const education = [
  {
    title: 'Bachelor of Science in Informatik',
    place: 'TU Darmstadt - Darmstadt',
    period: '2023 - Heute',
    points: [
      'Fokus: Software-Entwicklung, Künstliche Intelligenz und Data Science.',
      'Künstliche Intelligenz: Vertiefung in Machine Learning, neuronale Netze und KI-gestützte Datenanalyse (praktische Umsetzung im Projekt "Arcade Suite").',
      'Software-Engineering: Fundierte Ausbildung in agilen Entwicklungsmethoden und der Konzeption intelligenter, datengestützter Softwaresysteme.',
      'Analytischer Ansatz: Fokus auf die algorithmische Lösung komplexer Problemstellungen und die Integration von KI-Modellen in bestehende Software-Umgebungen.',
    ],
  },
  {
    title: 'Bachelor of Science in Informatik',
    place: 'Johann Wolfgang Goethe Universität - Frankfurt',
    period: '2021 - 2023',
    points: [
      'Studium der Informatik mit Anwendungsfach Psychologie.',
      'Fokus: Schnittstelle zwischen IT-Systemen und menschlichem Nutzerverhalten (Human-Computer Interaction).',
      'Sozialpsychologie: Verständnis von Gruppendynamiken und Kommunikationsprozessen – wertvoll für die professionelle Zusammenarbeit mit interdisziplinären Fachabteilungen und Projektteams.',
      'Allgemeine Psychologie: Analyse kognitiver Informationsverarbeitung zur Optimierung von Benutzeroberflächen (UI/UX) und intuitiven Software-Workflows. Praxisbezug: Systematische Problemlösungskompetenz durch die Verknüpfung von technischer Logik und psychologischem Anwendungsverständnis.',
    ],
  },
]

const volunteering = [
  {
    role: 'Trainerassistent',
    company: 'TGS Bornheim, Frankfurt am Main',
    period: 'November 2024 - März 2025',
    zeugnis: '/tgs_bornheim_zeugnis.pdf',
    points: [
      'Betreuung & Motivation: Eigenständige Anleitung, Motivation und spielerische Förderung von Kindern im Alter von 6 bis 9 Jahren.',
      'Sicherheit & Verantwortung: Unterstützung beim Auf- und Abbau von Bewegungsstationen sowie Gewährleistung der aktiven Sicherheits- und Hilfestellung während des Trainings.',
      'Sozialkompetenz: Förderung von Teamgeist und Koordination in einem sportlichen Umfeld.',
    ],
  },
]

const skills = [
  {
    category: 'Technische Fähigkeiten',
    items: [
      'KI & Data Science: Machine Learning (Stable-Baselines3), Reinforcement Learning, Datenanalyse, Datenaufbereitung.',
      'Programmierung & Web: JavaScript, React, Node.js, Swift, Python, Git, LaTeX, Softwarearchitektur.',
      'Microsoft-Ökosystem: MS 365 (Expertise in PowerPoint, Excel für Datenanalyse, Teams, SharePoint).',
    ],
  },
  {
    category: 'Methoden & Soft Skills',
    items: [
      'Analyse & Prozessoptimierung: Methodische Problemlösung, Konzeption von Workflows, Dokumentation von Prozessen.',
      'Projektarbeit: Agile Methoden, interdisziplinäre Teamarbeit, Schnittstellenkommunikation (Technik & Fachbereich).',
      'Persönliche Kompetenz: Hohe Eigenverantwortung, autodidaktische Lernbereitschaft, strukturierte und präzise Arbeitsweise.',
    ],
  },
]

function AccordionSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="cv-accordion-section" style={{ marginBottom: '16px' }}>
      <h4 
        onClick={handleToggle} 
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          userSelect: 'none',
          marginBottom: isOpen ? '12px' : '0',
          transition: 'margin-bottom 0.3s ease'
        }}
      >
        {title}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: '0.8em', opacity: 0.6 }}
        >
          ▼
        </motion.span>
      </h4>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EasterEggWrapper({ type, className, style, children }) {
  return (
    <div 
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'inherit', alignItems: 'inherit', justifyContent: 'inherit' }}>
        {children}
      </div>
    </div>
  )
}

function CVSection({ lang = 'de', onViewPdf }) {
  return (
    <section id="cv" className="section">
      <div className="section-inner">
        <h2 className="section-title">{lang === 'de' ? 'CV' : 'Resume'}</h2>
        <div className="cv-head">
          <h3>{personal.name}</h3>
          <p>{personal.location}</p>
          <p>
            <a href={`mailto:${personal.email}`} className="link">
              {personal.email}
            </a>{' '}
            | {personal.phone}
          </p>
          <button 
            type="button"
            onClick={(e) => {
              const rect = e.target.getBoundingClientRect();
              const x = (rect.left + rect.width / 2) / window.innerWidth;
              const y = (rect.top + rect.height / 2) / window.innerHeight;
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { x, y },
                colors: ['#61dafb', '#ff0055', '#10b981', '#f7df1e'],
                zIndex: 9999
              });
              if (onViewPdf) {
                onViewPdf('/CV_ArtjomBecker.pdf', lang === 'de' ? 'Lebenslauf Artjom Becker' : 'Resume Artjom Becker');
              } else {
                window.open('/CV_ArtjomBecker.pdf', '_blank');
              }
            }}
            className="btn cv-download-btn"
            style={{ textDecoration: 'none', display: 'inline-block', border: 'none', cursor: 'pointer' }}
          >
            {lang === 'de' ? 'CV anzeigen & herunterladen' : 'View & Download CV'}
          </button>
        </div>

        <div className="cv-grid">
          <article className="cv-card">
            <AccordionSection title={lang === 'de' ? '💼 Berufserfahrung' : '💼 Experience'} defaultOpen={true}>
              {experience.map((item) => {
                let type = null;
                if (item.company.includes('Kinopolis')) type = 'cinema';
                else if (item.company.includes('Exinpa')) type = 'data';
                else if (item.company.includes('Aramark')) type = 'retail';
                
                return (
                <EasterEggWrapper key={item.company} className="cv-item" type={type}>
                  <p className="cv-item-title">
                    {item.role} · {item.company}
                  </p>
                  <p className="cv-item-period">
                    {item.period}
                    {item.zeugnis && (
                      <button 
                        type="button"
                        onClick={() => onViewPdf ? onViewPdf(item.zeugnis, lang === 'de' ? `Arbeitszeugnis - ${item.company}` : `Reference Letter - ${item.company}`) : window.open(item.zeugnis, '_blank')}
                        className="link cv-item-link"
                        style={{ marginLeft: '12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        {lang === 'de' ? 'Arbeitszeugnis ↗' : 'Reference Letter ↗'}
                      </button>
                    )}
                  </p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </EasterEggWrapper>
              )})}
            </AccordionSection>

            <AccordionSection title={lang === 'de' ? '🚀 Projekte' : '🚀 Projects'} defaultOpen={false}>
              {projects.map((item) => {
                let type = null;
                if (item.context && item.context.includes('Darmstadt')) type = 'darmstadt';
                
                return (
                <EasterEggWrapper key={item.title} className="cv-item" type={type}>
                  <p className="cv-item-title">
                    {item.title}
                    {item.link && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="link cv-item-link"
                        style={{ marginLeft: '12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', fontWeight: 'normal' }}
                      >
                        {lang === 'de' ? 'Projekt ansehen ↗' : 'View project ↗'}
                      </a>
                    )}
                  </p>
                  <p>{item.context}</p>
                  <p className="cv-item-period">{item.role}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </EasterEggWrapper>
              )})}
            </AccordionSection>
          </article>

          <article className="cv-card">
            <AccordionSection title={lang === 'de' ? '🎓 Bildungsweg' : '🎓 Education'} defaultOpen={true}>
              {education.map((item) => {
                let type = null;
                if (item.place.includes('Darmstadt')) type = 'darmstadt';
                else if (item.place.includes('Frankfurt')) type = 'ffm';
                
                return (
                <EasterEggWrapper key={`${item.title}-${item.period}`} className="cv-item" type={type}>
                  <p className="cv-item-title">{item.title}</p>
                  <p>{item.place}</p>
                  <p className="cv-item-period">{item.period}</p>
                  {item.points && (
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </EasterEggWrapper>
              )})}
            </AccordionSection>

            <AccordionSection title={lang === 'de' ? '🤝 Ehrenämter' : '🤝 Volunteering'} defaultOpen={false}>
              {volunteering.map((item) => {
                let type = 'sport';
                return (
                <EasterEggWrapper key={`${item.role}-${item.period}`} className="cv-item" type={type}>
                  <p className="cv-item-title">
                    {item.role} · {item.company}
                  </p>
                  <p className="cv-item-period">
                    {item.period}
                    {item.zeugnis && (
                      <button 
                        type="button"
                        onClick={() => onViewPdf ? onViewPdf(item.zeugnis, lang === 'de' ? `Arbeitszeugnis - ${item.company}` : `Reference Letter - ${item.company}`) : window.open(item.zeugnis, '_blank')}
                        className="link cv-item-link"
                        style={{ marginLeft: '12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        {lang === 'de' ? 'Arbeitszeugnis ↗' : 'Reference Letter ↗'}
                      </button>
                    )}
                  </p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </EasterEggWrapper>
              )})}
            </AccordionSection>

            <AccordionSection title={lang === 'de' ? '💡 Skills' : '💡 Skills'} defaultOpen={false}>
              {skills.map((skillGroup) => (
                <div key={skillGroup.category} className="cv-item">
                  <p className="cv-item-title">{skillGroup.category}</p>
                  <ul>
                    {skillGroup.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </AccordionSection>

            <AccordionSection title={lang === 'de' ? '📜 Zertifikate & Schulungen' : '📜 Certificates & Trainings'} defaultOpen={false}>
              <div className="cv-item" style={{ borderBottom: 0, paddingBottom: 0 }}>
                <div style={{ paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <EasterEggWrapper type="certificate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'de' ? 'Bestätigung Softwareprojektmanager (TU Darmstadt)' : 'Software Project Manager Certificate (TU Darmstadt)'}</span>
                    <button 
                      type="button"
                      onClick={() => onViewPdf ? onViewPdf('/Bestaetigung_Teamprojekt_TU_Darmstadt.pdf', lang === 'de' ? 'Bestätigung Softwareprojektmanager (TU Darmstadt)' : 'Software Project Manager Certificate (TU Darmstadt)') : window.open('/Bestaetigung_Teamprojekt_TU_Darmstadt.pdf', '_blank')}
                      className="link cv-item-link"
                      style={{ fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--accent)', fontWeight: 500 }}
                    >
                      {lang === 'de' ? 'Anzeigen ↗' : 'View ↗'}
                    </button>
                  </EasterEggWrapper>
                  <EasterEggWrapper type="certificate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'de' ? 'HACCP Zertifikat (Kinopolis)' : 'HACCP Food Safety Certificate'}</span>
                    <button 
                      type="button"
                      onClick={() => onViewPdf ? onViewPdf('/HACCP_Kinopolis.pdf', 'HACCP Kinopolis') : window.open('/HACCP_Kinopolis.pdf', '_blank')}
                      className="link cv-item-link"
                      style={{ fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--accent)', fontWeight: 500 }}
                    >
                      {lang === 'de' ? 'Anzeigen ↗' : 'View ↗'}
                    </button>
                  </EasterEggWrapper>
                  <EasterEggWrapper type="certificate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'de' ? 'Zertifikat Arbeitsschutz' : 'Occupational Safety Certificate'}</span>
                    <button 
                      type="button"
                      onClick={() => onViewPdf ? onViewPdf('/Zertifikat_Arbeitsschutz.pdf', 'Zertifikat Arbeitsschutz') : window.open('/Zertifikat_Arbeitsschutz.pdf', '_blank')}
                      className="link cv-item-link"
                      style={{ fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--accent)', fontWeight: 500 }}
                    >
                      {lang === 'de' ? 'Anzeigen ↗' : 'View ↗'}
                    </button>
                  </EasterEggWrapper>
                  <EasterEggWrapper type="certificate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'de' ? 'Brandschutzhelfer Zertifikat' : 'Fire Safety Certificate'}</span>
                    <button 
                      type="button"
                      onClick={() => onViewPdf ? onViewPdf('/Brandschutz.pdf', 'Brandschutz Zertifikat') : window.open('/Brandschutz.pdf', '_blank')}
                      className="link cv-item-link"
                      style={{ fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--accent)', fontWeight: 500 }}
                    >
                      {lang === 'de' ? 'Anzeigen ↗' : 'View ↗'}
                    </button>
                  </EasterEggWrapper>
                  <EasterEggWrapper type="certificate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{lang === 'de' ? 'AGG Schulungszertifikat' : 'General Equal Treatment Act (AGG) Certificate'}</span>
                    <button 
                      type="button"
                      onClick={() => onViewPdf ? onViewPdf('/AGG_Schulung.pdf', 'AGG Schulung') : window.open('/AGG_Schulung.pdf', '_blank')}
                      className="link cv-item-link"
                      style={{ fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--accent)', fontWeight: 500 }}
                    >
                      {lang === 'de' ? 'Anzeigen ↗' : 'View ↗'}
                    </button>
                  </EasterEggWrapper>
                </div>
              </div>
            </AccordionSection>
          </article>
        </div>
      </div>
    </section>
  )
}

export default CVSection
