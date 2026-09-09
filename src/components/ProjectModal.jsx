import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { playClickSound } from '../utils/sound';
import { useStore } from '../store/useStore';
import { sfx } from '../sfx';

const OliEasterEgg = React.lazy(() => import('../OliEasterEgg'));
import { ITEMS } from '../data/constants';
import SEO from './SEO';
import ThesisRoadmap from './ThesisRoadmap';

const CsAnimation = React.lazy(() => import('../CsAnimation'));
const SkinStockApp = React.lazy(() => import('./SkinStockApp'));
const Terminal = React.lazy(() => import('../Terminal'));
const KinopolisAppShowcase = React.lazy(() => import('./KinopolisAppShowcase'));
const RelationalAlgebraAnimation = React.lazy(() => import('./RelationalAlgebraAnimation'));

export default function ProjectModal() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const activeProject = useStore((state) => state.activeProject);
  const previousProject = React.useRef(activeProject);
  React.useEffect(() => {
    if (activeProject) previousProject.current = activeProject;
  }, [activeProject]);
  const projectToRender = activeProject || previousProject.current;
  const setActiveProject = useStore((state) => state.setActiveProject);
  const gitStats = useStore((state) => state.gitStats);
  const setIsPongActive = useStore((state) => state.setIsPongActive);
  const setIsMemoryActive = useStore((state) => state.setIsMemoryActive);
  const showOliVideo = useStore((state) => state.showOliVideo);
  const setShowOliVideo = useStore((state) => state.setShowOliVideo);

  const [activeModalTab, setActiveModalTab] = useState('overview');
  const [shareCopied, setShareCopied] = useState(false);
  const [hasScrolledGallery, setHasScrolledGallery] = useState(false);
  const [showCaseOpener, setShowCaseOpener] = useState(false);
  const [showSkinStockApp, setShowSkinStockApp] = useState(false);

  useEffect(() => {
    setActiveModalTab('overview');
    if (projectToRender) {
      sfx.playProjectOpen(projectToRender.id);
      setHasScrolledGallery(false);
    } else {
      setShowCaseOpener(false);
      setShowSkinStockApp(false);
    }
  }, [projectToRender]);

  useEffect(() => {
    if (!projectToRender || projectToRender.id !== 'kinopolis-automation') {
      setShowOliVideo(false);
    }
  }, [projectToRender, setShowOliVideo]);

  const handleGalleryScroll = (e) => {
    if (e.target.scrollLeft > 10) {
      setHasScrolledGallery(true);
    }
    if (projectToRender?.id !== 'kinopolis-automation') return;
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollLeft + clientWidth >= scrollWidth - 20) {
      setShowOliVideo(true);
    }
  };

  const handleShareProject = (e) => {
    e.stopPropagation();
    if (!projectToRender) return;
    const url = new URL(window.location.href);
    url.searchParams.set('project', projectToRender.id);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  const handleViewPdf = (url, title) => {
    useStore.getState().setActivePdfUrl(url);
    useStore.getState().setActivePdfTitle(title);
  };

  if (!projectToRender) return null;

  return (
    <>
      <SEO 
        title={`${projectToRender.title} | Artjom Becker`}
        description={projectToRender.short}
        image={projectToRender.image}
        url={`https://artjombecker.com/?project=${projectToRender.id}`}
      />
      <AnimatePresence>
        {activeProject && (
          <motion.div className="modal-backdrop" onClick={() => { playClickSound(); setActiveProject(null); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button
          type="button"
          className="modal-nav-arrow modal-nav-arrow--prev"
          onClick={(e) => {
            e.stopPropagation();
            const currentIndex = ITEMS.findIndex((item) => item.id === projectToRender.id);
            if (currentIndex !== -1) {
              const prevIndex = (currentIndex - 1 + ITEMS.length) % ITEMS.length;
              setActiveProject(ITEMS[prevIndex]);
              setActiveModalTab('overview');
            }
          }}
          aria-label={t('modal.prev')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="modal-nav-arrow-icon">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <motion.div
          key={projectToRender.id}
          
          className={`project-modal ${projectToRender.id === 'first-aid-simulator' ? 'project-modal--emergency' : ''}`}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {projectToRender.id === 'first-aid-simulator' && <div className="emergency-glow" />}
          {projectToRender.id === 'portfolio' && <div className="git-graph-bg" />}
          {projectToRender.id === 'arcadesuite' && <div className="arcade-retro-bg" />}

          <div className="modal-actions">
            <button
              className={`modal-share ${shareCopied ? 'copied' : ''}`}
              onClick={handleShareProject}
              title={lang === 'de' ? 'Projekt Link kopieren' : 'Copy Project Link'}
              aria-label={lang === 'de' ? 'Link kopieren' : 'Copy Link'}
            >
              {shareCopied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
              )}
            </button>
            <button className="modal-close" onClick={() => { playClickSound(); setActiveProject(null); }} title={t('modal.close')} aria-label={t('modal.close')}>
              ×
            </button>
          </div>

          {projectToRender.id === 'kinopolis-automation' ? (
            <Suspense fallback={<div className="modal-image" style={{ background: '#0d1117' }} />}>
              <KinopolisAppShowcase lang={lang} />
              <OliEasterEgg active={showOliVideo} />
            </Suspense>
          ) : projectToRender.id === 'bachelor-thesis' ? (
            <ThesisRoadmap />
          ) : projectToRender.id === 'uni-lehrmaterial' ? (
            <Suspense fallback={<div className="modal-image" style={{ background: '#0d1117' }} />}>
              <RelationalAlgebraAnimation lang={lang} />
            </Suspense>
          ) : projectToRender.images ? (
            <div style={{ position: 'relative' }}>
              <div className="modal-image-gallery" onScroll={handleGalleryScroll}>
                {projectToRender.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`${projectToRender.title} ${idx + 1}`} className="modal-image" loading="lazy" decoding="async" />
                ))}
              </div>
              {!hasScrolledGallery && projectToRender.images.length > 1 && (
                <div className="gallery-scroll-hint" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              )}
              <Suspense fallback={null}><OliEasterEgg active={showOliVideo} /></Suspense>
            </div>
          ) : (
            <img src={projectToRender.image} alt={projectToRender.title} className="modal-image" loading="lazy" decoding="async" />
          )}

          <div className="modal-text-content">
            <motion.h3  id="modal-title">{projectToRender.title}</motion.h3>
            <p>{projectToRender.short}</p>

            <div className="modal-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={activeModalTab === 'overview'}
                className={`modal-tab-btn ${activeModalTab === 'overview' ? 'modal-tab-btn--active' : ''}`}
                onClick={() => { playClickSound(); setActiveModalTab('overview'); }}
              >
                {lang === 'de' ? 'Übersicht' : 'Overview'}
              </button>
              <button
                role="tab"
                aria-selected={activeModalTab === 'challenge'}
                className={`modal-tab-btn ${activeModalTab === 'challenge' ? 'modal-tab-btn--active' : ''}`}
                onClick={() => { playClickSound(); setActiveModalTab('challenge'); }}
              >
                {lang === 'de' ? 'Challenge & Lösung' : 'Challenge & Solution'}
              </button>
              <button
                role="tab"
                aria-selected={activeModalTab === 'outcome'}
                className={`modal-tab-btn ${activeModalTab === 'outcome' ? 'modal-tab-btn--active' : ''}`}
                onClick={() => { playClickSound(); setActiveModalTab('outcome'); }}
              >
                {lang === 'de' ? 'Ergebnis & Links' : 'Outcome & Links'}
              </button>
            </div>

            <div className="modal-tab-content">
              {activeModalTab === 'overview' && (
                <motion.ul
                  className="modal-facts"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="tabpanel"
                >
                  <li><strong>{lang === 'de' ? 'Rolle' : 'Role'}:</strong> {projectToRender.details.role}</li>
                  <li><strong>{lang === 'de' ? 'Kontext' : 'Context'}:</strong> {projectToRender.details.context}</li>
                  <li><strong>Impact:</strong> {projectToRender.details.impact}</li>
                  <li><strong>Tech:</strong> {projectToRender.details.tech}</li>
                  <li>
                    <strong>{lang === 'de' ? 'Sprache(n)' : 'Language(s)'}:</strong>{' '}
                    {projectToRender.details.languages?.join(', ')}
                  </li>
                  {gitStats[projectToRender.id] && (
                    <li>
                      <strong>GitHub:</strong>{' '}
                      <span className="github-badge" aria-label={`GitHub Stars: ${gitStats[projectToRender.id].stars}`}>⭐ {gitStats[projectToRender.id].stars} Stars</span>
                      {' · '}
                      <span>{lang === 'de' ? 'Aktiv am' : 'Active on'} {gitStats[projectToRender.id].updatedAt}</span>
                    </li>
                  )}
                </motion.ul>
              )}

              {activeModalTab === 'challenge' && (
                <motion.div
                  className="case-study"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="tabpanel"
                >
                  <h4>{lang === 'de' ? 'Herausforderung' : 'The Challenge'}</h4>
                  <p>{projectToRender.details.challenge}</p>
                  <h4 style={{ marginTop: '16px' }}>{lang === 'de' ? 'Lösungsweg' : 'Our Solution'}</h4>
                  <p>{projectToRender.details.solution}</p>
                </motion.div>
              )}

              {activeModalTab === 'outcome' && (
                <motion.div
                  className="case-study"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="tabpanel"
                >
                  <h4>{lang === 'de' ? 'Ergebnis & Impact' : 'Result & Impact'}</h4>
                  <p>{projectToRender.details.result}</p>

                  <div className="modal-links-group" style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {projectToRender.type === 'seminar' && projectToRender.details.link && (
                      (projectToRender.details.link.endsWith('.pdf') || projectToRender.details.link.endsWith('.pptx')) ? (
                        <button
                          type="button"
                          className="link link-button"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                            color: '#60a5fa', background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.25)',
                            padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                            textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer'
                          }}
                          onClick={() => { playClickSound(); handleViewPdf(projectToRender.details.link, lang === 'de' ? `Seminararbeit - ${projectToRender.title}` : `Seminar Paper - ${projectToRender.title}`); }}
                        >
                          📄 {t('modal.viewPaper')}
                        </button>
                      ) : (
                        <a
                          href={projectToRender.details.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-button"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                            color: '#60a5fa', background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.25)',
                            padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                            textDecoration: 'none', transition: 'all 0.2s'
                          }}
                        >
                          📄 {t('modal.viewPaper')}
                        </a>
                      )
                    )}

                    {projectToRender.type === 'project' && projectToRender.details.link && (
                      <a
                        href={projectToRender.details.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-button"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                          color: '#60a5fa', background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.25)',
                          padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                          textDecoration: 'none', transition: 'all 0.2s'
                        }}
                      >
                        {projectToRender.details.link.includes('github.com') ? (
                          <>💻 {t('modal.viewRepo')}</>
                        ) : projectToRender.id === 'uni-lehrmaterial' ? (
                          <>🚀 {lang === 'de' ? 'Simulator direkt öffnen ↗' : 'Launch Simulator ↗'}</>
                        ) : (
                          <>🌐 {t('modal.viewLive')}</>
                        )}
                      </a>
                    )}

                    {projectToRender.details.overviewPage && (
                      <a
                        href={projectToRender.details.overviewPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-button"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                          color: '#fbbf24', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)',
                          padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                          textDecoration: 'none', transition: 'all 0.2s'
                        }}
                      >
                        {projectToRender.id === 'uni-lehrmaterial' ? (
                          <>📚 {lang === 'de' ? 'Alle Lehrmaterialien (Sammlung) ↗' : 'All Learning Materials (Hub) ↗'}</>
                        ) : (
                          <>📋 {lang === 'de' ? 'Projektübersicht öffnen' : 'Open Project Overview'}</>
                        )}
                      </a>
                    )}

                    {projectToRender.details.pdf && (
                      <button
                        type="button"
                        className="link link-button"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                          color: '#34d399', background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.25)',
                          padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                          textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer'
                        }}
                        onClick={() => { playClickSound(); handleViewPdf(projectToRender.details.pdf, lang === 'de' ? `Dokumentation - ${projectToRender.title}` : `Documentation - ${projectToRender.title}`); }}
                      >
                        📚 {t('modal.viewDocs')}
                      </button>
                    )}

                    {projectToRender.details.slides && (
                      (projectToRender.details.slides.endsWith('.pdf') || projectToRender.details.slides.endsWith('.pptx')) ? (
                        <button
                          type="button"
                          className="link link-button"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                            color: '#a78bfa', background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.25)',
                            padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                            textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer'
                          }}
                          onClick={() => { playClickSound(); handleViewPdf(projectToRender.details.slides, lang === 'de' ? `Präsentationsfolien - ${projectToRender.title}` : `Presentation Slides - ${projectToRender.title}`); }}
                        >
                          📊 {lang === 'de' ? 'Folien anzeigen ↗' : 'View Slides ↗'}
                        </button>
                      ) : (
                        <a
                          href={projectToRender.details.slides}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-button"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                            color: '#a78bfa', background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.25)',
                            padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                            textDecoration: 'none', transition: 'all 0.2s'
                          }}
                        >
                          📊 {lang === 'de' ? 'Folien öffnen ↗' : 'Open Slides ↗'}
                        </a>
                      )
                    )}

                    {projectToRender.details.trailer && (
                      <a
                        href={projectToRender.details.trailer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-button"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                          color: '#f87171', background: 'rgba(248, 113, 113, 0.08)', border: '1px solid rgba(248, 113, 113, 0.25)',
                          padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                          textDecoration: 'none', transition: 'all 0.2s'
                        }}
                      >
                        🎬 {t('modal.tabVideo')}
                      </a>
                    )}

                    {projectToRender.details.hasEasterEgg && (
                      <button
                        className="link link-button"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                          color: '#fbbf24', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)',
                          padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onClick={() => {
                          setActiveProject(null);
                          setIsPongActive(true);
                        }}
                      >
                        🎮 {lang === 'de' ? 'Play Pong' : 'Play Pong'}
                      </button>
                    )}

                    {projectToRender.id === 'portfolio' && (
                      <button
                        className="link link-button"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                          color: '#fbbf24', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)',
                          padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onClick={() => {
                          setActiveProject(null);
                          setIsMemoryActive(true);
                        }}
                      >
                        🎮 {lang === 'de' ? 'Play Tech Memory' : 'Play Tech Memory'}
                      </button>
                    )}
                  </div>

                  {projectToRender.id === 'skinstock' && (
                    showCaseOpener || showSkinStockApp ? (
                      <div>
                        <button
                          onClick={() => {
                            setShowCaseOpener(false);
                            setShowSkinStockApp(false);
                          }}
                          className="sandbox-btn"
                          style={{
                            marginBottom: '16px', width: 'auto', padding: '6px 14px', background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '12px', fontWeight: '600'
                          }}
                        >
                          ← {t('modal.prev')}
                        </button>
                        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Loading...</div>}>
                          {showCaseOpener ? <CsAnimation lang={lang} /> : <SkinStockApp lang={lang} />}
                        </Suspense>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => { playClickSound(); setShowCaseOpener(true); }}
                          className="link link-button"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0,
                            color: '#ffae00', background: 'rgba(255, 174, 0, 0.08)', border: '1px solid rgba(255, 174, 0, 0.25)',
                            padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          📦 {lang === 'de' ? 'Kisten-Simulator starten' : 'Launch Case Simulator'}
                        </button>
                      </div>
                    )
                  )}

                  {projectToRender.id === 'uni-lehrmaterial' && (
                    <div style={{
                      marginTop: '24px',
                      padding: '18px 20px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#818cf8', display: 'block' }}>
                            {lang === 'de' ? 'Interaktives Web-Tool' : 'Interactive Web Tool'}
                          </span>
                          <h4 style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: '700', color: 'var(--text, #fff)' }}>
                            {lang === 'de' ? 'Relationale Algebra Join-Simulator & Explorer' : 'Relational Algebra Join Simulator & Explorer'}
                          </h4>
                        </div>
                        <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '999px', fontWeight: '600' }}>
                          ● Live App
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted, #cbd5e1)', lineHeight: 1.5 }}>
                        {lang === 'de'
                          ? 'Beinhaltet Live-Tupelberechnung für alle 9 Join-Typen, Schritt-für-Schritt Entscheidungs-Wizard, KaTeX Formelkatalog und Aufgaben-Trainer.'
                          : 'Includes real-time tuple calculation for 9 join types, step-by-step decision wizard, KaTeX formula catalog, and exam phrase trainer.'}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
                        <a
                          href="/lehrmaterial/relationale-algebra/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#4f46e5',
                            color: '#fff',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)'
                          }}
                        >
                          ⚡ {lang === 'de' ? 'Simulator direkt öffnen ↗' : 'Launch Simulator ↗'}
                        </a>
                        <a
                          href="/lehrmaterial/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: 'var(--text, #e2e8f0)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            textDecoration: 'none'
                          }}
                        >
                          📚 {lang === 'de' ? 'Alle Lehrmaterialien (Sammlung) ↗' : 'All Learning Materials ↗'}
                        </a>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <button
          type="button"
          className="modal-nav-arrow modal-nav-arrow--next"
          onClick={(e) => {
            e.stopPropagation();
            const currentIndex = ITEMS.findIndex((item) => item.id === projectToRender.id);
            if (currentIndex !== -1) {
              const nextIndex = (currentIndex + 1) % ITEMS.length;
              setActiveProject(ITEMS[nextIndex]);
              setActiveModalTab('overview');
            }
          }}
          aria-label={t('modal.next')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="modal-nav-arrow-icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
