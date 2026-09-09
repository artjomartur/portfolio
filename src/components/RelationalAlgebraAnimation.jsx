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
  { id: 2137, name: 'Kant', rank: 'C4', color: '#ec4899' },
];

const S_TUPLES = [
  { vnr: 5001, title: 'Grundzüge', by: 2125, color: '#6366f1' },
  { vnr: 5041, title: 'Ethik', by: 2125, color: '#6366f1' },
  { vnr: 5043, title: 'Erkenntnistheorie', by: 2126, color: '#38bdf8' },
  { vnr: 5216, title: 'Bioethik', by: 9999, color: '#94a3b8' },
];

const JOINS = [
  { id: 'equi', label: 'Equi-Join', symbol: '⋈', color: '#6366f1' },
  { id: 'left_outer', label: 'Left Outer', symbol: '⟕', color: '#38bdf8' },
  { id: 'semi', label: 'Semi-Join', symbol: '⋉', color: '#10b981' },
  { id: 'anti', label: 'Anti-Join', symbol: '▷', color: '#f43f5e' },
];

const UPCOMING_TOPICS = [
  { name: 'Normalformen & Synthese', area: 'Datenbanken', status: 'In Konzeption', icon: '📐' },
  { name: 'B-Bäume & Indexierung', area: 'Algorithmen', status: 'Geplant', icon: '🌲' },
  { name: 'ACID & 2-Phasen-Sperren', area: 'Transaktionssysteme', status: 'Geplant', icon: '🔒' },
  { name: 'ER-Modellierung ➔ Relationen', area: 'Konzeptueller Entwurf', status: 'In Vorbereitung', icon: '📊' },
];

