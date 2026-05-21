// Team color mapping for all IPL franchises
export const TEAM_COLORS: Record<string, string> = {
  'Mumbai Indians': '#004BA0',
  'Chennai Super Kings': '#F9CD05',
  'Royal Challengers Bengaluru': '#EC1C24',
  'Royal Challengers Bangalore': '#EC1C24',
  'Kolkata Knight Riders': '#3A225D',
  'Sunrisers Hyderabad': '#F7A721',
  'Delhi Capitals': '#00008B',
  'Delhi Daredevils': '#00008B',
  'Rajasthan Royals': '#2D52A0',
  'Punjab Kings': '#ED1B24',
  'Kings XI Punjab': '#ED1B24',
  'Gujarat Titans': '#0B4973',
  'Lucknow Super Giants': '#A72056',
  'Deccan Chargers': '#F5A623',
  'Kochi Tuskers Kerala': '#00A0AB',
  'Pune Warriors': '#1C4EA1',
  'Rising Pune Supergiant': '#6F2D91',
  'Rising Pune Supergiants': '#6F2D91',
  'Gujarat Lions': '#E85C0B',
}

export const TEAM_ABBR: Record<string, string> = {
  'Mumbai Indians': 'MI',
  'Chennai Super Kings': 'CSK',
  'Royal Challengers Bengaluru': 'RCB',
  'Royal Challengers Bangalore': 'RCB',
  'Kolkata Knight Riders': 'KKR',
  'Sunrisers Hyderabad': 'SRH',
  'Delhi Capitals': 'DC',
  'Delhi Daredevils': 'DD',
  'Rajasthan Royals': 'RR',
  'Punjab Kings': 'PBKS',
  'Kings XI Punjab': 'KXIP',
  'Gujarat Titans': 'GT',
  'Lucknow Super Giants': 'LSG',
  'Deccan Chargers': 'DCH',
  'Rising Pune Supergiant': 'RPS',
  'Rising Pune Supergiants': 'RPS',
  'Gujarat Lions': 'GL',
}

export function teamColor(name: string): string {
  return TEAM_COLORS[name] || '#444444'
}

export function teamAbbr(name: string): string {
  return TEAM_ABBR[name] || name.slice(0, 3).toUpperCase()
}

export function fmt(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toLocaleString()
}

export function pct(a: number, b: number): number {
  return b > 0 ? Math.round((a / b) * 100) : 0
}
