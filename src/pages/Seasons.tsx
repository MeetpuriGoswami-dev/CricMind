import React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import type { IPLData, SeasonStat } from '../types'
import { teamAbbr, fmt } from '../utils'

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

function SeasonCard({ season, rank }: { season: SeasonStat; rank: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="glass"
      style={{ padding: 24, position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 className="font-display" style={{ fontSize: 18, color: 'var(--neon-green)', letterSpacing: '0.05em' }}>
          IPL {season.season}
        </h3>
        <span className="tag tag-blue">{season.matches} Matches</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>AVG SCORE</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: '#fff', fontWeight: 700 }}>{season.avg_score}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>TEAMS</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: '#fff', fontWeight: 700 }}>{season.teams}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
        <span>Total Runs: {fmt(season.total_runs)}</span>
        {season.champion ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--neon-gold)' }}>★</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{teamAbbr(season.champion)}</span>
          </div>
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>No Champion</span>
        )}
      </div>
    </motion.div>
  )
}

export default function Seasons({ data }: { data: IPLData }) {
  const { seasons } = data

  // Data for charts
  const chartData = seasons.map(s => ({
    name: s.season,
    avg: s.avg_score,
    matches: s.matches,
    runs: s.total_runs / 1000 // In thousands
  }))

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 className="font-display neon-green" style={{ fontSize: 36, marginBottom: 8 }}>SEASON VAULT</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          Track the evolution of the IPL from 2008 to 2026. Champions and scoring trends.
        </p>
      </motion.div>

      {/* Trends Row */}
      <div className="simulator-row">
        {/* Line Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 24 }}>
          <SectionTitle color="var(--neon-blue)">SCORING TRENDS (AVG SCORE)</SectionTitle>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[130, 200]} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [v, 'Avg Score']} />
                <Line type="monotone" dataKey="avg" stroke="var(--neon-blue)" strokeWidth={2} dot={{ r: 4, fill: 'var(--neon-blue)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 24 }}>
          <SectionTitle color="var(--neon-gold)">TOTAL RUNS (IN THOUSANDS)</SectionTitle>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={16}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${(parseFloat(v) * 1000).toLocaleString()}`, 'Runs']} />
                <Bar dataKey="runs" fill="var(--neon-gold)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Grid */}
      <SectionTitle>ALL SEASONS</SectionTitle>
      <div className="grid-4">
        {[...seasons].reverse().map((season, i) => (
          <SeasonCard key={season.season} season={season} rank={i} />
        ))}
      </div>
    </div>
  )
}