export default function RelationalAlgebraAnimation({ lang = 'de' }) {
  const [activeModule, setActiveModule] = useState('joins');
  const [activeJoin, setActiveJoin] = useState('equi');
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIdx((prev) => (prev + 1) % 4);
    }, 2000);
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
          { r: '2125 Sokrates', s: '5041 Ethik', match: true },
          { r: '2126 Russel', s: '5043 Erkenntnistheorie', match: true },
          { r: '2127 Kopernikus', s: 'NULL (Keine VL)', match: false, isNull: true },
        ];
      case 'semi':
        return [
          { r: '2125 Sokrates (C4)', s: '✓ Treffer in S', match: true },
          { r: '2126 Russel (C4)', s: '✓ Treffer in S', match: true },
        ];
      case 'anti':
        return [
          { r: '2127 Kopernikus (C3)', s: '✕ Ohne VL in S', match: false, isAnti: true },
          { r: '2137 Kant (C4)', s: '✕ Ohne VL in S', match: false, isAnti: true },
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
      minHeight: '340px',
      background: 'linear-gradient(135deg, #070914 0%, #0d1226 50%, #03050c 100%)',
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Background Subtle Mesh */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.12) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.7,
        pointerEvents: 'none'
      }} />

      {/* Top Header Bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(11, 15, 33, 0.85)',
        backdropFilter: 'blur(12px)'
      }}>
        {/* Module Switcher Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          {MODULES.map((m) => {
            const isActive = activeModule === m.id && !showPhoto;
            return (
              <button
                key={m.id}
                onClick={() => {
                  playClickSound();
                  setShowPhoto(false);
                  setActiveModule(m.id);
                  sfx.playPop(0.04);
                }}
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? '700' : '500',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  border: `1px solid ${isActive ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                  background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#fff' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{m.icon}</span>
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action & Photo Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => {
              playClickSound();
              setShowPhoto(!showPhoto);
            }}
            title={showPhoto ? 'Zurück zur Animation' : 'Campus-Foto anzeigen'}
            style={{
              fontSize: '11px',
              padding: '5px 9px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: showPhoto ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{showPhoto ? '⚡ Animation' : '🏛️ Campus'}</span>
          </button>

          <a
            href="https://github.com/artjomartur/uni-lehrmaterial"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '5px 10px',
              borderRadius: '8px',
              background: '#10b981',
              color: '#fff',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}
          >
            <span>GitHub</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Main Visual Stage */}
      {showPhoto ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
        >
          <img
            src="/tu_darmstadt_hero.jpg"
            alt="TU Darmstadt Campus"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            padding: '6px 12px',
            borderRadius: '8px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '11px',
            color: '#e2e8f0'
          }}>
            📍 TU Darmstadt • Hochschul-Lehrmaterial & Didaktik-Sammlung
          </div>
        </motion.div>
      ) : activeModule === 'joins' ? (
        <div style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          padding: '14px 18px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '14px',
          alignItems: 'center'
        }}>
          {/* Left Table R */}
          <div style={{
            background: 'rgba(19, 25, 52, 0.5)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '12px',
            padding: '10px 12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>
                Relation R (Professor)
              </span>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>PersNr, Name</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {R_TUPLES.map((t, idx) => {
                const isCurrent = highlightIdx === idx;
                return (
                  <motion.div
                    key={t.id}
                    animate={{
                      scale: isCurrent ? 1.02 : 1,
                      borderColor: isCurrent ? '#818cf8' : 'rgba(255, 255, 255, 0.06)',
                      background: isCurrent ? 'rgba(99, 102, 241, 0.22)' : 'rgba(15, 23, 42, 0.6)'
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: '4px 7px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  >
                    <span style={{ color: '#e2e8f0' }}><b>{t.id}</b> {t.name}</span>
                    <span style={{ color: '#94a3b8', fontSize: '10px' }}>{t.rank}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Center Operator Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
              Join-Art:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {JOINS.map((j) => (
                <button
                  key={j.id}
                  onClick={() => {
                    playClickSound();
                    setActiveJoin(j.id);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${activeJoin === j.id ? j.color : 'rgba(255, 255, 255, 0.1)'}`,
                    background: activeJoin === j.id ? `${j.color}25` : 'rgba(15, 23, 42, 0.6)',
                    color: activeJoin === j.id ? '#fff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: activeJoin === j.id ? '700' : '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ color: j.color, fontWeight: '800' }}>{j.symbol}</span>
                  <span>{j.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Live Result Table */}
          <div style={{
            background: 'rgba(19, 25, 52, 0.5)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '10px 12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>
                Ergebnis-Relation
              </span>
              <span style={{ fontSize: '10px', color: '#6ee7b7', fontFamily: 'monospace' }}>
                {results.length} Zeilen
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <AnimatePresence mode="wait">
                {results.map((row, idx) => (
                  <motion.div
                    key={`${activeJoin}-${idx}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    style={{
                      padding: '4px 7px',
                      borderRadius: '6px',
                      border: `1px solid ${row.isNull ? 'rgba(245, 158, 11, 0.25)' : row.isAnti ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.2)'}`,
                      background: row.isNull ? 'rgba(245, 158, 11, 0.1)' : row.isAnti ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '10px',
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
          position: 'relative',
          zIndex: 5,
          flex: 1,
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <div style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '700', letterSpacing: '0.05em' }}>
            REGELBASIERTE QUERY-OPTIMIERUNG (PUSHDOWN)
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Kanonische Form</div>
              <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', fontFamily: 'monospace', fontSize: '11px', color: '#fca5a5' }}>
                σ(R × S)
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#818cf8' }}>➔</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Selektions-Pushdown</div>
              <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', fontFamily: 'monospace', fontSize: '11px', color: '#fcd34d' }}>
                (σ R) × S
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#10b981' }}>➔</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Join-Ersetzung</div>
              <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', fontFamily: 'monospace', fontSize: '11px', color: '#6ee7b7' }}>
                (σ R) ⋈ S
              </div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', maxWidth: '460px' }}>
            Filterung vor der Kreuzprodukt-Multiplikation minimiert den Zwischenspeicherbedarf drastisch.
          </div>
        </div>
      ) : activeModule === 'norm' ? (
        <div style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <div style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '700', letterSpacing: '0.05em' }}>
            NORMALISIERUNG & FD-SYNTHESE (BERNSTEIN)
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '10px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontFamily: 'monospace',
            fontSize: '11px'
          }}>
            <span style={{ color: '#f43f5e' }}>1NF (Atomar)</span> ➔
            <span style={{ color: '#fbbf24' }}>2NF (Voll Funktional)</span> ➔
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>3NF (Transitivfrei)</span> ➔
            <span style={{ color: '#38bdf8' }}>BCNF</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
            Berechnet Attributhüllen <b>X⁺</b>, Minimalüberdeckungen <b>F_c</b> und verlustlose 3NF-Zerlegungen.
          </div>
        </div>
      ) : activeModule === 'btree' ? (
        <div style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', letterSpacing: '0.05em' }}>
            B⁺-BAUM & INDEXING PLAYGROUND (ORDNUNG m = 4)
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontFamily: 'monospace',
            fontSize: '11px'
          }}>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.3)', color: '#c7d2fe' }}>[ 25 | 50 ]</span>
            <span>➔</span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.3)', color: '#6ee7b7' }}>[ 10 | 20 ]</span>
            <span>⇄</span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.3)', color: '#6ee7b7' }}>[ 30 | 45 ]</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
            Vergleicht <b>Index Seek</b> (O(log N)) mit sequentiellen <b>Full Table Scans</b> (O(N)).
          </div>
        </div>
      ) : (
        <div style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '700', letterSpacing: '0.05em' }}>
            TRANSAKTIONEN, KONFLIKTGRAPHEN & 2PL
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontFamily: 'monospace',
            fontSize: '11px'
          }}>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.3)', color: '#fff' }}>T1: r(A), w(A)</span>
            <span style={{ color: '#f59e0b' }}>➔ (Konflikt) ➔</span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(236, 72, 153, 0.3)', color: '#fff' }}>T2: r(A)</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
            Automatische Zyklen-Erkennung zur Prüfung auf <b>Konflikt-Serialisierbarkeit</b>.
          </div>
        </div>
      )}

      {/* Bottom Footer Info Strip */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '6px 16px',
        background: 'rgba(6, 8, 18, 0.9)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span>TU Darmstadt • Modulare Lehrmaterial-Plattform (5 Live-Tools)</span>
        </div>
        <a href="https://github.com/artjomartur/uni-lehrmaterial" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
          GitHub Repository ➔
        </a>
      </div>
    </div>
  );
}
