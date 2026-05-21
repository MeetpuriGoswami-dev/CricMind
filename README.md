# 🏏 CricMind — Interactive IPL Cricket Intelligence & Simulator

CricMind is a premium, offline-first IPL Cricket Analytics and Simulator platform. Built using **React 19, TypeScript, Recharts, and Framer Motion**, it allows users to instantly explore a comprehensive dataset of 1,226 matches across 19 seasons (2008–2026) with zero external server dependencies.

---

## 🔒 Security & Privacy Guarantee

CricMind is engineered with a **fully offline, safety-first architecture**:
* **Zero External Calls:** The entire application runs directly inside your browser sandbox. It does not fetch external APIs or communicate with any cloud services (no tracking, no telemetry).
* **No Hardcoded Keys or Secrets:** There are no API keys, cloud tokens, database credentials, or AI endpoints embedded in the frontend.
* **Git Safe:** Strict `.gitignore` rules are configured to keep local environment files (`.env`) completely hidden from GitHub.
* **100% Permissive Licensing:** The application is built entirely on free, open-source resources with permissive licenses (MIT, Apache-2.0, ISC).

---

## 🌟 Actual Implemented Features

* **🏟️ Premium Glassmorphism Home:** An immersive dashboard landing page featuring a seamless, infinitely-looping background video with vignette shadows, real-time all-time tournament counters, and direct arena shortcuts.
* **📊 Analytics Command Center (`Dashboard`):** Full-featured statistics center displaying:
  * **Toss Impact Analysis:** Interactive charting detailing why winning the toss has a 50/50 win-split.
  * **All-Time Leaders:** Interactive lists tracking Orange Cap, Purple Cap, most titles, and highest runs.
  * **Inning Phase Radar Analysis:** Advanced polar grids analyzing dot ball ratios, run rates, boundaries, and wickets across the *Powerplay*, *Middle Overs*, and *Death Overs*.
  * **Interactive Season Trends:** Interactive area charting tracking average scores and match densities over 19 years.
  * **Franchise comparison charts:** Visualizing franchise win percentages (min. 30 matches played).
* **🧠 Interactive CricAI Bot (`CricAI`):** A custom-engineered, offline statistical query processor. You can type natural questions directly into the chat and get real-time database outputs for:
  * **Direct Head-to-Head (H2H):** Matchups like `csk vs mi`, `rcb vs srh`, etc.
  * **Individual Player Labs:** Career data scans for players (e.g., Virat Kohli, Dhoni, Chahal).
  * **Historical champions:** Lookups for season winners (e.g., "IPL 2024 winner").
  * **Strategic breakdowns:** Detailed analyses of toss advantages, pitch dynamics, or batting venues.
* **⬟ Match Predictor (`Simulator`):** A probability-weighted predictive simulator. Select any two franchises to run a Monte Carlo simulated outcome based on head-to-head records and historical win margins.
* **🏆 Player, Team, Match, and Season Labs:** Dedicated pages providing tabular search indexes and filters to query details on all 1,226 individual matches, 680+ players, and historical team seasons.

---

## 🛠️ Tech Stack

* **Framework:** React 19 & TypeScript (Vite 8 build tooling)
* **Charts & Visualizations:** Recharts (Area, Bar, Radar, and Polar Angle charts)
* **Animations:** Framer Motion (page slides, keyframe tickers, and glassmorphic card floaters)
* **Icons:** Lucide React
* **Video rendering:** HTML5 looping canvas video component
* **Styling:** Custom Vanilla CSS with responsive design layout parameters

---

## 🚀 Local Installation

Run the project locally in less than a minute:

### 1. Prerequisites
Make sure [Node.js](https://nodejs.org/) is installed on your computer.

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/MeetpuriGoswami-dev/CricMind.git

# Enter the project directory
cd CricMind

# Install dependencies
npm install
```

### 3. Run
Start the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build
To bundle the project into optimized static files ready for free hosting (GitHub Pages, Netlify, Vercel):
```bash
npm run build
```

---

## 📄 License

This project is licensed under the **MIT License**. Use it, tweak it, and share it as you wish!
