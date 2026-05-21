/**
 * CricMind3D - IPL Data Preprocessor
 * Processes all 1226 IPL match JSON files from Cricsheet
 * and outputs a single analytics JSON for the frontend.
 */

const fs = require('fs');
const path = require('path');

const IPL_DIR = path.join(__dirname, '..', 'ipl_json');
const OUT_FILE = path.join(__dirname, 'src', 'data', 'ipl_analytics.json');

console.log('📊 CricMind3D - IPL Data Preprocessor');
console.log('Reading match files from:', IPL_DIR);

const files = fs.readdirSync(IPL_DIR).filter(f => f.endsWith('.json'));
console.log(`Found ${files.length} match files`);

// --- Accumulators ---
const teamStats = {};   // team -> { wins, losses, matches, runs, titles, toss_wins }
const playerStats = {}; // player -> { runs, wickets, matches, fours, sixes, innings }
const venueStats = {};  // venue -> { matches, runs, city }
const seasonStats = {}; // season -> { matches, teams, top_scorer, winner }
const h2hStats = {};    // "teamA|teamB" -> { wins_a, wins_b, matches }
const recentMatches = [];
const tossData = { total: 0, toss_win_match_win: 0, bat_first_wins: 0, field_first_wins: 0, bat_first_matches: 0, field_first_matches: 0 };
const phaseData = {
  powerplay: { overs: [], runs: 0, wickets: 0, balls: 0, fours: 0, sixes: 0, dots: 0 },
  middle:    { overs: [], runs: 0, wickets: 0, balls: 0, fours: 0, sixes: 0, dots: 0 },
  death:     { overs: [], runs: 0, wickets: 0, balls: 0, fours: 0, sixes: 0, dots: 0 },
};

// Known IPL champions by season
const IPL_TITLES = {
  '2008': 'Rajasthan Royals',
  '2009': 'Deccan Chargers',
  '2010': 'Chennai Super Kings',
  '2011': 'Chennai Super Kings',
  '2012': 'Kolkata Knight Riders',
  '2013': 'Mumbai Indians',
  '2014': 'Kolkata Knight Riders',
  '2015': 'Mumbai Indians',
  '2016': 'Sunrisers Hyderabad',
  '2017': 'Mumbai Indians',
  '2018': 'Chennai Super Kings',
  '2019': 'Mumbai Indians',
  '2020': 'Mumbai Indians',
  '2021': 'Chennai Super Kings',
  '2022': 'Gujarat Titans',
  '2023': 'Chennai Super Kings',
  '2024': 'Kolkata Knight Riders',
  '2025': 'Punjab Kings',
};

// Normalise team names (handle renames)
function normaliseTeam(name) {
  const map = {
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
    'Kings XI Punjab': 'Punjab Kings',
    'Delhi Daredevils': 'Delhi Capitals',
    'Deccan Chargers': 'Deccan Chargers',
  };
  return map[name] || name;
}

function ensureTeam(t) {
  if (!teamStats[t]) teamStats[t] = { wins: 0, losses: 0, matches: 0, runs: 0, titles: 0, toss_wins: 0 };
}

function ensureVenue(v, city) {
  if (!venueStats[v]) venueStats[v] = { matches: 0, total_runs: 0, city: city || '' };
}

function ensurePlayer(name) {
  if (!playerStats[name]) playerStats[name] = {
    runs: 0, balls_faced: 0, wickets: 0, balls_bowled: 0, runs_conceded: 0,
    matches: new Set(), innings: 0, fours: 0, sixes: 0, catches: 0,
    mom: 0, fifties: 0, hundreds: 0, teams: new Set()
  };
}

function getPhase(over) {
  if (over < 6) return 'powerplay';
  if (over < 15) return 'middle';
  return 'death';
}

let totalRuns = 0, totalWickets = 0, highestScore = 0, highestScoreTeam = '';
let processedMatches = 0;

