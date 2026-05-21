import { useState } from 'react'
import { motion } from 'framer-motion'
import type { IPLData, RecentMatch } from '../types'
import { teamAbbr, teamColor } from '../utils'

function MatchCard({ match, delay }: { match: RecentMatch; delay: number }) {
  const winByRuns = match.win_by_runs
  const winByWickets = match.win_by_wickets
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.03 }}
      className="glass"
      style={{ padding: 20, position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 11 }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-display)' }}>{match.date}</span>
        <span className="tag tag-green">IPL {match.season}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: teamColor(match.team1) }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: match.winner === match.team1 ? 'var(--neon-green)' : '#fff' }}>
            {teamAbbr(match.team1)}
          </span>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-display)', margin: '0 10px' }}>VS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: match.winner === match.team2 ? 'var(--neon-green)' : '#fff' }}>
            {teamAbbr(match.team2)}
          </span>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: teamColor(match.team2) }} />
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
        <div style={{ marginBottom: 4 }}>
          Winner: <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>{match.winner}</span>
          {winByRuns && <span style={{ color: 'rgba(255,255,255,0.4)' }}> by {winByRuns} runs</span>}
          {winByWickets && <span style={{ color: 'rgba(255,255,255,0.4)' }}> by {winByWickets} wickets</span>}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{match.venue}</span>
          {match.mom && <span style={{ color: 'var(--neon-gold)' }}>★ {match.mom}</span>}
        </div>
      </div>
    </motion.div>
  )
}

export default function Matches({ data }: { data: IPLData }) {
  const [seasonFilter, setSeasonFilter] = useState<string>('All')
  const { recent_matches } = data

  // Extract unique seasons for filter
  const seasons = ['All', ...Array.from(new Set(recent_matches.map(m => m.season))).sort().reverse()]

  const filteredMatches = seasonFilter === 'All' 
    ? recent_matches 
    : recent_matches.filter(m => m.season === seasonFilter)

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 className="font-display neon-green" style={{ fontSize: 36, marginBottom: 8 }}>MATCH CENTER</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          Browse the history of IPL clashes. Filter by season to see specific records.
        </p>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
        {seasons.map(s => (
          <button
            key={s}
            className={`tab-btn ${seasonFilter === s ? 'active' : ''}`}
            onClick={() => setSeasonFilter(s)}
          >
            {s === 'All' ? 'ALL SEASONS' : `IPL ${s}`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid-3">
        {filteredMatches.map((match, i) => (
          <MatchCard key={match.id} match={match} delay={i} />
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '40px 0' }}>
          No matches found for this season.
        </div>
      )}
    </div>
  )
}
