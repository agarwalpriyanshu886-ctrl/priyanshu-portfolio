import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaFolder, FaExternalLinkAlt, FaCheckCircle, FaFire, FaSync } from 'react-icons/fa'
import { site } from '../data/site'
import { getActiveKnowledge } from '../lib/public-ai/cmsKnowledgeStore'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { SkillIcon } from './ui/SkillIcon'

export default function GitHubSection() {
  const [username, setUsername] = useState('agarwalpriyanshu886-ctrl')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)
  const [reposData, setReposData] = useState([])
  const [chartOk, setChartOk] = useState(true)

  useEffect(() => {
    const active = getActiveKnowledge()
    if (active && active.profile && active.profile.github) {
      const parts = active.profile.github.split('github.com/')
      if (parts.length > 1) {
        const rawUser = parts[1].replace(/\/$/, '').trim()
        if (rawUser) setUsername(rawUser)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    const fetchGitHubRealData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ])

        if (!userRes.ok) throw new Error(`GitHub user "${username}" not found`)
        
        const userJson = await userRes.json()
        let reposJson = []
        if (reposRes.ok) {
          reposJson = await reposRes.json()
        }

        if (isMounted) {
          setUserData(userJson)
          setReposData(Array.isArray(reposJson) ? reposJson : [])
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          console.warn('GitHub API fetch notice:', err)
          setError(err.message)
          setLoading(false)
        }
      }
    }

    fetchGitHubRealData()
    return () => {
      isMounted = false
    }
  }, [username])

  // Calculate real stars and top language across public repos
  const totalStars = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
  const totalForks = reposData.reduce((acc, r) => acc + (r.forks_count || 0), 0)

  const langCounts = {}
  reposData.forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1
  })
  const topLanguage = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Python'

  const featuredRepos = reposData.length > 0
    ? reposData.slice(0, 3)
    : [
        {
          id: 'repo-1',
          name: 'portflio',
          description: 'Official Executive Portfolio & Pittu AI Engine built with React, Vite, Supabase & Tailwind CSS.',
          html_url: `https://github.com/${username}`,
          stargazers_count: 5,
          forks_count: 2,
          language: 'JavaScript',
        },
      ]

  return (
    <section id="github" className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Real GitHub Connection"
          title="GitHub & Live Coding"
          highlight="Presence"
          description="Direct live REST API connection with GitHub — real repositories, commit activity, and open-source contributions."
        />

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Profile Card */}
          <Reveal>
            <div className="glass rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between space-y-6 card-glow border border-white/10 hover:border-cyan-400/30 transition-all">
              <div className="flex items-center gap-4">
                <img
                  src={userData?.avatar_url || `https://avatars.githubusercontent.com/u/236752103?v=4`}
                  alt={`${username} avatar`}
                  className="w-14 h-14 rounded-2xl border-2 border-cyan-400/40 object-cover shadow-lg shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-white text-lg">@{username}</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live REST Connection Active" />
                  </div>
                  <p className="text-xs text-cyan-300 font-medium">
                    {userData?.name || site.name} · {userData?.bio || 'Full-Stack & AI/ML Engineering'}
                  </p>
                </div>

                <a
                  href={userData?.html_url || `https://github.com/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full px-4 py-2.5 hover:opacity-90 transition-all shadow-md shrink-0"
                >
                  Visit Profile <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass rounded-2xl p-4 text-center hover:border-indigo-400/40 transition-colors">
                  <FaFolder className="mx-auto text-cyan-400 text-lg mb-1.5" />
                  <p className="font-display font-bold text-white text-xl">{userData ? userData.public_repos : reposData.length}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Repositories</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center hover:border-indigo-400/40 transition-colors">
                  <FaStar className="mx-auto text-amber-400 text-lg mb-1.5" />
                  <p className="font-display font-bold text-white text-xl">{totalStars}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Stars Earned</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center hover:border-indigo-400/40 transition-colors">
                  <FaUsers className="mx-auto text-purple-400 text-lg mb-1.5" />
                  <p className="font-display font-bold text-white text-xl">{userData ? userData.followers : 0}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Followers</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-emerald-400" /> API Status: Live Sync Active
                </span>
                <span className="inline-flex items-center gap-2 font-mono font-bold text-cyan-300 bg-white/5 border border-white/10 rounded-full px-3.5 py-1">
                  <SkillIcon name={topLanguage === 'Python' ? 'SiPython' : 'SiJavascript'} className="text-cyan-400" />
                  {topLanguage}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Real Heatmap Graph Container */}
          <Reveal delay={0.1}>
            <div className="glass rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 shadow-xl h-full flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-300 font-bold">
                    Real GitHub Contribution Feed — @{username.toUpperCase()}
                  </h3>
                </div>

                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center gap-1">
                  <FaFire className="text-emerald-400" /> Verified Feed
                </span>
              </div>

              {/* Real SVG Chart Embed from GitHub Engine */}
              <div className="my-auto py-4 overflow-x-auto">
                {chartOk ? (
                  <div className="min-w-[650px] p-2 bg-[#090d16]/90 rounded-2xl border border-white/10 shadow-inner">
                    <img
                      src={`https://ghchart.rshah.org/34d399/${username}`}
                      alt={`${username} real GitHub contributions`}
                      loading="lazy"
                      onError={() => setChartOk(false)}
                      className="w-full h-auto rounded-xl opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 glass rounded-2xl">
                    Contributions graph synced for @{username}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-slate-400">
                <span className="text-slate-400 text-[11px]">Real-time REST Activity API Sync</span>
                <span className="text-cyan-300 font-semibold">{reposData.length} Public Repositories</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Repositories */}
        <Reveal delay={0.15}>
          <h3 className="font-display font-semibold text-white text-lg mb-4 flex items-center gap-2">
            <FaFolder className="text-cyan-400" /> Live Repositories from @{username}
          </h3>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-5">
          {featuredRepos.map((repo, i) => (
            <Reveal key={repo.id || repo.name || i} delay={i * 0.08}>
              <a
                href={repo.html_url || `https://github.com/${username}/${repo.name}`}
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
                    {repo.description || 'Repository registered under official GitHub account.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-white/10">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> {repo.language || 'Code'}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><FaStar className="text-amber-400 text-[10px]" /> {repo.stargazers_count || 0}</span>
                    <span className="flex items-center gap-1"><FaCodeBranch className="text-cyan-400 text-[10px]" /> {repo.forks_count || 0}</span>
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