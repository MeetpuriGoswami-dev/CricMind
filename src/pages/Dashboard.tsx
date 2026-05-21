import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  AreaChart, Area,
} from 'recharts'
import type { IPLData } from '../types'
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

function StatCard({ title, value, sub, color = 'var(--neon-green)', delay = 0 }: {
  title: string; value: string; sub?: string; color?: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="glass"
      style={{ padding: 24 }}
    >
      <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ fontSize: 36, fontFamily: 'var(--font-display)', color, fontWeight: 700, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>{sub}</div>}
    </motion.div>
  )
}

export default function Dashboard({ data }: { data: IPLData }) {
  const { summary, toss_analysis: toss, phase_analysis: phases, venues, teams, seasons } = data

  // Toss data for bar chart
  const tossChartData = [
    { name: 'BAT FIRST WIN %', value: toss.bat_first_win_percent, color: '#00FF9C' },
    { name: 'FIELD FIRST WIN %', value: toss.field_first_win_percent, color: '#00C2FF' },
  ]

  // Season run trends
  const seasonTrend = seasons.map(s => ({
    season: s.season.slice(-2),
    avg: s.avg_score,
    matches: s.matches,
  }))

  // Top teams
  const topTeams = [...teams].filter(t => t.matches >= 30).sort((a,b) => b.win_pct - a.win_pct).slice(0, 8)

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 className="font-display neon-green" style={{ fontSize: 36, marginBottom: 8 }}>COMMAND CENTER</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          Real-time intelligence across {summary.total_matches} IPL matches · {summary.total_seasons} seasons · {summary.total_runs.toLocaleString()} runs
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 48 }}>
        <StatCard title="TOTAL MATCHES"  value={summary.total_matches.toLocaleString()} sub={`${summary.total_seasons} IPL Seasons`} color="var(--neon-green)" delay={0} />
        <StatCard title="TOTAL RUNS"     value={fmt(summary.total_runs)}   sub="All Time"      color="var(--neon-blue)"  delay={0.1} />
        <StatCard title="TOTAL WICKETS"  value={fmt(summary.total_wickets)} sub="All Time"     color="var(--neon-gold)"  delay={0.2} />
        <StatCard title="HIGHEST INNINGS" value={String(summary.highest_team_score)} sub={summary.highest_team_score_team} color="var(--neon-purple)" delay={0.3} />
      </div>

      {/* Row 2: Toss + All-Time Leaders */}
      <div className="charts-row">
        {/* Toss Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass" style={{ padding: 28 }}>
          <SectionTitle color="var(--neon-blue)">TOSS IMPACT ANALYSIS</SectionTitle>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tossChartData} layout="vertical" barSize={36}>
                <XAxis type="number" domain={[0, 70]} hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'var(--font-display)' }} width={145} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${parseFloat(v).toFixed(1)}%`, 'Win Rate']} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {tossChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            Teams winning the toss win <span style={{ color: '#fff', fontWeight: 600 }}>{toss.toss_win_match_win_percent}%</span> of matches
          </div>
        </motion.div>

        {/* All-time leaders */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass" style={{ padding: 28 }}>
          <SectionTitle>ALL TIME LEADERS</SectionTitle>
          {[
            { label: 'Most Runs',    value: summary.most_runs_player,    sub: `${summary.most_runs_player_runs.toLocaleString()} runs`, color: 'var(--neon-green)' },
            { label: 'Most Wickets', value: summary.most_wickets_player,  sub: `${summary.most_wickets_player_wickets} wickets`,        color: 'var(--neon-blue)' },
            { label: 'Most Titles',  value: summary.most_titles_team,     sub: `${summary.most_titles} IPL titles`,                    color: 'var(--neon-gold)' },
            { label: 'Highest Score', value: summary.highest_team_score_team, sub: `${summary.highest_team_score} runs`,              color: 'var(--neon-purple)' },
          ].map((item, i) => (
            <div key={i} className="stat-row">
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{item.value}</div>
              </div>
              <div style={{ fontSize: 13, color: item.color, fontWeight: 600 }}>{item.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Phase Analysis */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: 40 }}>
        <SectionTitle>PHASE ANALYSIS</SectionTitle>
        <div className="grid-3">
          {[
            { title: 'POWERPLAY', phase: phases.powerplay, color: '#00FF9C' },
            { title: 'MIDDLE OVERS', phase: phases.middle, color: '#00C2FF' },
            { title: 'DEATH OVERS', phase: phases.death, color: '#FFC857' },
          ].map((p, i) => (
            <div key={i} className="glass" style={{ padding: 24 }}>
              <h3 className="font-display" style={{ fontSize: 13, letterSpacing: '0.12em', color: p.color, marginBottom: 20, textAlign: 'center' }}>
                {p.title}
              </h3>
              <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Run Rate', value: p.phase.run_rate.toFixed(2) },
                  { label: 'Boundary %', value: `${p.phase.boundary_percent}%` },
                  { label: 'Dot Ball %', value: `${p.phase.dot_ball_percent}%` },
                  { label: 'Sixes', value: p.phase.sixes.toLocaleString() },
                ].map((s, j) => (
                  <div key={j} style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                    <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: p.color, fontWeight: 700 }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { subject: 'RR',  A: (p.phase.run_rate / 15) * 100 },
                    { subject: 'BND', A: p.phase.boundary_percent },
                    { subject: 'DOT', A: p.phase.dot_ball_percent },
                    { subject: 'WKT', A: Math.min((p.phase.avg_wickets || 0.5) * 20, 100) },
                    { subject: '6s',  A: Math.min(p.phase.sixes / 50, 100) },
                  ]}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                    <Radar dataKey="A" stroke={p.color} fill={p.color} fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Season Avg Score Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass" style={{ padding: 28, marginBottom: 40 }}>
        <SectionTitle color="var(--neon-blue)">SEASON RUN RATE EVOLUTION</SectionTitle>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={seasonTrend}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C2FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="season" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[120, 200]} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v} runs`, 'Avg Score']} />
              <Area type="monotone" dataKey="avg" stroke="#00C2FF" strokeWidth={2} fill="url(#areaGrad)" dot={{ r: 4, fill: '#00C2FF' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Teams by Win % */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass" style={{ padding: 28, marginBottom: 40 }}>
        <SectionTitle color="var(--neon-gold)">FRANCHISE WIN RATES (MIN 30 MATCHES)</SectionTitle>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topTeams} barSize={32}>
              <XAxis dataKey="name" tickFormatter={n => teamAbbr(n)} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'var(--font-display)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 80]} unit="%" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any, _: any, p: any) => [`${v}% (${p.payload.wins}W / ${p.payload.matches}M)`, 'Win Rate']} />
              <Bar dataKey="win_pct" radius={[4, 4, 0, 0]}>
                {topTeams.map((t, i) => <Cell key={i} fill={teamColor(t.name)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Venues */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <SectionTitle>TOP VENUES</SectionTitle>
        <div className="hscroll">
          {venues.slice(0, 10).map((v, i) => (
            <div key={i} className="glass" style={{ minWidth: 220, padding: 20, flexShrink: 0 }}>
              <div style={{ marginBottom: 4 }}>
                <div className="rank-badge" style={{ width: 'auto', padding: '2px 8px', borderRadius: 4, background: 'rgba(0,255,156,0.1)', color: 'var(--neon-green)', fontSize: 10, fontFamily: 'var(--font-display)', display: 'inline-block' }}>
                  #{i + 1}
                </div>
              </div>
              <h3 style={{ fontSize: 13, color: '#fff', fontWeight: 600, marginTop: 8, marginBottom: 4, lineHeight: 1.3 }}>{v.city || v.venue.split(',')[0]}</h3>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{v.venue.split(',')[0]}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>MATCHES</div>
                  <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--neon-blue)', fontWeight: 700 }}>{v.matches}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>AVG SCORE</div>
                  <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--neon-green)', fontWeight: 700 }}>{v.avg_score}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
