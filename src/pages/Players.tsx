import { useState } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import type { IPLData, PlayerStat } from '../types'

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(2,8,23,0.95)',
  border: '1px solid rgba(0,255,156,0.2)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
}

function SectionTitle({ children, color = 'var(--neon-green)' }: { children: React.ReactNode; color?: string }) {
  return (
    <h2 className="font-display" style={{ fontSize: 18, letterSpacing: '0.12em', color, marginBottom: 20 }}>
      {children}
    </h2>
  )
}

function PlayerCard({ player, rank, type }: { player: PlayerStat; rank: number; type: 'batter' | 'bowler' }) {
  const isBatter = type === 'batter'
  const primaryColor = isBatter ? 'var(--neon-green)' : 'var(--neon-blue)'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="glass"
      style={{ padding: 20, position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className={`rank-badge ${rank <= 3 ? `rank-${rank}` : 'rank-other'}`}>
          {rank}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-display)' }}>
          {player.matches} MATCHES
        </div>
      </div>
      
      <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {player.name}
      </h3>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {player.teams.slice(0, 2).map((t, i) => (
          <span key={i} style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>
            {t.split(' ').pop()}
          </span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
            {isBatter ? 'RUNS' : 'WICKETS'}
          </div>
          <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', color: primaryColor, fontWeight: 700 }}>
            {isBatter ? player.runs.toLocaleString() : player.wickets}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
            {isBatter ? 'STRIKE RATE' : 'ECONOMY'}
          </div>
          <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', color: 'var(--neon-gold)', fontWeight: 700 }}>
            {isBatter ? player.strike_rate.toFixed(1) : player.economy.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
        <span>Avg: {isBatter ? player.average.toFixed(1) : player.bowling_avg.toFixed(1)}</span>
        <span>{isBatter ? `100s: ${player.hundreds}` : `Fours: ${player.fours}`}</span>
      </div>
    </motion.div>
  )
}

export default function Players({ data }: { data: IPLData }) {
  const [tab, setTab] = useState<'batters' | 'bowlers' | 'sixes'>('batters')
  const { top_batters, top_bowlers, sixes_kings } = data

  const currentList = tab === 'batters' ? top_batters : tab === 'bowlers' ? top_bowlers : sixes_kings
  const type = tab === 'bowlers' ? 'bowler' : 'batter'

  // Radar data for top player comparison (first in each list)
  const topBatter = top_batters[0]
  const topBowler = top_bowlers[0]

  const radarData = [
    { subject: 'Runs (scaled)', A: (topBatter.runs / 10000) * 100, B: 0 },
    { subject: 'SR (scaled)', A: (topBatter.strike_rate / 200) * 100, B: 0 },
    { subject: 'Avg (scaled)', A: (topBatter.average / 50) * 100, B: 0 },
    { subject: 'Wickets (scaled)', A: 0, B: (topBowler.wickets / 250) * 100 },
    { subject: 'Econ (scaled inv)', A: 0, B: ((10 - topBowler.economy) / 10) * 100 },
    { subject: 'Matches (scaled)', A: (topBatter.matches / 300) * 100, B: (topBowler.matches / 300) * 100 },
  ]

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 className="font-display neon-green" style={{ fontSize: 36, marginBottom: 8 }}>PLAYER LAB</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          Deep dive into the legends of the IPL. Performance analysis and rankings.
        </p>
      </motion.div>

      {/* Comparison Row */}
      <div className="comparison-row">
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 24 }}>
          <SectionTitle>TITANS COMPARISON</SectionTitle>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
            Comparing <span style={{ color: 'var(--neon-green)' }}>{topBatter.name}</span> (Top Runs) vs <span style={{ color: 'var(--neon-blue)' }}>{topBowler.name}</span> (Top Wickets)
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} />
                <Radar name={topBatter.name} dataKey="A" stroke="var(--neon-green)" fill="var(--neon-green)" fillOpacity={0.15} />
                <Radar name={topBowler.name} dataKey="B" stroke="var(--neon-blue)" fill="var(--neon-blue)" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart for top scorers */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 24 }}>
          <SectionTitle color="var(--neon-blue)">TOP RUN SCORERS ALL TIME</SectionTitle>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top_batters.slice(0, 10)} layout="vertical" barSize={16}>
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [parseFloat(v).toLocaleString(), 'Runs']} />
                <Bar dataKey="runs" fill="var(--neon-green)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button className={`tab-btn ${tab === 'batters' ? 'active' : ''}`} onClick={() => setTab('batters')}>TOP BATTERS</button>
        <button className={`tab-btn ${tab === 'bowlers' ? 'active' : ''}`} onClick={() => setTab('bowlers')}>TOP BOWLERS</button>
        <button className={`tab-btn ${tab === 'sixes' ? 'active' : ''}`} onClick={() => setTab('sixes')}>SIXES KINGS</button>
      </div>

      {/* Grid */}
      <div className="grid-4">
        {currentList.slice(0, 20).map((player, i) => (
          <PlayerCard key={player.name} player={player} rank={i + 1} type={type} />
        ))}
      </div>
    </div>
  )
}
