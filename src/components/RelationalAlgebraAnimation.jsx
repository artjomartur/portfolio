import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../sfx';
import { playClickSound } from '../utils/sound';

const MODULES = [
  {
    id: 'joins',
    title: 'Relationale Algebra',
    badge: 'Modul 1',
    icon: '⋈',
    description: 'Interaktiver Join- & Aggregations-Simulator (γ, τ, MIN, MAX).',
  },
  {
    id: 'tree',
    title: 'Query Optimizer',
    badge: 'Modul 2',
    icon: '🌳',
    description: 'Regelbasierter Pushdown von Selektionen & Kostenreduktion.',
  },
  {
    id: 'norm',
    title: 'Normalisierung',
    badge: 'Modul 3',
    icon: '📐',
    description: 'Attributhüllen (X+), 1NF-BCNF & 3NF-Synthesealgorithmus.',
  },
  {
    id: 'btree',
    title: 'B+ Baum',
    badge: 'Modul 4',
    icon: '🌲',
    description: 'Interaktives Einfügen, Splitten, Index-Seek vs. Full Scan.',
  },
  {
    id: 'tx',
    title: 'Transaktionen & 2PL',
    badge: 'Modul 5',
    icon: '🔒',
    description: 'Konfliktgraphen, Zyklenerkennung & 2-Phasen-Sperrprotokoll.',
  },
];

const R_TUPLES = [
  { id: 2125, name: 'Sokrates', rank: 'C4', color: '#6366f1' },
  { id: 2126, name: 'Russel', rank: 'C4', color: '#38bdf8' },
  { id: 2127, name: 'Kopernikus', rank: 'C3', color: '#f59e0b' },
];

const JOINS = [
  { id: 'equi', label: 'Equi-Join', symbol: '⋈', color: '#6366f1' },
  { id: 'left_outer', label: 'Left Outer', symbol: '⟕', color: '#38bdf8' },
  { id: 'semi', label: 'Semi-Join', symbol: '⋉', color: '#10b981' },
  { id: 'anti', label: 'Anti-Join', symbol: '▷', color: '#f43f5e' },
];

