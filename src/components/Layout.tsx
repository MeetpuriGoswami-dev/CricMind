import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Page } from '../App'

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'home',      label: 'HOME',      icon: '⬡' },
  { id: 'dashboard', label: 'DASHBOARD', icon: '◈' },
  { id: 'cricai',    label: 'CRICAI',    icon: '✦' },
  { id: 'players',   label: 'PLAYERS',   icon: '◎' },
  { id: 'teams',     label: 'TEAMS',     icon: '◆' },
  { id: 'matches',   label: 'MATCHES',   icon: '◇' },
  { id: 'seasons',   label: 'SEASONS',   icon: '◉' },
  { id: 'simulator', label: 'SIMULATOR', icon: '⬟' },
]

interface Props {
  page: Page
  setPage: (p: Page) => void
  children: React.ReactNode
}

export default function Layout({ page, setPage, children }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState(new Date())
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ─── Navbar ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled 
          ? 'rgba(2,8,23,0.95)' 
          : 'linear-gradient(to bottom, rgba(2,8,23,0.9) 0%, rgba(2,8,23,0.4) 60%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(16px)' : 'blur(4px)',
        borderBottom: scrolled ? '1px solid rgba(0,255,156,0.15)' : '1px solid rgba(255,255,255,0.03)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>
          {/* Logo */}
          <button
            onClick={() => setPage('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, rgba(0,255,156,0.3), rgba(0,194,255,0.2))',
              border: '1px solid rgba(0,255,156,0.4)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 0 12px rgba(0,255,156,0.3)',
            }}>⬡</div>
            <span className="font-display" style={{ fontSize: 18, letterSpacing: '0.15em', color: '#fff' }}>
              CRIC<span className="neon-green">MIND</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="desktop-nav">
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                className={`nav-link ${page === n.id ? 'active' : ''}`}
                onClick={() => { setPage(n.id); window.scrollTo(0,0); }}
              >
                <span style={{ marginRight: 6, opacity: 0.7 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger menu button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setDrawerOpen(true)}
          >
            ☰ MENU
          </button>

          {/* Right: live clock */}
          <div className="live-clock-container">
            <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', color: 'rgba(0,255,156,0.6)', letterSpacing: '0.1em' }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(0,255,156,0.1)',
              border: '1px solid rgba(0,255,156,0.2)',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FF9C', animation: 'pulse-glow 1.5s infinite' }} />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', color: '#00FF9C', letterSpacing: '0.1em' }}>LIVE</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main style={{ paddingTop: page === 'home' ? 0 : 64 }}>
        {children}
      </main>

      {/* ─── Footer ─── */}
      {page !== 'home' && (
        <footer style={{
          borderTop: '1px solid rgba(0,255,156,0.08)',
          padding: '40px 24px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.3)',
        }}>
          <p className="font-display" style={{ fontSize: 11, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)' }}>
            CRICMIND — IPL INTELLIGENCE PLATFORM — DATA: CRICSHEET.ORG — 1226 MATCHES
          </p>
        </footer>
      )}
      {/* Mobile Drawer Overlay and Content */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="mobile-drawer-overlay"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-drawer"
            >
              {/* Close Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
                    fontSize: 24, cursor: 'pointer', fontFamily: 'var(--font-display)'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Drawer Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {NAV_ITEMS.map(n => (
                  <button
                    key={n.id}
                    className={`nav-link ${page === n.id ? 'active' : ''}`}
                    style={{
                      textAlign: 'left',
                      fontSize: 13,
                      padding: '12px 16px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      background: page === n.id ? 'rgba(0,255,156,0.08)' : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      color: page === n.id ? 'var(--neon-green)' : 'var(--text-muted)'
                    }}
                    onClick={() => {
                      setPage(n.id);
                      setDrawerOpen(false);
                      window.scrollTo(0,0);
                    }}
                  >
                    <span style={{ marginRight: 12, fontSize: 16 }}>{n.icon}</span>
                    {n.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
