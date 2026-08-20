import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, highlight, description, align = 'center' }) {
  return (
    <Reveal className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-cyan-400 glass rounded-full px-3.5 py-1 mb-3 border border-cyan-400/20">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
        {title} <span className="text-gradient animate-gradient-x">{highlight}</span>
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </Reveal>
  )
}
