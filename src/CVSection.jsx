import { jsPDF } from 'jspdf'

const personal = {
  name: 'Artjom Becker',
  location: 'Darmstadt, Hessen 64285',
  email: 'artjomarturbecker@icloud.com',
  phone: '+49 1520 3322770',
}

const experience = [
  {
    role: 'Werkstudent',
    company: 'KINOPOLIS Management Multiplex GmbH, Darmstadt',
    period: 'April 2025 - Heute',
    points: [
      'Einlasskontrollen und Gästebetreuung im Saalbetrieb',
      'Kassiertätigkeiten an Ticket- und Warenkasse inkl. Beratung',
      'Service im gastronomischen Bereich sowie Ordnung und Sauberkeit',
      'Unterstützung von Marketingaktionen und Promotions',
      'Teamorientierte Zusammenarbeit in dynamischem Umfeld',
    ],
  },
  {
    role: 'Werkstudent',
    company: 'exinpa, Frankfurt am Main',
    period: 'August 2024 - Februar 2025',
    points: ['Recherche wissenschaftlicher Studien', 'Erarbeitung von PowerPoint-Präsentationen'],
  },
  {
    role: 'Aushilfe im Einzelhandel',
    company: 'dm-drogerie markt, Frankfurt am Main',
    period: 'Oktober 2023 - Juli 2024',
    points: ['Warenverräumung und Warenpflege'],
  },
  {
    role: 'Aushilfe im Einzelhandel',
    company: 'REWE, Frankfurt am Main',
    period: 'Dezember 2022 - Mai 2023',
    points: ['Kassieren', 'Warenverräumung und Warenpflege', 'Warenannahme'],
  },
  {
    role: 'Wahlhelfer an der Universität',
    company: 'Asta Frankfurt, Frankfurt am Main',
    period: 'Juni 2022 - August 2022',
    points: ['Sicherung der korrekten Urnenwahl', 'Auswertung der Brief- und Urnenwahl'],
  },
  {
    role: 'Aushilfe im Einzelhandel',
    company: 'REWE, Frankfurt am Main',
    period: 'August 2021 - Oktober 2021',
    points: ['Kassieren', 'Warenverräumung und Warenpflege', 'Warenannahme'],
  },
  {
    role: 'Aushilfe in der Gastronomie',
    company: 'Aramark Restaurations GmbH, Frankfurt am Main',
    period: 'Dezember 2018 - Juni 2021',
    points: ['Kassierer'],
  },
]

const volunteer = [
  {
    role: 'Ehrenamtlicher Mitarbeiter',
    company: 'TGS Bornheim, Frankfurt am Main',
    period: 'November 2024 - März 2025',
    points: ['Trainer für Grundschulkinder in Parcours/Turnen'],
  },
]

const education = [
  {
    title: 'Informatik (Bachelor)',
    place: 'Technische Universität Darmstadt, Darmstadt',
    period: 'September 2023 - Heute',
  },
  {
    title: 'Psychologie (Anwendungsfach)',
    place: 'Goethe-Universität Frankfurt am Main',
    period: 'Oktober 2022 - September 2023',
  },
  {
    title: 'Informatik (Bachelor)',
    place: 'Goethe-Universität Frankfurt am Main',
    period: 'Oktober 2021 - September 2023',
  },
  {
    title: 'Mathematik und Informatik (Abitur)',
    place: 'Friedrich Dessauer Gymnasium, Frankfurt am Main',
    period: 'Juli 2017 - Juli 2021',
  },
]

const languages = [
  'Deutsch - Muttersprache',
  'Russisch - Fortgeschrittene',
  'Französisch - Anfänger',
  'Englisch - Fließend',
]

function CVSection({ lang = 'de' }) {
  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 48
    const maxWidth = 500
    let y = margin

    const ensureSpace = (needed = 24) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
    }

    const addWrapped = (text, size = 11, weight = 'normal') => {
      doc.setFont('helvetica', weight)
      doc.setFontSize(size)
      const lines = doc.splitTextToSize(text, maxWidth)
      const lineHeight = size + 4
      ensureSpace(lines.length * lineHeight + 4)
      doc.text(lines, margin, y)
      y += lines.length * lineHeight + 4
    }

    addWrapped(personal.name, 20, 'bold')
    addWrapped(`${personal.location} | ${personal.email} | ${personal.phone}`, 11, 'normal')
    y += 8

    addWrapped(lang === 'de' ? 'Berufserfahrung' : 'Work Experience', 14, 'bold')
    experience.forEach((item) => {
      addWrapped(`${item.role} - ${item.company}`, 12, 'bold')
      addWrapped(item.period, 10, 'normal')
      item.points.forEach((p) => addWrapped(`• ${p}`, 10, 'normal'))
      y += 6
    })

    addWrapped(lang === 'de' ? 'Bildungsweg' : 'Education', 14, 'bold')
    education.forEach((item) => {
      addWrapped(`${item.title} - ${item.place}`, 11, 'bold')
      addWrapped(item.period, 10, 'normal')
    })
    y += 6

    addWrapped(lang === 'de' ? 'Sprachen' : 'Languages', 14, 'bold')
    languages.forEach((lang) => addWrapped(`• ${lang}`, 10, 'normal'))

    doc.save(lang === 'de' ? 'Artjom_Becker_CV.pdf' : 'Artjom_Becker_Resume.pdf')
  }

  return (
    <section id="cv" className="section">
      <div className="section-inner">
        <h2 className="section-title">{lang === 'de' ? 'CV ✨' : 'Resume ✨'}</h2>
        <div className="cv-head">
          <h3>{personal.name}</h3>
          <p>{personal.location}</p>
          <p>
            <a href={`mailto:${personal.email}`} className="link">
              {personal.email}
            </a>{' '}
            | {personal.phone}
          </p>
          <button type="button" className="btn cv-download-btn" onClick={downloadPdf}>
            {lang === 'de' ? 'CV als PDF herunterladen' : 'Download resume as PDF'}
          </button>
        </div>

        <div className="cv-grid">
          <article className="cv-card">
            <h4>{lang === 'de' ? '💼 Berufserfahrung' : '💼 Work experience'}</h4>
            {experience.map((item) => (
              <div key={`${item.role}-${item.period}`} className="cv-item">
                <p className="cv-item-title">
                  {item.role} · {item.company}
                </p>
                <p className="cv-item-period">{item.period}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </article>

          <article className="cv-card">
            <h4>{lang === 'de' ? '🎓 Bildungsweg' : '🎓 Education'}</h4>
            {education.map((item) => (
              <div key={`${item.title}-${item.period}`} className="cv-item">
                <p className="cv-item-title">{item.title}</p>
                <p>{item.place}</p>
                <p className="cv-item-period">{item.period}</p>
              </div>
            ))}

            <h4>{lang === 'de' ? '🤝 Ehrenamt' : '🤝 Volunteering'}</h4>
            {volunteer.map((item) => (
              <div key={`${item.role}-${item.period}`} className="cv-item">
                <p className="cv-item-title">
                  {item.role} · {item.company}
                </p>
                <p className="cv-item-period">{item.period}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h4>{lang === 'de' ? '🌍 Sprachen' : '🌍 Languages'}</h4>
            <ul className="cv-languages">
              {languages.map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

export default CVSection