for (const file of files) {
  try {
    const raw = fs.readFileSync(path.join(IPL_DIR, file), 'utf8');
    const match = JSON.parse(raw);
    const info = match.info;
    if (!info || !info.teams || info.teams.length < 2) continue;

    const season = info.season || '';
    const date = info.dates ? info.dates[0] : '';
    const venue = info.venue || 'Unknown';
    const city = info.city || '';
    const teams = info.teams.map(normaliseTeam);
    const [t1, t2] = teams;
    const winner = info.outcome?.winner ? normaliseTeam(info.outcome.winner) : null;
    const tossWinner = info.toss?.winner ? normaliseTeam(info.toss.winner) : null;
    const tossDecision = info.toss?.decision;
    const mom = info.player_of_match || [];

    // Season stats
    if (!seasonStats[season]) seasonStats[season] = { matches: 0, teams: new Set(), total_runs: 0 };
    seasonStats[season].matches++;
    teams.forEach(t => seasonStats[season].teams.add(t));

    // Team stats
    teams.forEach(t => ensureTeam(t));
    if (winner) {
      ensureTeam(winner);
      teamStats[winner].wins++;
      const loser = teams.find(t => t !== winner);
      if (loser) { ensureTeam(loser); teamStats[loser].losses++; }
    }
    teams.forEach(t => { ensureTeam(t); teamStats[t].matches++; });

    // Toss
    if (tossWinner) {
      ensureTeam(tossWinner);
      teamStats[tossWinner].toss_wins++;
      tossData.total++;
      if (winner && tossWinner === winner) tossData.toss_win_match_win++;
      if (tossDecision === 'bat') {
        tossData.bat_first_matches++;
        if (winner && tossWinner === winner) tossData.bat_first_wins++;
      } else {
        tossData.field_first_matches++;
        if (winner && tossWinner === winner) tossData.field_first_wins++;
      }
    }

    // H2H
    if (teams.length === 2) {
      const key = [t1, t2].sort().join('|');
      if (!h2hStats[key]) h2hStats[key] = { t1: [t1,t2].sort()[0], t2: [t1,t2].sort()[1], wins_t1: 0, wins_t2: 0, matches: 0 };
      h2hStats[key].matches++;
      if (winner) {
        if (winner === h2hStats[key].t1) h2hStats[key].wins_t1++;
        else h2hStats[key].wins_t2++;
      }
    }

    // Venue
    ensureVenue(venue, city);
    venueStats[venue].matches++;

    // Players (from players field)
    const players = info.players || {};
    Object.entries(players).forEach(([team, roster]) => {
      const nt = normaliseTeam(team);
      roster.forEach(p => {
        ensurePlayer(p);
        playerStats[p].matches.add(file);
        playerStats[p].teams.add(nt);
      });
    });

    // MOM
    mom.forEach(p => { ensurePlayer(p); playerStats[p].mom++; });

    // Innings
    if (match.innings) {
      match.innings.forEach(inning => {
        let inningRuns = 0;
        let inningWickets = 0;
        const battingStats = {}; // player -> runs for this inning

        (inning.overs || []).forEach(overData => {
          const overNum = overData.over;
          const phase = getPhase(overNum);

          (overData.deliveries || []).forEach(delivery => {
            const batter = delivery.batter;
            const bowler = delivery.bowler;
            const runs = delivery.runs || {};
            const batterRuns = runs.batter || 0;
            const extras = runs.extras || 0;
            const total = runs.total || 0;

            // Phase stats
            phaseData[phase].runs += total;
            phaseData[phase].balls++;
            if (batterRuns === 0 && extras === 0) phaseData[phase].dots++;
            if (batterRuns === 4) phaseData[phase].fours++;
            if (batterRuns === 6) phaseData[phase].sixes++;

            // Total runs
            inningRuns += total;
            totalRuns += total;

            // Venue runs
            venueStats[venue].total_runs += total;
            seasonStats[season].total_runs += total;

            // Batter stats
            ensurePlayer(batter);
            playerStats[batter].runs += batterRuns;
            playerStats[batter].balls_faced++;
            if (batterRuns === 4) playerStats[batter].fours++;
            if (batterRuns === 6) playerStats[batter].sixes++;
            if (!battingStats[batter]) battingStats[batter] = 0;
            battingStats[batter] += batterRuns;

            // Bowler stats
            ensurePlayer(bowler);
            playerStats[bowler].balls_bowled++;
            playerStats[bowler].runs_conceded += total - (delivery.extras?.wides || 0) - (delivery.extras?.noballs || 0);

            // Wickets
            if (delivery.wickets) {
              delivery.wickets.forEach(w => {
                inningWickets++;
                totalWickets++;
                phaseData[phase].wickets++;
                // Fielder catches
                if (w.fielders) {
                  w.fielders.forEach(f => {
                    ensurePlayer(f.name || f);
                    playerStats[f.name || f].catches++;
                  });
                }
                // Bowler wicket (not run out / obstructing)
                const dismissal = w.kind;
                if (!['run out', 'obstructing the field', 'retired hurt', 'retired out', 'timed out'].includes(dismissal)) {
                  playerStats[bowler].wickets++;
                }
              });
            }
          });
        });

        // Inning totals
        if (inningRuns > highestScore) {
          highestScore = inningRuns;
          highestScoreTeam = normaliseTeam(inning.team || '');
        }

        // Batting innings for averages
        Object.entries(battingStats).forEach(([p, r]) => {
          ensurePlayer(p);
          playerStats[p].innings++;
          if (r >= 50 && r < 100) playerStats[p].fifties++;
          if (r >= 100) playerStats[p].hundreds++;
        });

        // Team runs
        const battingTeam = normaliseTeam(inning.team || '');
        if (battingTeam) {
          ensureTeam(battingTeam);
          teamStats[battingTeam].runs += inningRuns;
        }
      });
    }

    // Recent matches (store raw info for display)
    recentMatches.push({
      id: file.replace('.json', ''),
      date,
      season,
      team1: t1,
      team2: t2,
      winner: winner || 'No Result',
      venue: city || venue.split(',').pop()?.trim() || venue,
      full_venue: venue,
      win_by_runs: info.outcome?.by?.runs,
      win_by_wickets: info.outcome?.by?.wickets,
      mom: mom[0] || null,
    });

    processedMatches++;
    if (processedMatches % 100 === 0) console.log(`  Processed ${processedMatches}/${files.length} matches...`);

  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
}

console.log(`✅ Processed ${processedMatches} matches`);

// --- Apply known titles ---
Object.entries(IPL_TITLES).forEach(([season, team]) => {
  const nt = normaliseTeam(team);
  ensureTeam(nt);
  teamStats[nt].titles++;
});

// --- Build output ---

// Top players by runs
const playerList = Object.entries(playerStats).map(([name, s]) => ({
  name,
  runs: s.runs,
  wickets: s.wickets,
  matches: s.matches.size,
  innings: s.innings,
  balls_faced: s.balls_faced,
  balls_bowled: s.balls_bowled,
  runs_conceded: s.runs_conceded,
  fours: s.fours,
  sixes: s.sixes,
  catches: s.catches,
  mom: s.mom,
  fifties: s.fifties,
  hundreds: s.hundreds,
  teams: Array.from(s.teams),
  strike_rate: s.balls_faced > 0 ? +((s.runs / s.balls_faced) * 100).toFixed(1) : 0,
  average: s.innings > 0 ? +(s.runs / s.innings).toFixed(1) : 0,
  economy: s.balls_bowled > 0 ? +((s.runs_conceded / s.balls_bowled) * 6).toFixed(2) : 0,
  bowling_avg: s.wickets > 0 ? +(s.runs_conceded / s.wickets).toFixed(1) : 0,
})).filter(p => p.matches >= 3);

// Sort by runs for batters ranking
const topBatters = [...playerList].filter(p => p.runs > 0).sort((a,b) => b.runs - a.runs).slice(0, 50);
const topBowlers = [...playerList].filter(p => p.wickets > 0).sort((a,b) => b.wickets - a.wickets).slice(0, 50);
const topAllrounders = [...playerList].filter(p => p.runs > 100 && p.wickets > 20).sort((a,b) => (b.runs + b.wickets*20) - (a.runs + a.wickets*20)).slice(0, 20);

// Team list
const teamList = Object.entries(teamStats).map(([name, s]) => ({
  name,
  wins: s.wins,
  losses: s.losses,
  matches: s.matches,
  win_pct: s.matches > 0 ? +((s.wins / s.matches) * 100).toFixed(1) : 0,
  titles: s.titles,
  toss_wins: s.toss_wins,
  runs: s.runs,
})).sort((a,b) => b.wins - a.wins);

// Venue list
const venueList = Object.entries(venueStats).map(([v, s]) => ({
  venue: v,
  city: s.city,
  matches: s.matches,
  avg_score: s.matches > 0 ? +(s.total_runs / (s.matches * 2)).toFixed(0) : 0,
})).sort((a,b) => b.matches - a.matches).slice(0, 20);

// Season list
const seasonList = Object.entries(seasonStats).map(([season, s]) => ({
  season,
  matches: s.matches,
  teams: s.teams.size,
  total_runs: s.total_runs,
  avg_score: s.matches > 0 ? +(s.total_runs / (s.matches * 2)).toFixed(0) : 0,
  champion: IPL_TITLES[season] || null,
})).sort((a,b) => a.season.localeCompare(b.season));

// Phase analysis
function buildPhase(phase) {
  const d = phaseData[phase];
  return {
    run_rate: d.balls > 0 ? +((d.runs / d.balls) * 6).toFixed(2) : 0,
    avg_runs: d.balls > 0 ? +(d.runs / (d.balls / 6)).toFixed(1) : 0,
    boundary_percent: d.balls > 0 ? +(((d.fours + d.sixes) / d.balls) * 100).toFixed(1) : 0,
    dot_ball_percent: d.balls > 0 ? +((d.dots / d.balls) * 100).toFixed(1) : 0,
    avg_wickets: d.balls > 0 ? +(d.wickets / (processedMatches * 2) * 6).toFixed(2) : 0,
    total_runs: d.runs,
    total_wickets: d.wickets,
    total_balls: d.balls,
    fours: d.fours,
    sixes: d.sixes,
  };
}

// Toss analysis
const tossAnalysis = {
  total: tossData.total,
  toss_win_match_win_percent: tossData.total > 0 ? +((tossData.toss_win_match_win / tossData.total) * 100).toFixed(1) : 0,
  bat_first_win_percent: tossData.bat_first_matches > 0 ? +((tossData.bat_first_wins / tossData.bat_first_matches) * 100).toFixed(1) : 0,
  field_first_win_percent: tossData.field_first_matches > 0 ? +((tossData.field_first_wins / tossData.field_first_matches) * 100).toFixed(1) : 0,
};

// Recent matches sorted by date desc
recentMatches.sort((a,b) => b.date.localeCompare(a.date));

// Dashboard summary
const mostRunsPlayer = topBatters[0];
const mostWicketsPlayer = topBowlers[0];
const mostTitlesTeam = [...teamList].sort((a,b) => b.titles - a.titles)[0];

const summary = {
  total_matches: processedMatches,
  total_seasons: Object.keys(seasonStats).length,
  total_runs: totalRuns,
  total_wickets: totalWickets,
  highest_team_score: highestScore,
  highest_team_score_team: highestScoreTeam,
  most_runs_player: mostRunsPlayer?.name || 'V Kohli',
  most_runs_player_runs: mostRunsPlayer?.runs || 0,
  most_wickets_player: mostWicketsPlayer?.name || 'Y Chahal',
  most_wickets_player_wickets: mostWicketsPlayer?.wickets || 0,
  most_titles_team: mostTitlesTeam?.name || 'MI / CSK',
  most_titles: mostTitlesTeam?.titles || 0,
  recent_matches: recentMatches.slice(0, 10),
};

// H2H list
const h2hList = Object.values(h2hStats).sort((a,b) => b.matches - a.matches).slice(0, 50);

// Sixes kings
const sixesKings = [...playerList].filter(p => p.sixes > 0).sort((a,b) => b.sixes - a.sixes).slice(0, 20);

// Output
const output = {
  generated: new Date().toISOString(),
  summary,
  teams: teamList,
  venues: venueList,
  seasons: seasonList,
  top_batters: topBatters,
  top_bowlers: topBowlers,
  top_allrounders: topAllrounders,
  sixes_kings: sixesKings,
  toss_analysis: tossAnalysis,
  phase_analysis: {
    powerplay: buildPhase('powerplay'),
    middle: buildPhase('middle'),
    death: buildPhase('death'),
  },
  h2h: h2hList,
  recent_matches: recentMatches,
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));

console.log(`\n✅ Analytics written to: ${OUT_FILE}`);
console.log(`📈 Summary:`);
console.log(`   Total matches: ${processedMatches}`);
console.log(`   Total runs: ${totalRuns.toLocaleString()}`);
console.log(`   Total wickets: ${totalWickets.toLocaleString()}`);
console.log(`   Highest score: ${highestScore} (${highestScoreTeam})`);
console.log(`   Most runs: ${mostRunsPlayer?.name} (${mostRunsPlayer?.runs})`);
console.log(`   Most wickets: ${mostWicketsPlayer?.name} (${mostWicketsPlayer?.wickets})`);
console.log(`   Teams tracked: ${teamList.length}`);
console.log(`   Players tracked: ${playerList.length}`);
