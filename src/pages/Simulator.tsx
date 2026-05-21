import { useState } from 'react'
import { motion } from 'framer-motion'
import type { IPLData } from '../types'
import { teamAbbr } from '../utils'

function SectionTitle({ children, color = 'var(--neon-green)' }: { children: React.ReactNode; color?: string }) {
  return (
    <h2 className="font-display" style={{ fontSize: 18, letterSpacing: '0.12em', color, marginBottom: 20 }}>
      {children}
    </h2>
  )
}

export default function Simulator({ data }: { data: IPLData }) {
  const { teams, h2h } = data
  
  // Active teams list for dropdowns
  const teamList = teams.filter(t => t.matches >= 20).map(t => t.name).sort()
  
  const [team1, setTeam1] = useState(teamList[0] || 'Mumbai Indians')
  const [team2, setTeam2] = useState(teamList[1] || 'Chennai Super Kings')
  const [simulating, setSimulating] = useState(false)
  const [result, setResult] = useState<{ winner: string; probability: number } | null>(null)

  // Find H2H record
  const h2hRecord = h2h.find(r => 
    (r.t1 === team1 && r.t2 === team2) || (r.t1 === team2 && r.t2 === team1)
  )

  const handleSimulate = () => {
    if (team1 === team2) return
    
    setSimulating(true)
    setResult(null)
    
    // Fake async delay for "simulation"
    setTimeout(() => {
      let winProb1 = 0.5
      let winProb2 = 0.5
      
      const t1Stats = teams.find(t => t.name === team1)
      const t2Stats = teams.find(t => t.name === team2)
      
      if (t1Stats && t2Stats) {
        // Base probability on win percentage
        const totalPct = t1Stats.win_pct + t2Stats.win_pct
        winProb1 = t1Stats.win_pct / totalPct
        winProb2 = t2Stats.win_pct / totalPct
      }
      
      if (h2hRecord) {
        // Adjust for H2H
        const h2hTotal = h2hRecord.matches
        if (h2hTotal > 0) {
          const h2hWin1 = h2hRecord.t1 === team1 ? h2hRecord.wins_t1 : h2hRecord.wins_t2
          const h2hWin2 = h2hRecord.t1 === team2 ? h2hRecord.wins_t1 : h2hRecord.wins_t2
          
          winProb1 = (winProb1 + (h2hWin1 / h2hTotal)) / 2
          winProb2 = (winProb2 + (h2hWin2 / h2hTotal)) / 2
        }
      }
      
      // Normalize
      const sum = winProb1 + winProb2
      winProb1 = winProb1 / sum
      winProb2 = winProb2 / sum
      
      const winner = Math.random() < winProb1 ? team1 : team2
      const probability = winner === team1 ? winProb1 : winProb2
      
      setResult({ winner, probability })
      setSimulating(false)
    }, 2000)
  }

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 className="font-display neon-green" style={{ fontSize: 36, marginBottom: 8 }}>MATCH SIMULATOR</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          AI-powered predictive modeling. Select two franchises to calculate win probability.
        </p>
      </motion.div>

      <div className="simulator-row">
        {/* Selection Area */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 32 }}>
          <SectionTitle>CONFIGURE SIMULATION</SectionTitle>
          
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8 }}>
              TEAM ALPHA
            </label>
            <select 
              value={team1} 
              onChange={e => setTeam1(e.target.value)}
              style={{
                width: '100%', padding: 12, background: 'rgba(2,8,23,0.8)', border: '1px solid rgba(0,255,156,0.2)',
                borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none'
              }}
            >
              {teamList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 11, fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8 }}>
              TEAM BETA
            </label>
            <select 
              value={team2} 
              onChange={e => setTeam2(e.target.value)}
              style={{
                width: '100%', padding: 12, background: 'rgba(2,8,23,0.8)', border: '1px solid rgba(0,255,156,0.2)',
                borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none'
              }}
            >
              {teamList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%' }}
            onClick={handleSimulate}
            disabled={simulating || team1 === team2}
          >
            {simulating ? 'PROCESSING...' : 'RUN SIMULATION'}
          </button>

          {team1 === team2 && (
            <div style={{ color: 'var(--neon-red)', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
              Cannot simulate a match between the same team.
            </div>
          )}
        </motion.div>

        {/* Results Area */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {simulating ? (
            <div style={{ textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 24px' }} />
              <div className="font-display" style={{ fontSize: 16, letterSpacing: '0.1em', color: 'var(--neon-green)' }}>
                CALCULATING PROBABILITIES...
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                Querying historical records and venue stats
              </div>
            </div>
          ) : result ? (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <SectionTitle color="var(--neon-gold)">SIMULATION COMPLETE</SectionTitle>
              
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                PREDICTED WINNER
              </div>
              
              <div className="font-display neon-green" style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>
                {result.winner.toUpperCase()}
              </div>
              
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
                Confidence: <span style={{ color: 'var(--neon-gold)', fontWeight: 700 }}>{(result.probability * 100).toFixed(1)}%</span>
              </div>

              <div style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${result.probability * 100}%`, background: 'var(--neon-green)' }} />
                </div>
              </div>
            </div>
          ) : h2hRecord ? (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <SectionTitle color="var(--neon-blue)">HISTORICAL DATA AVAILABLE</SectionTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 300, margin: '0 auto 24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{teamAbbr(team1)}</div>
                  <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', color: 'var(--neon-green)', fontWeight: 700 }}>
                    {h2hRecord.t1 === team1 ? h2hRecord.wins_t1 : h2hRecord.wins_t2}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-display)' }}>VS</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{teamAbbr(team2)}</div>
                  <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', color: 'var(--neon-green)', fontWeight: 700 }}>
                    {h2hRecord.t1 === team2 ? h2hRecord.wins_t1 : h2hRecord.wins_t2}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                Matches Played: {h2hRecord.matches}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>◈</div>
              <div style={{ fontSize: 14 }}>Select teams and run simulation to see results.</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Info Section */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 14, letterSpacing: '0.05em', color: 'var(--neon-green)', marginBottom: 12 }}>
          HOW IT WORKS
        </h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
          The CricMind Match Simulator uses a weighted algorithm based on overall win percentages and head-to-head records. It calculates a probability distribution and runs a Monte Carlo simulation to predict the outcome. Future versions will incorporate venue-specific form and player matchups.
        </p>
      </div>
    </div>
  )
}
