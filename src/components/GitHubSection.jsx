import { useEffect, useState } from 'react'
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaFolder } from 'react-icons/fa'
import { githubConfig } from '../data/github'
import { site } from '../data/site'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { SkillIcon } from './ui/SkillIcon'

const weeks = 46
const days = 7

function heatmapData(seed) {
  const arr = []
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const x = Math.sin(seed + w * 13.7 + d * 7.3) * 100
      const level = Math.max(0, Math.min(4, Math.floor((x % 5) + 5) % 5))
      arr.push(level)
    }
  }
  return arr
}

function ContributionHeatmap({ username }) {
  const [imgOk, setImgOk] = useState(true)
  useEffect(() => {
    setImgOk(true)
  }, [username])

  const cell = 'w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[3px]'
  const colors = ['bg-white/[0.05]', 'bg-indigo-500/30', 'bg-indigo-500/50', 'bg-indigo-400/75', 'bg-cyan-400']
  const data = heatmapData(5)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
          {githubConfig.enabled ? `Contribution graph — @${username}` : 'Contribution graph (placeholder)'}
        </p>
        <span className="text-xs text-slate-500 font-mono">last year</span>
      </div>

      {githubConfig.enabled && imgOk ? (
        <img
          src={`https://ghchart.rshah.org/${username}`}
          alt={`${username} GitHub contribution graph`}
          loading="lazy"
          onError={() => setImgOk(false)}
          className="w-full h-auto rounded-md"
        />
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="min-w-max">
            <div className="flex gap-[3px] mb-2 pl-1">
              {months.map((m) => (
                <span key={m} className="flex-1 text-[10px] text-slate-600 font-mono">
                  {m}
                </span>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {Array.from({ length: weeks }, (_, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {data.slice(w * days, w * days + days).map((level, d) => (
                    <span key={d} className={`${cell} ${colors[level]} transition-colors duration-300 hover:ring-1 hover:ring-cyan-400/50`} />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-3 pl-1 text-[10px] text-slate-600 font-mono">
              Less
              {colors.map((c) => (
                <span key={c} className={`${cell} ${c}`} />
              ))}
              More
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function GitHubStats({ repos, stars, followers }) {
  const stats = [
    { label: 'Repositories', value: repos, icon: FaFolder },
    { label: 'Stars', value: stars, icon: FaStar },
    { label: 'Followers', value: followers, icon: FaUsers },
  ]
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="glass rounded-2xl p-4 text-center hover:border-indigo-400/40 transition-colors duration-300">
          <s.icon className="mx-auto text-cyan-400 text-lg mb-1.5" />
          <p className="font-display font-bold text-white text-xl">{s.value}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export default function GitHubSection() {
  const [live, setLive] = useState(null)
  const cfg = githubConfig

  useEffect(() => {
    if (!cfg.enabled || !cfg.username) return
    let cancelled = false
    const load = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${cfg.username}`),
          fetch(`https://api.github.com/users/${cfg.username}/repos?per_page=100&sort=updated`),
        ])
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API unavailable')
        const [user, repos] = await Promise.all([userRes.json(), reposRes.json()])
        const langCount = {}
        repos.forEach((r) => {
          if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
        })
        const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0]
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
            featured,
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
  }, [cfg.enabled, cfg.username])

  const data = live || {
    repos: cfg.stats.repositories,
    stars: cfg.stats.stars,
    followers: cfg.stats.followers,
    topLanguage: 'JavaScript',
    featured: cfg.pinnedRepos.map((r) => ({
      ...r,
      url: r.url || `https://github.com/${cfg.username}/${r.name}`,
      stars: 0,
      forks: 0,
    })),
  }

  const langIcon =
    data.topLanguage === 'Python'
      ? 'SiPython'
      : data.topLanguage === 'Kotlin'
      ? 'SiKotlin'
      : data.topLanguage === 'C++'
      ? 'SiCplusplus'
      : data.topLanguage === 'Java'
      ? 'SiOpenjdk'
      : 'SiJavascript'

  return (
    <section id="github" className="relative py-24 lg:py-28 overflow-hidden">
      <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Coding"
          title="GitHub & coding"
          highlight="presence"
          description="Where my code lives. Open source, experiments and everything in between."
        />

        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          <Reveal>
            <div className="glass rounded-2xl p-6 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center">
                  <FaGithub className="text-white text-2xl" />
                </span>
                <div>
                  <p className="font-display font-semibold text-white">@{cfg.username}</p>
                  <p className="text-sm text-slate-400">{site.name} · {site.role.split('&')[0].trim()}</p>
                </div>
                <a
                  href={site.socials.github.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-2 text-sm text-slate-300 glass rounded-full px-4 py-2 hover:text-white hover:border-white/20 transition-colors duration-300"
                >
                  Visit <FaGithub />
                </a>
              </div>
              <GitHubStats
                repos={data.repos}
                stars={data.stars}
                followers={data.followers}
              />
              <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                <span>Most used:</span>
                <span className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5">
                  <SkillIcon name={langIcon} className="text-cyan-400" /> {data.topLanguage}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContributionHeatmap username={cfg.username} />
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <h3 className="font-display font-semibold text-white text-lg mb-4">Featured repositories</h3>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-5">
          {data.featured.map((repo, i) => (
            <Reveal key={`${repo.name}-${i}`} delay={i * 0.08}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="group glass rounded-2xl p-5 h-full block hover:border-cyan-400/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FaFolder className="text-cyan-400" />
                  <span className="font-mono text-sm text-white font-medium truncate">{repo.name}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
                  {repo.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> {repo.language || 'N/A'}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><FaStar /> {repo.stars}</span>
                    <span className="flex items-center gap-1"><FaCodeBranch /> {repo.forks}</span>
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