// Type definitions for IPL analytics data

export interface Summary {
  total_matches: number
  total_seasons: number
  total_runs: number
  total_wickets: number
  highest_team_score: number
  highest_team_score_team: string
  most_runs_player: string
  most_runs_player_runs: number
  most_wickets_player: string
  most_wickets_player_wickets: number
  most_titles_team: string
  most_titles: number
  recent_matches: RecentMatch[]
}

export interface RecentMatch {
  id: string
  date: string
  season: string
  team1: string
  team2: string
  winner: string
  venue: string
  full_venue: string
  win_by_runs?: number
  win_by_wickets?: number
  mom?: string
}

export interface TeamStat {
  name: string
  wins: number
  losses: number
  matches: number
  win_pct: number
  titles: number
  toss_wins: number
  runs: number
}

export interface VenueStat {
  venue: string
  city: string
  matches: number
  avg_score: number
}

export interface SeasonStat {
  season: string
  matches: number
  teams: number
  total_runs: number
  avg_score: number
  champion: string | null
}

export interface PlayerStat {
  name: string
  runs: number
  wickets: number
  matches: number
  innings: number
  balls_faced: number
  balls_bowled: number
  runs_conceded: number
  fours: number
  sixes: number
  catches: number
  mom: number
  fifties: number
  hundreds: number
  teams: string[]
  strike_rate: number
  average: number
  economy: number
  bowling_avg: number
}

export interface PhaseStats {
  run_rate: number
  avg_runs: number
  boundary_percent: number
  dot_ball_percent: number
  avg_wickets: number
  total_runs: number
  total_wickets: number
  total_balls: number
  fours: number
  sixes: number
}

export interface TossAnalysis {
  total: number
  toss_win_match_win_percent: number
  bat_first_win_percent: number
  field_first_win_percent: number
}

export interface H2HRecord {
  t1: string
  t2: string
  wins_t1: number
  wins_t2: number
  matches: number
}

export interface IPLData {
  generated: string
  summary: Summary
  teams: TeamStat[]
  venues: VenueStat[]
  seasons: SeasonStat[]
  top_batters: PlayerStat[]
  top_bowlers: PlayerStat[]
  top_allrounders: PlayerStat[]
  sixes_kings: PlayerStat[]
  toss_analysis: TossAnalysis
  phase_analysis: {
    powerplay: PhaseStats
    middle: PhaseStats
    death: PhaseStats
  }
  h2h: H2HRecord[]
  recent_matches: RecentMatch[]
}
