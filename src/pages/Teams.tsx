import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import type { IPLData, TeamStat } from '../types'
import { teamColor, teamAbbr, fmt } from '../utils'

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

function TeamCard({ team, rank }: { team: TeamStat; rank: number }) {
  const color = teamColor(team.name)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="glass"
      style={{ padding: 24, position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: color }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6, background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontFamily: 'var(--font-display)', color: '#fff', fontWeight: 700
          }}>
            {teamAbbr(team.name)}
          </div>
          <div>
            <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700 }}>{team.name}</h3>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{team.matches} Matches</div>
          </div>
        </div>
        {team.titles > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--neon-gold)' }}>
            <span style={{ fontSize: 14 }}>★</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 700 }}>{team.titles}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>WINS</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--neon-green)', fontWeight: 700 }}>{team.wins}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>LOSSES</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--neon-red)', fontWeight: 700 }}>{team.losses}</div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
          <span>Win Rate</span>
          <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>{team.win_pct.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${team.win_pct}%`, background: `linear-gradient(90deg, ${color}, var(--neon-green))` }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
        <span>Toss Wins: {team.toss_wins}</span>
        <span>Runs: {fmt(team.runs)}</span>
      </div>
    </motion.div>
  )
}

export default function Teams({ data }: { data: IPLData }) {
  const { teams, h2h } = data

  // Filter out teams with very few matches if any
  const activeTeams = [...teams].filter(t => t.matches >= 10).sort((a,b) => b.win_pct - a.win_pct)

  // Data for titles chart
  const titleData = teams.filter(t => t.titles > 0).map(t => ({
    name: teamAbbr(t.name),
    value: t.titles,
    color: teamColor(t.name)
  })).sort((a,b) => b.value - a.value)

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 className="font-display neon-green" style={{ fontSize: 36, marginBottom: 8 }}>FRANCHISE INTELLIGENCE</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          Performance metrics and dynasty tracking for all IPL teams.
        </p>
      </motion.div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Win % Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 24 }}>
          <SectionTitle color="var(--neon-blue)">WIN PERCENTAGE (MIN 10 MATCHES)</SectionTitle>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeTeams} barSize={24}>
                <XAxis dataKey="name" tickFormatter={n => teamAbbr(n)} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'var(--font-display)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 70]} unit="%" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${parseFloat(v).toFixed(1)}%`, 'Win Rate']} />
                <Bar dataKey="win_pct" radius={[4, 4, 0, 0]}>
                  {activeTeams.map((t, i) => <Cell key={i} fill={teamColor(t.name)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Titles Pie Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 24 }}>
          <SectionTitle color="var(--neon-gold)">CHAMPIONS (TITLES)</SectionTitle>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={titleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  label={({ cx, cy, midAngle, outerRadius, value, name }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = (outerRadius || 70) + 15;
                    const angle = midAngle || 0;
                    const x = cx + radius * Math.cos(-angle * RADIAN);
                    const y = cy + radius * Math.sin(-angle * RADIAN);
                    return (
                      <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontFamily="var(--font-display)">
                        {`${name} (${value})`}
                      </text>
                    );
                  }}
                  labelLine={true}
                >
                  {titleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* H2H Highlights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <SectionTitle>HEAD-TO-HEAD RIVALRIES (TOP CLASHES)</SectionTitle>
        <div className="hscroll">
          {h2h.slice(0, 10).map((record, i) => (
            <div key={i} className="glass" style={{ minWidth: 260, padding: 16, flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{teamAbbr(record.t1)}</div>
                  <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--neon-green)', fontWeight: 700 }}>{record.wins_t1}</div>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-display)', margin: '0 10px' }}>VS</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{teamAbbr(record.t2)}</div>
                  <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--neon-green)', fontWeight: 700 }}>{record.wins_t2}</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                Total Matches: {record.matches}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <SectionTitle>ALL FRANCHISES</SectionTitle>
      <div className="grid-3">
        {teams.map((team, i) => (
          <TeamCard key={team.name} team={team} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}
