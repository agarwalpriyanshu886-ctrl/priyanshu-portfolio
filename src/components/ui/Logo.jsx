import { site } from '../../data/site'

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center font-display font-bold text-white text-base shadow-[0_4px_20px_-4px_rgb(99_102_241/0.6)] group-hover:scale-105 transition-transform duration-300">
        {site.initials}
      </div>
      <span className="font-display font-bold text-white text-lg tracking-tight">
        {site.name.split(' ')[0]}
        <span className="text-cyan-400">.</span>
      </span>
    </div>
  )
}
