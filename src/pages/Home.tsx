import { motion } from 'framer-motion'
import type { IPLData } from '../types'
import type { Page } from '../App'
import { fmt } from '../utils'
import SeamlessVideo from '../components/SeamlessVideo'

// 3D Scene Components removed (using video background instead)

// ─── Stats ticker ─────────────────────────────────────────────────────────

interface StatPill { label: string; value: string; color: string }

function StatTicker({ stats }: { stats: StatPill[] }) {
  return (
    <div className="stats-ticker-grid">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          className="glass stat-ticker-pill"
        >
          <div style={{ 
            fontSize: 10, 
            fontFamily: 'var(--font-display)', 
            letterSpacing: '0.12em', 
            color: 'rgba(255,255,255,0.75)', 
            marginBottom: 4,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
          }}>
            {s.label}
          </div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: s.color, fontWeight: 700 }}>
            {s.value}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// SeamlessVideo component removed (using HeyGen iframe instead)

// ─── Home Page ────────────────────────────────────────────────────────────

interface Props {
  data: IPLData
  setPage: (p: Page) => void
}

export default function Home({ data, setPage }: Props) {
  const { summary } = data

  const stats: StatPill[] = [
    { label: 'MATCHES',  value: summary.total_matches.toLocaleString(), color: '#00FF9C' },
    { label: 'SEASONS',  value: String(summary.total_seasons), color: '#00C2FF' },
    { label: 'TOTAL RUNS', value: fmt(summary.total_runs), color: '#FFC857' },
    { label: 'WICKETS',  value: fmt(summary.total_wickets), color: '#A855F7' },
    { label: 'HIGH SCORE', value: String(summary.highest_team_score), color: '#FF4757' },
    { label: 'MOST RUNS', value: `${summary.most_runs_player} (${summary.most_runs_player_runs})`, color: '#00FF9C' },
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Video Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <SeamlessVideo src="/bg_video.mp4" />
      </div>

      {/* Overlay gradient */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(2,8,23,0.85) 0%, rgba(2,8,23,0.6) 45%, rgba(2,8,23,0.85) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom vignette overlay to hide bottom-right watermark "Veo" completely while keeping pristine video resolution */}
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 120,
        background: 'linear-gradient(to top, rgba(2,8,23,1) 0%, rgba(2,8,23,0.7) 50%, transparent 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '80px 24px 40px',
        textAlign: 'center',
      }}>
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div className="hero-pretitle-line" style={{ width: 60, height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(0,255,156,0.95))' }} />
            <span style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.3em',
              color: '#00FF9C',
              fontWeight: 700,
              textShadow: '0 0 10px rgba(0,255,156,0.7), 0 2px 4px rgba(0,0,0,0.95)',
              whiteSpace: 'nowrap'
            }}>
              AI · ANALYTICS · IPL
            </span>
            <div className="hero-pretitle-line" style={{ width: 60, height: 1.5, background: 'linear-gradient(90deg, rgba(0,255,156,0.95), transparent)' }} />
          </div>

          <h1 className="font-display" style={{
            fontSize: 'clamp(60px, 12vw, 120px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: 24,
            color: '#fff',
            textShadow: '0 6px 30px rgba(2,8,23,0.95), 0 0 80px rgba(0,255,156,0.5)',
          }}>
            CRIC<span className="neon-green" style={{
              textShadow: '0 0 15px rgba(0,255,156,0.9), 0 0 30px rgba(0,255,156,0.6), 0 4px 12px rgba(2,8,23,0.95)'
            }}>MIND</span>
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 2.5vw, 20px)',
            color: '#ffffff',
            letterSpacing: '0.3em',
            marginBottom: 12,
            fontWeight: 600,
            textShadow: '0 4px 12px rgba(2,8,23,0.95), 0 0 20px rgba(2,8,23,0.9)'
          }}>
            WHERE CRICKET MEETS INTELLIGENCE
          </p>
          <p style={{
            fontSize: 13,
            color: '#00C2FF',
            letterSpacing: '0.2em',
            marginBottom: 64,
            fontWeight: 600,
            textShadow: '0 3px 8px rgba(2,8,23,0.95), 0 0 12px rgba(0,194,255,0.6)'
          }}>
            1226 IPL MATCHES · REAL DATA · 19 SEASONS
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hero-buttons"
        >
          <button className="btn-primary" onClick={() => { setPage('dashboard'); window.scrollTo(0,0); }}>
            ◈ ENTER ARENA
          </button>
          <button 
            className="btn-secondary" 
            style={{
              borderColor: '#00C2FF',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              color: '#00C2FF',
              background: 'rgba(2,8,23,0.82)'
            }}
            onClick={() => { setPage('cricai'); window.scrollTo(0,0); }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,194,255,0.12)'
              e.currentTarget.style.borderColor = '#00FF9C'
              e.currentTarget.style.color = '#00FF9C'
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0,194,255,0.35), 0 4px 20px rgba(0,0,0,0.4)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(2,8,23,0.82)'
              e.currentTarget.style.borderColor = '#00C2FF'
              e.currentTarget.style.color = '#00C2FF'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            ✦ CRICAI INSIGHTS
          </button>
          <button className="btn-secondary" onClick={() => { setPage('simulator'); window.scrollTo(0,0); }}>
            ⬟ MATCH SIMULATOR
          </button>
          <button
            style={{
              fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.15em',
              padding: '14px 32px', background: 'rgba(2,8,23,0.82)',
              border: '1.5px solid rgba(255,255,255,0.3)', color: '#ffffff',
              borderRadius: 10, cursor: 'pointer', transition: 'all 0.3s',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)',
            }}
            onClick={() => { setPage('players'); window.scrollTo(0,0); }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.borderColor = '#ffffff'
              e.currentTarget.style.boxShadow = '0 0 25px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.4)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(2,8,23,0.82)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            ◎ PLAYER LAB
          </button>
        </motion.div>

        {/* Stats ticker */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ width: '100%', maxWidth: 900 }}>
          <StatTicker stats={stats} />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.4 }}>
            <span style={{ fontSize: 9, fontFamily: 'var(--font-display)', letterSpacing: '0.2em', color: '#fff' }}>EXPLORE</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(0,255,156,0.8), transparent)' }} />
          </div>
        </motion.div>

        {/* Smooth transition to next section */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
          background: 'linear-gradient(to bottom, transparent, rgba(2,8,23,0.95))',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Feature cards below fold */}
      <div style={{ position: 'relative', zIndex: 2, background: 'rgba(2,8,23,0.95)' }}>
        <div className="container section">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <h2 className="font-display neon-green" style={{ fontSize: 32, marginBottom: 16 }}>
              THE FUTURE OF CRICKET ANALYTICS
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
              Every ball. Every run. Every wicket. CricMind processes the complete IPL dataset — 
              {summary.total_matches} matches across {summary.total_seasons} seasons — 
              to deliver cinematic intelligence on demand.
            </p>
          </motion.div>

          <div className="grid-3" style={{ marginBottom: 80 }}>
            {[
              { icon: '◈', title: 'LIVE DASHBOARD', desc: 'Real-time analytics across all metrics — runs, wickets, win rates, toss impact, phase analysis and more.', color: 'var(--neon-green)', page: 'dashboard' as Page },
              { icon: '◎', title: 'PLAYER LAB',     desc: `Deep dive into ${summary.most_runs_player} (${summary.most_runs_player_runs.toLocaleString()} runs) and 685 IPL legends with radar charts and career arcs.`, color: 'var(--neon-blue)', page: 'players' as Page },
              { icon: '⬟', title: 'MATCH SIMULATOR', desc: 'AI-powered match predictions based on historical H2H records, venue advantages and batting/bowling form.', color: 'var(--neon-gold)', page: 'simulator' as Page },
              { icon: '◆', title: 'TEAM INTEL',      desc: 'Full franchise analytics — win rates, titles, head-to-head rivalries, home/away splits and season trends.', color: 'var(--neon-purple)', page: 'teams' as Page },
              { icon: '◉', title: 'SEASON VAULT',    desc: '19 IPL seasons from 2008 to 2026. Track the evolution of run rates, boundary %s and team dynasties.', color: '#FF4757', page: 'seasons' as Page },
              { icon: '◇', title: 'MATCH CENTER',    desc: 'Browse all 1226 IPL matches with winner, venue, MOM and result details in one high-performance grid.', color: 'var(--neon-green)', page: 'matches' as Page },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass"
                style={{
                  padding: 28, cursor: 'pointer',
                  transition: 'all 0.3s',
                  borderColor: card.color.includes('green') ? 'rgba(0,255,156,0.2)' : 'rgba(255,255,255,0.08)',
                }}
                onClick={() => { setPage(card.page); window.scrollTo(0,0); }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.4)`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = ''
                  ;(e.currentTarget as HTMLElement).style.boxShadow = ''
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 16, color: card.color }}>{card.icon}</div>
                <h3 className="font-display" style={{ fontSize: 14, letterSpacing: '0.12em', color: card.color, marginBottom: 12 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent matches */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display" style={{ fontSize: 22, letterSpacing: '0.1em', color: '#fff', marginBottom: 24 }}>
              RECENT CLASHES
            </h2>
            <div className="hscroll" style={{ paddingBottom: 16 }}>
              {data.recent_matches.slice(0, 8).map((m, i) => (
                <div key={i} className="glass" style={{ minWidth: 260, padding: 20, flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{m.date}</span>
                    <span className="tag tag-green" style={{ fontSize: 10 }}>IPL {m.season}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: m.winner === m.team1 ? 'var(--neon-green)' : 'rgba(255,255,255,0.5)' }}>
                      {m.team1.split(' ').pop()}
                    </span>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>VS</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: m.winner === m.team2 ? 'var(--neon-green)' : 'rgba(255,255,255,0.5)' }}>
                      {m.team2.split(' ').pop()}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{m.winner}</span>
                    {m.win_by_runs    && <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: 6 }}>by {m.win_by_runs} runs</span>}
                    {m.win_by_wickets && <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: 6 }}>by {m.win_by_wickets} wkts</span>}
                  </div>
                  {m.mom && (
                    <div style={{ marginTop: 8, fontSize: 11, color: 'var(--neon-gold)' }}>★ {m.mom}</div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
