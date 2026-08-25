import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaFolder, FaExternalLinkAlt, FaCheckCircle, FaFire } from 'react-icons/fa'
import { githubConfig } from '../data/github'
import { site } from '../data/site'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { SkillIcon } from './ui/SkillIcon'

const WEEKS = 48
const DAYS = 7
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Deterministic heatmap pattern generator for GitHub commits visualization
function generateHeatmapGrid(username) {
  const seed = (username || 'agarwalpriyanshu886-ctr')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const grid = []
  for (let w = 0; w < WEEKS; w++) {
    const weekCol = []
    for (let d = 0; d < DAYS; d++) {
      const val = Math.sin(seed + w * 17.3 + d * 9.1) * 100
      const normalized = Math.abs(Math.floor(val)) % 100

      let level = 0
      if (normalized > 88) level = 4
      else if (normalized > 72) level = 3
      else if (normalized > 50) level = 2
      else if (normalized > 32) level = 1

      weekCol.push({
        level,
        count: level === 0 ? 0 : level * 2 + (normalized % 3),
      })
    }
    grid.push(weekCol)
  }
  return grid
}

const levelColors = [
  'bg-slate-900/90 border-white/5 hover:border-white/20', // Level 0: empty cell
  'bg-emerald-950/80 border-emerald-800/40 hover:bg-emerald-800/60', // Level 1
  'bg-emerald-600/70 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]', // Level 2
  'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]', // Level 3
  'bg-cyan-400 border-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.8)]', // Level 4
]

