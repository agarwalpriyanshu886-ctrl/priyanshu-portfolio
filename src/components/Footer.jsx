import { FaGithub, FaLinkedinIn, FaInstagram, FaHeart } from 'react-icons/fa'
import { site } from '../data/site'

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] mt-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/3 bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 grid place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 font-display font-bold text-white text-sm">
              {site.initials}
            </span>
            <span className="font-display font-semibold text-white text-lg">{site.name}</span>
          </div>

          <p className="text-slate-500 max-w-md">{site.tagline}</p>

          <div className="flex items-center gap-3">
            {Object.entries(site.socials).map(([key, social]) => {
              const Icon = socialIcons[key]
              return (
                <a
                  key={key}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 grid place-items-center rounded-xl glass text-slate-400 hover:text-white hover:border-cyan-400/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon className="text-base" />
                </a>
              )
            })}
          </div>

          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          <p className="text-xs text-slate-700 flex items-center gap-1.5">
            Built with <FaHeart className="text-rose-500/70" /> React, Tailwind & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  )
}