export default function RelationalAlgebraAnimation({ lang = 'de' }) {
  const [activeModule, setActiveModule] = useState('joins');
  const [activeJoin, setActiveJoin] = useState('equi');
  const [highlightIdx, setHighlightIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIdx((prev) => (prev + 1) % 3);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const getResultRows = () => {
    switch (activeJoin) {
      case 'equi':
        return [
          { r: '2125 Sokrates', s: '5001 Grundzüge', match: true },
          { r: '2125 Sokrates', s: '5041 Ethik', match: true },
          { r: '2126 Russel', s: '5043 Erkenntnistheorie', match: true },
        ];
      case 'left_outer':
        return [
          { r: '2125 Sokrates', s: '5001 Grundzüge', match: true },
          { r: '2126 Russel', s: '5043 Erkenntnistheorie', match: true },
          { r: '2127 Kopernikus', s: 'NULL (Keine VL)', match: false, isNull: true },
        ];
      case 'semi':
        return [
          { r: '2125 Sokrates (C4)', s: '✓ In Vorlesung', match: true },
          { r: '2126 Russel (C4)', s: '✓ In Vorlesung', match: true },
        ];
      case 'anti':
        return [
          { r: '2127 Kopernikus (C3)', s: '✕ Ohne Vorlesung', match: false, isAnti: true },
        ];
      default:
        return [];
    }
  };

  const results = getResultRows();

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '16/9',
      minHeight: '350px',
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* 1. Base Campus Hero Image */}
      <img
        src="/tu_darmstadt_hero.jpg"
        alt="TU Darmstadt Campus"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.65) saturate(1.15)',
          transform: 'scale(1.02)',
          transition: 'transform 10s ease-out'
        }}
      />

      {/* 2. Sleek Dark Vignette & Glass Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(6, 8, 24, 0.88) 0%, rgba(13, 18, 42, 0.78) 50%, rgba(3, 5, 14, 0.92) 100%)',
        backdropFilter: 'blur(3px)',
        pointerEvents: 'none'
      }} />

      {/* 3. Floating Ambient Mathematics Particles */}
      <motion.div
        animate={{ y: [-4, 4, -4], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '40px',
          left: '20px',
          fontSize: '11px',
          fontFamily: 'monospace',
          color: '#818cf8',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '2px 8px',
          borderRadius: '999px',
          pointerEvents: 'none'
        }}
      >
        σ [Name = 'Sokrates']
      </motion.div>

      <motion.div
        animate={{ y: [4, -4, 4], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '50px',
          right: '25px',
          fontSize: '11px',
          fontFamily: 'monospace',
          color: '#34d399',
          background: 'rgba(52, 211, 153, 0.12)',
          border: '1px solid rgba(52, 211, 153, 0.25)',
          padding: '2px 8px',
          borderRadius: '999px',
          pointerEvents: 'none'
        }}
      >
        R ⋈_&#123;PersNr = gelesenVon&#125; S
      </motion.div>

      {/* 4. Top Header Bar with Live Module Tabs */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(6, 8, 22, 0.75)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingRight: '8px' }}>
          {MODULES.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  playClickSound();
                  setActiveModule(m.id);
                  sfx.playPop(0.04);
                }}
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? '700' : '500',
                  padding: '5px 9px',
                  borderRadius: '8px',
                  border: `1px solid ${isActive ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                  background: isActive ? 'rgba(99, 102, 241, 0.35)' : 'rgba(15, 23, 42, 0.6)',
                  color: isActive ? '#fff' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{m.icon}</span>
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button to Launch unisuite.artjombecker.com */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="https://unisuite.artjombecker.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#10b981',
              color: '#fff',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Live Suite</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* 5. Main Visual Interactive Stage */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {activeModule === 'joins' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '12px',
            alignItems: 'center',
            background: 'rgba(11, 15, 33, 0.72)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '14px',
            padding: '12px 14px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Left Table R */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '10px',
              padding: '8px 10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '3px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>
                  Relation R (Professor)
                </span>
                <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace' }}>PersNr, Name</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {R_TUPLES.map((t, idx) => {
                  const isCurrent = highlightIdx === idx;
                  return (
                    <motion.div
                      key={t.id}
                      animate={{
                        scale: isCurrent ? 1.02 : 1,
                        borderColor: isCurrent ? '#818cf8' : 'rgba(255, 255, 255, 0.06)',
                        background: isCurrent ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.6)'
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        padding: '3px 6px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10px',
                        fontFamily: 'monospace'
                      }}
                    >
                      <span style={{ color: '#e2e8f0' }}><b>{t.id}</b> {t.name}</span>
                      <span style={{ color: '#94a3b8', fontSize: '9px' }}>{t.rank}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Center Operator Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                Verbundart:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {JOINS.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => {
                      playClickSound();
                      setActiveJoin(j.id);
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: `1px solid ${activeJoin === j.id ? j.color : 'rgba(255, 255, 255, 0.1)'}`,
                      background: activeJoin === j.id ? `${j.color}30` : 'rgba(15, 23, 42, 0.6)',
                      color: activeJoin === j.id ? '#fff' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: activeJoin === j.id ? '700' : '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ color: j.color, fontWeight: '800' }}>{j.symbol}</span>
                    <span>{j.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Result Table */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              padding: '8px 10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '3px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>
                  Ergebnis ({results.length} Zeilen)
                </span>
                <span style={{ fontSize: '9px', color: '#6ee7b7', fontFamily: 'monospace' }}>Live R ⋈ S</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <AnimatePresence mode="wait">
                  {results.map((row, idx) => (
                    <motion.div
                      key={`${activeJoin}-${idx}`}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, delay: idx * 0.03 }}
                      style={{
                        padding: '3px 6px',
                        borderRadius: '6px',
                        border: `1px solid ${row.isNull ? 'rgba(245, 158, 11, 0.3)' : row.isAnti ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.25)'}`,
                        background: row.isNull ? 'rgba(245, 158, 11, 0.15)' : row.isAnti ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '9px',
                        fontFamily: 'monospace'
                      }}
                    >
                      <span style={{ color: '#e2e8f0' }}>{row.r}</span>
                      <span style={{ color: row.isNull ? '#fbbf24' : row.isAnti ? '#fda4af' : '#6ee7b7', fontWeight: '600' }}>{row.s}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : activeModule === 'tree' ? (
          <div style={{
            background: 'rgba(11, 15, 33, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ fontSize: '10px', color: '#a5b4fc', fontWeight: '700', letterSpacing: '0.05em' }}>
              REGELBASIERTER QUERY-OPTIMIZER (PUSHDOWN)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'monospace', fontSize: '11px' }}>
              <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.25)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)' }}>σ(R × S)</span>
              <span style={{ color: '#818cf8' }}>➔</span>
              <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.25)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.4)' }}>(σ R) × S</span>
              <span style={{ color: '#10b981' }}>➔</span>
              <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.25)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)' }}>(σ R) ⋈ S</span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
              Selektions-Pushdown reduziert Kreuzprodukt-Kosten um 99.8% vor der Auswertung.
            </div>
          </div>
        ) : activeModule === 'norm' ? (
          <div style={{
            background: 'rgba(11, 15, 33, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ fontSize: '10px', color: '#a5b4fc', fontWeight: '700', letterSpacing: '0.05em' }}>
              NORMALISIERUNGS-COACH & BERNSTEIN-SYNTHESE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', fontSize: '11px' }}>
              <span style={{ color: '#f43f5e' }}>1NF</span> ➔
              <span style={{ color: '#fbbf24' }}>2NF</span> ➔
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>3NF (Synthese)</span> ➔
              <span style={{ color: '#38bdf8' }}>BCNF</span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
              Attributhüllen <b>X⁺</b>, Minimalüberdeckungen <b>F_c</b> und verlustfreie 3NF-Zerlegungen.
            </div>
          </div>
        ) : activeModule === 'btree' ? (
          <div style={{
            background: 'rgba(11, 15, 33, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', letterSpacing: '0.05em' }}>
              B⁺-BAUM INDEXING PLAYGROUND (ORDNUNG m = 4)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', fontSize: '11px' }}>
              <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.35)', color: '#c7d2fe' }}>[ 25 | 50 ]</span>
              <span>➔</span>
              <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.35)', color: '#6ee7b7' }}>[ 10 | 20 ]</span>
              <span>⇄</span>
              <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.35)', color: '#6ee7b7' }}>[ 30 | 45 ]</span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
              Index Seek (O(log N)) vs. Full Table Scan (O(N)) I/O-Kostenvergleich.
            </div>
          </div>
        ) : (
          <div style={{
            background: 'rgba(11, 15, 33, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '700', letterSpacing: '0.05em' }}>
              TRANSAKTIONEN, 2PL & KONFLIKTGRAPHEN
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', fontSize: '11px' }}>
              <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.35)', color: '#fff' }}>T1: r(A), w(A)</span>
              <span style={{ color: '#f59e0b' }}>➔</span>
              <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(236, 72, 153, 0.35)', color: '#fff' }}>T2: r(A)</span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
              Automatische Zyklenerkennung zur Prüfung auf <b>Konflikt-Serialisierbarkeit</b>.
            </div>
          </div>
        )}
      </div>

      {/* 6. Bottom Footer Strip */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '7px 16px',
        background: 'rgba(6, 8, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span>🏛️ TU Darmstadt • Hochschul-Lehrmaterial & Didaktik-Suite</span>
        </div>
        <a
          href="https://unisuite.artjombecker.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}
        >
          unisuite.artjombecker.com ➔
        </a>
      </div>
    </div>
  );
}

