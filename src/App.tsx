import { useState } from 'react'
import rawData from './data/ipl_analytics.json'
import type { IPLData } from './types'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import Teams from './pages/Teams'
import Matches from './pages/Matches'
import Seasons from './pages/Seasons'
import Simulator from './pages/Simulator'
import CricAI from './pages/CricAI'

export type Page = 'home' | 'dashboard' | 'players' | 'teams' | 'matches' | 'seasons' | 'simulator' | 'cricai'

function App() {
  const data = rawData as unknown as IPLData
  const [page, setPage] = useState<Page>('home')

  return (
    <Layout page={page} setPage={setPage}>
      {page === 'home'      && <Home data={data} setPage={setPage} />}
      {page === 'dashboard' && <Dashboard data={data} />}
      {page === 'cricai'    && <CricAI data={data} />}
      {page === 'players'   && <Players data={data} />}
      {page === 'teams'     && <Teams data={data} />}
      {page === 'matches'   && <Matches data={data} />}
      {page === 'seasons'   && <Seasons data={data} />}
      {page === 'simulator' && <Simulator data={data} />}
    </Layout>
  )
}

export default App
