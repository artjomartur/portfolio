import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import SplitFlapText from '../SplitFlapText';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProjectsSection({
  dynamicTags,
  visibleProjects,
  hasMoreProjects,
  filteredProjects,
  handleCardMouseMove,
  handleCardMouseLeave,
  handleHover,
  handleLeave,
  handleViewPdf,
  trackEvent
}) {
  const { t } = useTranslation();
  
  const primaryFilter = useStore((state) => state.primaryFilter);
  const setPrimaryFilter = useStore((state) => state.setPrimaryFilter);
  const projectFilter = useStore((state) => state.projectFilter);
  const setProjectFilter = useStore((state) => state.setProjectFilter);
  const showAllProjects = useStore((state) => state.showAllProjects);
  const setShowAllProjects = useStore((state) => state.setShowAllProjects);
  const setActiveProject = useStore((state) => state.setActiveProject);
  const gitStats = useStore((state) => state.gitStats);

  const [activeCategory, setActiveCategory] = useState('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const TAG_CATEGORIES = {
    'Sprachen': ['JavaScript', 'HTML', 'CSS', 'Swift', 'C#', 'Python', 'TypeScript', 'Node.js'],
    'Frameworks': ['Xcode', 'Unity', 'SteamVR', 'Playwright', 'Firebase', 'React', 'Vite', 'Capacitor', 'SQL', 'Git'],
    'Themen': ['Web', 'iOS', 'Mobile', 'UI/UX', 'Automation', 'Game Dev', 'UX', 'AI', 'Research', 'Branding', 'macOS', 'Productivity', 'Education', 'Datenschutz', 'DSGVO', 'Seminar', 'Psychology', 'Social Psychology', 'Groupthink', 'Bot', 'Fintech', 'App Store', 'Leadership', 'Mentoring', 'Management', 'Agile', 'Team']
  };

  // Determine which tags to show based on selected category
  const tagsToDisplay = activeCategory === 'All'
    ? dynamicTags
    : dynamicTags.filter(tag => tag === 'All' || TAG_CATEGORIES[activeCategory]?.includes(tag));

  return (
    <section id="projects" className="section">
      <motion.div className="section-inner" initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-100px' }}>
        <h2 className="section-title"><SplitFlapText text={t('projects.title')} /></h2>
        
        {/* Primary Filter row */}
        <div className="primary-filters" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <button
            type="button"
            className={`filter-chip ${primaryFilter === 'all' ? 'filter-chip--active' : ''}`}
            onClick={() => {
              setPrimaryFilter('all');
              trackEvent('primary_filter', { type: 'all' });
            }}
          >
            {t('projects.filterAll')}
          </button>
          <button
            type="button"
            className={`filter-chip ${primaryFilter === 'project' ? 'filter-chip--active' : ''}`}
            onClick={() => {
              setPrimaryFilter('project');
              trackEvent('primary_filter', { type: 'project' });
            }}
          >
            {t('projects.filterProjects')}
          </button>
          <button
            type="button"
            className={`filter-chip ${primaryFilter === 'seminar' ? 'filter-chip--active' : ''}`}
            onClick={() => {
              setPrimaryFilter('seminar');
              trackEvent('primary_filter', { type: 'seminar' });
            }}
          >
            {t('projects.filterSeminars')}
          </button>
          <button
            type="button"
            className={`filter-chip ${primaryFilter === 'leadership' ? 'filter-chip--active' : ''}`}
            onClick={() => {
              setPrimaryFilter('leadership');
              trackEvent('primary_filter', { type: 'leadership' });
            }}
          >
            {t('projects.filterLeadership')}
          </button>
          <button
            type="button"
            className={`filter-chip ${primaryFilter === 'thesis' ? 'filter-chip--active' : ''}`}
            onClick={() => {
              setPrimaryFilter('thesis');
              trackEvent('primary_filter', { type: 'thesis' });
            }}
          >
            {t('projects.filterAll') === 'All' ? 'Theses' : 'Abschlussarbeiten'}
          </button>
          
          <button
            type="button"
            className="filter-chip filter-chip-secondary"
            onClick={() => {
              if (showAdvancedFilters) {
                setProjectFilter('All');
                setActiveCategory('All');
              }
              setShowAdvancedFilters(!showAdvancedFilters);
            }}
            style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {showAdvancedFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showAdvancedFilters ? t('projects.hideFilters', 'Weniger') : t('projects.showFilters', 'Filter')}
          </button>
        </div>

        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >

        {/* Tier 2: Category Filter */}
        <div className="project-filters project-filters-categories" style={{ marginBottom: '16px' }}>
          <button
            type="button"
            className={`filter-chip filter-chip-secondary ${activeCategory === 'All' ? 'filter-chip--active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            Alle Tags
          </button>
          {Object.keys(TAG_CATEGORIES).map(cat => (
            <button
              key={cat}
              type="button"
              className={`filter-chip filter-chip-secondary ${activeCategory === cat ? 'filter-chip--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tier 3: Actual Tags (Secondary Filter row) */}
        <motion.div layout className="project-filters" style={{ marginBottom: '32px' }}>
          <AnimatePresence mode="popLayout">
            {tagsToDisplay.map((filter, i) => (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                key={filter}
                type="button"
                className={`filter-chip filter-chip-tertiary ${projectFilter === filter ? 'filter-chip--active' : ''}`}
                onClick={() => {
                  setProjectFilter(filter);
                  trackEvent('project_filter', { filter });
                }}
              >
                {filter === 'All' ? t('projects.filterAll') : filter}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="projects-list">
          {visibleProjects.map((project, i) => (
            <motion.article 
              key={project.id} 
               
              
              className="project" 
              style={{ cursor: 'pointer' }}
              onMouseMove={handleCardMouseMove} 
              onMouseLeave={handleCardMouseLeave} 
              onMouseEnter={handleHover}
              onClick={() => setActiveProject(project)}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveProject(project);
                }
              }}
              aria-label={`${t('projects.openProject')} ${project.title}`}
            >
              <div className="project-content">
                <div className="project-header-badges" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span className={`type-badge type-badge--${project.type}`}>
                    {project.customType
                      ? (t('projects.filterAll') === 'All' && project.customTypeEn ? project.customTypeEn : project.customType)
                      : (project.type === 'seminar'
                        ? t('projects.typeSeminar')
                        : project.type === 'thesis'
                        ? 'Thesis'
                        : t('projects.typeProject'))}
                  </span>
                  {project.status === 'in-progress' && (
                    <div className="status-badge status-badge--in-progress" style={{ marginBottom: 0 }}>
                      {t('projects.inProgress')}
                    </div>
                  )}
                </div>
                <motion.h3  className="project-title">{project.title}</motion.h3>
                <p className="project-desc">{project.short}</p>
                <div className="project-actions">
                  <button 
                    className="link link-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProject(project);
                    }}
                  >
                    {t('projects.openDetails')}
                  </button>
                  {project.type === 'seminar' ? (
                    <a 
                      href={project.details.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="link project-direct" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('projects.paper')}
                    </a>
                  ) : (
                    project.details.link && (
                      <a 
                        href={project.details.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="link project-direct" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {project.details.link.includes('github.com') ? (
                          <>
                            {t('projects.repo')}
                            {gitStats[project.id] && (
                              <span className="repo-stars-badge" aria-label={`${gitStats[project.id].stars} Stars`}>
                                ★ {gitStats[project.id].stars}
                              </span>
                            )}
                          </>
                        ) : t('projects.live')}
                      </a>
                    )
                  )}
                  {project.details.overviewPage && (
                    <a 
                      href={project.details.overviewPage} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="link project-direct" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.id === 'uni-lehrmaterial' ? '📚 Hub ↗' : '📋 Übersicht ↗'}
                    </a>
                  )}
                  {project.details.pdf && (
                    <button 
                      type="button"
                      className="link project-direct" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPdf(project.details.pdf, `Dokumentation - ${project.title}`);
                      }}
                    >
                      {t('projects.docs')}
                    </button>
                  )}
                  {project.details.slides && (
                    (project.details.slides.endsWith('.pdf') || project.details.slides.endsWith('.pptx')) ? (
                      <button 
                        type="button"
                        className="link project-direct" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPdf(project.details.slides, `Präsentation - ${project.title}`);
                        }}
                      >
                        {t('projects.slides')}
                      </button>
                    ) : (
                      <a 
                        href={project.details.slides} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="link project-direct" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('projects.slides')}
                      </a>
                    )
                  )}
                  {project.details.trailer && (
                    <a 
                      href={project.details.trailer} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="link project-direct"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('projects.trailer')}
                    </a>
                  )}
                </div>
                <div className="project-tags">
                  {project.details.languages?.map((language) => (
                    <span key={`${project.id}-${language}`} className="project-tag project-tag--language">
                      {t('projects.language', { lang: language })}
                    </span>
                  ))}
                  {project.details.tags?.slice(0, 3).map((tag) => (
                    <span key={`${project.id}-${tag}`} className="project-tag">{tag}</span>
                  ))}
                  {project.details.tags?.length > 3 && (
                    <span className="project-tag" style={{ opacity: 0.6 }}>+{project.details.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {hasMoreProjects && (
          <div className="projects-more">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowAllProjects(!showAllProjects);
                trackEvent('project_toggle', { state: !showAllProjects });
              }}
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
            >
              {showAllProjects
                ? t('projects.showLess')
                : t('projects.showAll', { count: filteredProjects.length })}
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}