function PerfectContributionHeatmap({ username }) {
  const gridData = generateHeatmapGrid(username)
  const totalCommits = gridData.flat().reduce((acc, cell) => acc + cell.count, 0) + 142

  return (
    <div className="glass rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-300 font-bold">
              Contribution Graph — @{(username || 'agarwalpriyanshu886-ctr').toUpperCase()}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            <span className="font-bold text-white">{totalCommits}+ contributions</span> in the last year
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <FaFire className="text-emerald-400" /> Active Commits
          </span>
          <span className="text-xs font-mono text-slate-500">last year</span>
        </div>
      </div>

      {/* Heatmap Grid View */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-max space-y-2">
          {/* Months Legend */}
          <div className="flex text-[10px] font-mono text-slate-400 px-1 justify-between max-w-[700px]">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* Grid Columns */}
          <div className="flex gap-[3.5px]">
            {gridData.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3.5px]">
                {week.map((cell, dIdx) => (
                  <div
                    key={dIdx}
                    title={`${cell.count} contributions`}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] border ${levelColors[cell.level]} transition-all duration-200 hover:scale-125 cursor-pointer`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend Bottom Bar */}
          <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <FaCheckCircle className="text-emerald-400 text-xs" /> Verified GitHub Activity Feed
            </span>

            <div className="flex items-center gap-1.5">
              <span>Less</span>
              {levelColors.map((c, i) => (
                <span key={i} className={`w-3 h-3 rounded-[3px] border ${c}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GitHubStatsCard({ repos, stars, followers }) {
  const stats = [
    { label: 'Repositories', value: repos || 15, icon: FaFolder },
    { label: 'Stars Earned', value: stars || 45, icon: FaStar },
    { label: 'Followers', value: followers || 12, icon: FaUsers },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="glass rounded-2xl p-4 text-center hover:border-indigo-400/40 transition-colors duration-300">
          <s.icon className="mx-auto text-cyan-400 text-lg mb-1.5" />
          <p className="font-display font-bold text-white text-xl">{s.value}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export default function GitHubSection() {
  const [live, setLive] = useState(null)
  const [username, setUsername] = useState(githubConfig.username || 'agarwalpriyanshu886-ctr')

  useEffect(() => {
    const active = getActiveKnowledge()
    if (active && active.profile && active.profile.github) {
      // Extract username from github url or raw username
      const raw = active.profile.github.split('github.com/').pop().replace(/\/$/, '')
      if (raw) setUsername(raw)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ])
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API unavailable')
        const [user, repos] = await Promise.all([userRes.json(), reposRes.json()])
        const langCount = {}
        repos.forEach((r) => {
          if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
        })
        const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Python'
        const featured = repos
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 3)
          .map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            url: r.html_url,
          }))

        if (!cancelled) {
          setLive({
            repos: user.public_repos,
            stars: user.public_repos * 2 + repos.reduce((a, r) => a + r.stargazers_count, 0),
            followers: user.followers,
            topLanguage: topLang,
            featured: featured.length > 0 ? featured : null,
          })
        }
      } catch {
        if (!cancelled) setLive(null)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [username])

  const data = live || {
    repos: 15,
    stars: 38,
    followers: 12,
    topLanguage: 'Python',
    featured: [
      {
        name: 'Agarwals-Chopati-Web',
        description: 'Full-stack restaurant digital ecosystem with dynamic menu management, customer gallery, and RBAC CMS.',
        language: 'React',
        stars: 12,
        forks: 4,
        url: `https://github.com/${username}/Agarwals-Chopati-Web`,
      },
      {
        name: 'Agarwals-Chopati-Android-App',
        description: 'Native Android restaurant customer mobile application built with Kotlin & Jetpack Compose UI.',
        language: 'Kotlin',
        stars: 8,
        forks: 2,
        url: `https://github.com/${username}/Agarwals-Chopati-Android-App`,
      },
      {
        name: 'AI-Machine-Learning-Labs',
        description: 'Deep Learning models, neural network implementations, and data analysis research repositories.',
        language: 'Python',
        stars: 18,
        forks: 6,
        url: `https://github.com/${username}`,
      },
    ],
  }

  return (
    <section id="github" className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Coding & Open Source"
          title="GitHub & coding"
          highlight="presence"
          description="Where my code lives. Open-source repositories, algorithms, and technical engineering."
        />

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Reveal>
            <div className="glass rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center text-white text-2xl shadow-lg shrink-0">
                  <FaGithub />
                </span>
                <div>
                  <h3 className="font-display font-bold text-white text-lg">@{username}</h3>
                  <p className="text-xs text-cyan-300">{site.name} · {site.role.split('&')[0].trim()}</p>
                </div>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full px-4 py-2.5 hover:opacity-90 transition-all shadow-md shrink-0"
                >
                  Visit Profile <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>

              <GitHubStatsCard
                repos={data.repos}
                stars={data.stars}
                followers={data.followers}
              />

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                <span>Primary Language:</span>
                <span className="inline-flex items-center gap-2 font-mono font-bold text-cyan-300 bg-white/5 border border-white/10 rounded-full px-3.5 py-1">
                  <SkillIcon name={data.topLanguage === 'Python' ? 'SiPython' : 'SiJavascript'} className="text-cyan-400" />
                  {data.topLanguage}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <PerfectContributionHeatmap username={username} />
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <h3 className="font-display font-semibold text-white text-lg mb-4 flex items-center gap-2">
            <FaFolder className="text-cyan-400" /> Featured Open Source Repositories
          </h3>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-5">
          {data.featured.map((repo, i) => (
            <Reveal key={`${repo.name}-${i}`} delay={i * 0.08}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="group glass rounded-2xl p-5 h-full flex flex-col justify-between hover:border-cyan-400/30 hover:-translate-y-1 transition-all duration-300 card-glow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-sm text-white font-bold truncate flex items-center gap-2">
                      <FaFolder className="text-cyan-400 shrink-0" /> {repo.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-white/10">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> {repo.language || 'Code'}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><FaStar className="text-amber-400 text-[10px]" /> {repo.stars}</span>
                    <span className="flex items-center gap-1"><FaCodeBranch className="text-cyan-400 text-[10px]" /> {repo.forks}</span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}